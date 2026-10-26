'use strict';
// Google Drive appDataFolder is private to the signed-in Google account.
(() => {
  const SAVE_NAME='starlight-chronicle-save.json';
  const SCOPE='openid email profile https://www.googleapis.com/auth/drive.appdata';
  const SESSION_KEY='starlight-google-session-v1';
  let token='',driveFileId='',tokenClient,saveTimeout,googleProfile,pendingRole='child',autoConnectStarted=false;
  const configured=()=>Boolean(window.STARLIGHT_GOOGLE_CLIENT_ID&&window.STARLIGHT_GOOGLE_CLIENT_ID.trim());
  const api=async(url,options={})=>{const r=await fetch(url,{...options,headers:{Authorization:`Bearer ${token}`,...options.headers}});if(!r.ok)throw new Error(`Google Drive 同步失敗（${r.status}）`);return r.status===204?null:r.json()};
  const findSave=async()=>{const q=encodeURIComponent(`name='${SAVE_NAME}' and 'appDataFolder' in parents and trashed=false`);const r=await api(`https://www.googleapis.com/drive/v3/files?spaces=appDataFolder&q=${q}&fields=files(id,name,modifiedTime)`);return r.files?.[0]||null};
  const loadSave=async()=>{const file=await findSave();if(!file)return null;driveFileId=file.id;return api(`https://www.googleapis.com/drive/v3/files/${file.id}?alt=media`)};
  const createSave=async(payload)=>{const boundary=`starlight-${crypto.randomUUID()}`;const body=`--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${JSON.stringify({name:SAVE_NAME,parents:['appDataFolder'],mimeType:'application/json'})}\r\n--${boundary}\r\nContent-Type: application/json\r\n\r\n${JSON.stringify(payload)}\r\n--${boundary}--`;const r=await api('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart',{method:'POST',headers:{'Content-Type':`multipart/related; boundary=${boundary}`},body});driveFileId=r.id};
  const saveNow=async()=>{if(!token||!sessionRole)return;try{if(!driveFileId){const current=await findSave();driveFileId=current?.id||''}if(driveFileId)await api(`https://www.googleapis.com/upload/drive/v3/files/${driveFileId}?uploadType=media`,{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});else await createSave(data)}catch(err){console.warn(err);notify('未能儲存到 Google Drive，稍後會再試。')}};
  const localPersist=persist;
  persist=function(){localPersist();if(token){clearTimeout(saveTimeout);saveTimeout=setTimeout(saveNow,500)}};
  function rememberSession(role){
    try{localStorage.setItem(SESSION_KEY,JSON.stringify({role,at:Date.now()}))}catch{}
  }
  function forgetSession(){
    try{localStorage.removeItem(SESSION_KEY)}catch{}
    token='';driveFileId='';googleProfile=null;
  }
  function savedRole(){
    try{const saved=JSON.parse(localStorage.getItem(SESSION_KEY)||'null');return ['child','parent'].includes(saved?.role)?saved.role:null}catch{return null}
  }
  async function activateGoogle(role){const me=await api('https://www.googleapis.com/oauth2/v3/userinfo');googleProfile=me;familyStorageKey=`starlight-google-${me.sub}`;let cloud=await loadSave();if(!cloud){cloud=initial();cloud.nickname=me.given_name||me.name||'小小冒險者';cloud.parentName=me.name||''}data=cloud;migrateCrystalCurrency(data);upgradeSave();chosen=data.hero??0;sessionRole=role;rememberSession(role);persist();go(role==='parent'?'admin':(data.hero===null?'select':'room'));notify(`已連結 ${me.email} 嘅私人 Google Drive。`)}
  function connect(role,silent=false){
    if(!configured()||!window.google?.accounts?.oauth2)return false;
    pendingRole=role;
    tokenClient??=google.accounts.oauth2.initTokenClient({client_id:window.STARLIGHT_GOOGLE_CLIENT_ID,scope:SCOPE,callback:async response=>{
      if(response.error){if(!silent&&$('#login-error'))$('#login-error').textContent='Google 登入未完成。';return}
      token=response.access_token;driveFileId='';
      try{await activateGoogle(pendingRole)}catch(err){if(!silent&&$('#login-error'))$('#login-error').textContent=err.message||'未能讀取 Google Drive 存檔。'}
    }});
    tokenClient.requestAccessToken({prompt:silent?'':'select_account'});
    return true;
  }
  function restoreGoogleSession(tries=0){
    const role=savedRole();
    if(!role||autoConnectStarted||sessionRole)return;
    if(!window.google?.accounts?.oauth2){if(tries<30)setTimeout(()=>restoreGoogleSession(tries+1),200);return}
    autoConnectStarted=true;
    connect(role,true);
  }
  const baseLogin=login;
  login=function(){const html=baseLogin();return html.replace('</form><p class="gate-demo">',`</form><div class="google-login"><span>或者使用你自己嘅雲端存檔</span><button class="google-signin" type="button" data-google-login="${role}"><b>G</b> 使用 Google 登入</button><small>資料會儲存到此 Google 帳戶的私人 Drive appDataFolder。</small></div><p class="gate-demo">`)};
  document.addEventListener('click',e=>{const b=e.target.closest('[data-google-login]');if(!b)return;e.preventDefault();connect(b.dataset.googleLogin)},true);
  document.addEventListener('click',e=>{if(e.target.closest('[data-action="logout"]'))forgetSession()},true);
  window.starlightGoogleDrive={saveNow,connected:()=>Boolean(token),profile:()=>googleProfile,forget:forgetSession};
  if(page==='login')render();
  restoreGoogleSession();
})();
