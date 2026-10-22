const {test}=require('node:test');const assert=require('node:assert/strict');const {createApp,makePrompt,validateQuestions}=require('../server.cjs');
const brief={subject:'數學',grade:3,topic:'乘法',difficulty:'適中',type:'choice',count:1};
test('AI prompt only includes the allowed curriculum fields',()=>{const p=makePrompt({...brief,nickname:'PRIVATE',birthYear:2018,apiKey:'SECRET'});assert(!JSON.stringify(p).includes('PRIVATE'));assert(!JSON.stringify(p).includes('2018'));assert(!JSON.stringify(p).includes('SECRET'));assert.equal(JSON.parse(p.input).count,1)});
test('AI output rejects out-of-range answers, wrong counts and empty keys',()=>{const q={type:'choice',prompt:'2+2',options:['3','4'],answer:'2',explanation:'4'};assert.equal(validateQuestions({questions:[q]},1)[0].answer,'2');assert.throws(()=>validateQuestions({questions:[{...q,answer:'8'}]},1));assert.throws(()=>validateQuestions({questions:[q]},2));assert.throws(()=>validateQuestions({questions:[{...q,answer:''}]},1))});
test('AI key is session-only, never returned, logout revokes it and provider request is validated',async()=>{
 let providerCalls=0;const secret='sk-test-fixture-not-real-key';const server=createApp({fetchImpl:async(url,options)=>{providerCalls++;assert.equal(url,'https://api.openai.com/v1/responses');assert.equal(options.headers.Authorization,'Bearer '+secret);const req=JSON.parse(options.body);assert.equal(req.store,false);assert.equal(req.text.format.type,'json_schema');assert(!options.body.includes(secret));return {ok:true,json:async()=>({status:'completed',output:[{type:'message',content:[{type:'output_text',text:JSON.stringify({questions:[{type:'choice',prompt:'2+2?',options:['3','4'],answer:'2',explanation:'2加2等於4'}]})}]}]})}}});await new Promise(r=>server.listen(0,'127.0.0.1',r));const root='http://127.0.0.1:'+server.address().port;
 try{
 const call=(u,body,cookie)=>fetch(root+u,{method:body?'POST':'GET',headers:{'Content-Type':'application/json',...(cookie?{Cookie:cookie}:{})},...(body?{body:JSON.stringify(body)}:{})});
 assert.equal((await call('/api/ai/config')).status,401);
 const login=await call('/api/parent/login',{username:'admin',password:'admin'});assert.equal(login.status,200);const cookie=login.headers.get('set-cookie').split(';')[0];assert(login.headers.get('set-cookie').includes('HttpOnly'));
 const conf=await call('/api/ai/config',{key:secret,model:'gpt-4.1-mini'},cookie);const configText=await conf.text();assert.equal(conf.status,200);assert(!configText.includes(secret));assert(!JSON.stringify(await(await call('/api/ai/config',null,cookie)).json()).includes(secret));
 const out=await call('/api/ai/generate',{...brief,nickname:'PRIVATE'},cookie);assert.equal(out.status,200);assert.equal((await out.json()).questions.length,1);assert.equal(providerCalls,1);
 const badOrigin=await fetch(root+'/api/ai/config',{headers:{Cookie:cookie,Origin:'https://evil.example'}});assert.equal(badOrigin.status,403);
 await call('/api/parent/logout',{},cookie);assert.equal((await call('/api/ai/config',null,cookie)).status,401);
 }finally{await new Promise(r=>server.close(r))}
});
