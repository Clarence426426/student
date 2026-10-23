'use strict';
// Keeps the browser responsive while mirroring one family's game state to the server.
// The server is the source of truth after every successful login.
(() => {
  if (location.hostname.endsWith('github.io')||location.protocol==='file:') return;
  const browserPersist=persist;
  let saveTimer=null,hydrating=false;
  const normalise=()=>{migrateCrystalCurrency(data);upgradeSave();if(data.hero!==null&&(!Number.isInteger(data.hero)||data.hero<0||data.hero>=heroes.length))data.hero=0;chosen=data.hero??0};
  const queueSave=(now=false)=>{
    if(hydrating)return;
    clearTimeout(saveTimer);
    saveTimer=setTimeout(async()=>{
      if(!sessionRole)return;
      try{await localAPI('/api/state',{method:'PUT',body:JSON.stringify(data)})}
      catch(err){if(!String(err.message).includes('重新以'))notify('暫時未能同步到雲端；會在下一次操作再試。')}
    },now?0:450);
  };
  persist=function(){browserPersist();queueSave()};
  const browserActivate=activateFamily;
  activateFamily=function(profile){
    clearTimeout(saveTimer);browserActivate(profile);
    Promise.resolve().then(async()=>{
      try{
        const result=await localAPI('/api/state');
        hydrating=true;
        if(result.data)data=result.data;
        normalise();
        browserPersist();
        hydrating=false;
        if(!result.data)queueSave(true);
        if(sessionRole)render();
      }catch(err){hydrating=false;notify('未能讀取雲端進度，暫時使用這部裝置的副本。')}
    });
  };
})();
