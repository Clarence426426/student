'use strict';
const fs=require('node:fs'),path=require('node:path');
const {randomBytes,scryptSync,timingSafeEqual}=require('node:crypto');
const {DatabaseSync}=require('node:sqlite');

function accountStore(file){
 fs.mkdirSync(path.dirname(file),{recursive:true,mode:0o700});
 // A pre-cloud JSON save is kept as a recovery copy rather than overwritten.
 if(fs.existsSync(file)){const first=fs.readFileSync(file,'utf8').trimStart()[0];if(first==='{'||first==='[')fs.renameSync(file,file+'.legacy.json')}
 const db=new DatabaseSync(file);
 db.exec('PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON; CREATE TABLE IF NOT EXISTS families (id TEXT PRIMARY KEY, username TEXT UNIQUE NOT NULL, child_username TEXT UNIQUE NOT NULL, parent_name TEXT NOT NULL, nickname TEXT NOT NULL, grade INTEGER NOT NULL, birth_year INTEGER NOT NULL, parent_salt TEXT NOT NULL, parent_hash TEXT NOT NULL, child_salt TEXT NOT NULL, child_hash TEXT NOT NULL, state_json TEXT, created_at TEXT NOT NULL)');
 const hash=password=>{const salt=randomBytes(16).toString('hex');return {salt,hash:scryptSync(password,salt,64).toString('hex')}};
 const check=(password,salt,digest)=>typeof password==='string'&&password.length<=128&&timingSafeEqual(Buffer.from(digest,'hex'),scryptSync(password,salt,64));
 const profile=row=>({familyId:row.id,parentName:row.parent_name,nickname:row.nickname,grade:row.grade,birthYear:row.birth_year});
 const serialiseState=value=>{let json;try{json=JSON.stringify(value)}catch{throw Error('遊戲資料格式無法保存。')}if(!json||json.length>250000)throw Error('遊戲資料太大，暫時無法保存。');return json};
 return {
  async register(body){
   const text=key=>String(body[key]||'').trim(),username=text('username').toLowerCase(),childUsername=text('childUsername').toLowerCase();
   if(!/^[a-z0-9_-]{3,32}$/.test(username)||!/^[a-z0-9_-]{3,32}$/.test(childUsername)||username===childUsername||[username,childUsername].some(value=>['admin','test'].includes(value)))throw Error('請使用不同的家長及小朋友帳戶名稱（3–32 個英文字母、數字、_ 或 -）。');
   if(['password','childPassword'].some(key=>typeof body[key]!=='string'||body[key].length<8||body[key].length>128))throw Error('兩個帳戶密碼都需要 8–128 個字元。');
   if(!text('parentName')||text('parentName').length>60||!text('nickname')||text('nickname').length>30||!Number.isInteger(body.grade)||body.grade<1||body.grade>6||!Number.isInteger(body.birthYear)||body.birthYear<2000||body.birthYear>new Date().getFullYear())throw Error('請填妥家長稱呼、小朋友暱稱、年級及出生年份。');
   const duplicate=db.prepare('SELECT 1 FROM families WHERE username=? OR child_username=? OR username=? OR child_username=?').get(username,username,childUsername,childUsername);
   if(duplicate)throw Error('這個帳戶名稱已有人使用，請換另一個。');
   const parent=hash(body.password),child=hash(body.childPassword),id=randomBytes(16).toString('hex');
   db.prepare('INSERT INTO families (id,username,child_username,parent_name,nickname,grade,birth_year,parent_salt,parent_hash,child_salt,child_hash,created_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)').run(id,username,childUsername,text('parentName'),text('nickname'),body.grade,body.birthYear,parent.salt,parent.hash,child.salt,child.hash,new Date().toISOString());
   return {familyId:id,parentName:text('parentName'),nickname:text('nickname'),grade:body.grade,birthYear:body.birthYear};
  },
  async login(role,username,password){
   if(typeof username!=='string')return null;
   const column=role==='parent'?'username':'child_username';
   const row=db.prepare(`SELECT * FROM families WHERE ${column}=?`).get(username.trim().toLowerCase());
   if(!row||!check(password,row[role==='parent'?'parent_salt':'child_salt'],row[role==='parent'?'parent_hash':'child_hash']))return null;
   return profile(row);
  },
  async getState(familyId){const row=db.prepare('SELECT state_json FROM families WHERE id=?').get(familyId);if(!row||!row.state_json)return null;try{return JSON.parse(row.state_json)}catch{return null}},
  async saveState(familyId,state){const json=serialiseState(state);let result=db.prepare('UPDATE families SET state_json=? WHERE id=?').run(json,familyId);if(!result.changes&&familyId==='demo'){const parent=hash(randomBytes(24).toString('hex')),child=hash(randomBytes(24).toString('hex'));db.prepare('INSERT OR IGNORE INTO families (id,username,child_username,parent_name,nickname,grade,birth_year,parent_salt,parent_hash,child_salt,child_hash,state_json,created_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)').run('demo','__demo_parent','__demo_child','家長','小小冒險者',3,2017,parent.salt,parent.hash,child.salt,child.hash,json,new Date().toISOString());result=db.prepare('UPDATE families SET state_json=? WHERE id=?').run(json,familyId)}if(!result.changes)throw Error('找不到家庭帳戶。');return JSON.parse(json)}
 };
}

module.exports={accountStore};
