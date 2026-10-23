'use strict';
(() => {
  heroes.splice(1);
  Object.assign(heroes[0],{name:'森之劍士',en:'FOREST KNIGHT',desc:'每一級都會令勇者嘅裝備更強大。'});
  const stages=[
    {at:0,key:'base',title:'初心森林劍士',gear:'初心者之劍',outfit:'森林見習披風',image:null,actions:null},
    {at:2,key:'two',title:'青葉守衛',gear:'橡木圓盾與鋼劍',outfit:'青葉護甲',image:'assets/hero-level-2.png',actions:'assets/hero-level-2-actions.png'},
    {at:5,key:'five',title:'翡翠遊俠',gear:'翡翠星鋒',outfit:'繡金森林長衣',image:'assets/hero-level-5.png',actions:'assets/hero-level-5-actions.png'},
    {at:10,key:'ten',title:'星光守護者',gear:'月銀星光劍與守護盾',outfit:'星圖守護戰袍',image:'assets/hero-level-10.png',actions:'assets/hero-level-10-actions.png'}
  ];
  const actionSheets=Object.fromEntries(stages.filter(stage=>stage.actions).map(stage=>{
    const image=new Image();
    image.onload=()=>updateHeroSprites();
    image.src=stage.actions;
    return [stage.key,image];
  }));
  const currentStage=()=>stages.slice().reverse().find(stage=>level()>=stage.at)||stages[0];
  const basePortrait=portrait;
  portrait=function(_hero,cls='portrait'){
    const stage=currentStage();
    if(!stage.image)return basePortrait(0,cls);
    if(cls.includes('actor-sprite'))return `<div class="${cls} upgraded-hero upgraded-${stage.key}" data-upgrade="${stage.key}" aria-hidden="true"></div>`;
    return `<img class="${cls} upgraded-hero upgraded-${stage.key}" src="${stage.image}" alt="${stage.title}" data-upgrade="${stage.key}">`;
  };
  const spriteUpdater=updateHeroSprites;
  function paintUpgradePose(el,stage,action){
    const image=actionSheets[stage.key];
    if(!image?.complete||!image.naturalWidth||!el.clientWidth||!el.clientHeight){
      el.style.setProperty('background-image',`url('${stage.image}')`,'important');
      el.style.setProperty('background-size','contain','important');
      el.style.setProperty('background-position','center bottom','important');
    }else{
      const frame=poseColumns[action]??poseColumns.walk;
      const style=spriteStyle(image,10,frame,el.clientWidth,el.clientHeight);
      el.style.setProperty('background-image',`url('${stage.actions}')`,'important');
      el.style.setProperty('background-size',style.size,'important');
      el.style.setProperty('background-position',style.position,'important');
      el.dataset.spriteAction=action;
    }
    el.classList.add('upgrade-scene-hero');
    el.style.setProperty('background-repeat','no-repeat','important');
  }
  updateHeroSprites=function(){
    const stage=currentStage();
    if(!stage.image)return spriteUpdater();
    document.querySelectorAll('.room-actor .actor-sprite').forEach(el=>paintUpgradePose(el,stage,roomSpriteAction(el.closest('.room-actor'))));
    document.querySelectorAll('.exp-hero').forEach(el=>paintUpgradePose(el,stage,timer?.running?combatSpriteAction(elapsed()):'walk'));
    document.querySelectorAll('.rest-sleeper').forEach(el=>paintUpgradePose(el,stage,'sleep'));
  };
  const originalRender=render;
  render=function(){
    data.hero=0;
    const stage=currentStage();
    heroes[0].gear=stage.gear;heroes[0].color=stage.outfit;
    originalRender();
    updateHeroSprites();
  };
  const originalPersist=persist;
  persist=function(){
    const stage=currentStage(),previous=data.heroUpgradeAt??0;
    data.heroUpgradeAt=Math.max(previous,stage.at);
    originalPersist();
    if(stage.at>previous)setTimeout(()=>notify(`勇者升至 Lv.${stage.at}！已獲得「${stage.title}」新裝備。`),120);
  };
  const originalStats=statsBody;
  statsBody=function(){
    const stage=currentStage();
    return originalStats().replace('PLAYER STATISTICS',`PLAYER STATISTICS · ${stage.title}`).replace('EQUIPMENT · 裝備',`EQUIPMENT · ${stage.at?`Lv.${stage.at} 升級裝備`:'初心裝備'}`);
  };
  characterSelect=function(){
    const year=Number(today().slice(0,4));
    return `<main class="paper-screen screen hero-profile-screen"><header class="topbar">${brand()}<button class="nav-pill" data-action="logout">${icon('logout')} 登出</button></header><section class="hero-profile-card paper"><div class="single-hero-showcase">${portrait(0,'hero-profile-art')}<div><p class="section-kicker">YOUR ADVENTURER</p><h1>森之劍士</h1><p>你嘅專屬勇者已經準備好。努力升級，就會獲得更強嘅裝備。</p><div class="upgrade-track">${stages.map(stage=>`<span class="${level()>=stage.at?'unlocked':''}">Lv.${stage.at}<small>${stage.title}</small></span>`).join('')}</div></div></div><div class="profile-fields"><label class="field" for="nickname">勇者名字</label><input class="input" id="nickname" maxlength="16" value="${esc(data.nickname)}"><div class="form-grid"><div><label class="field" for="grade">目前年級</label><select class="input" id="grade" required><option value="">選擇年級</option>${[1,2,3,4,5,6].map(n=>`<option value="${n}" ${Number(data.grade)===n?'selected':''}>小學${['一','二','三','四','五','六'][n-1]}年級</option>`).join('')}</select></div><div><label class="field" for="birth-year">出生年份</label><select class="input" id="birth-year" required><option value="">選擇出生年份</option>${Array.from({length:26},(_,i)=>year-i).map(y=>`<option value="${y}" ${Number(data.birthYear)===y?'selected':''}>${y} 年</option>`).join('')}</select></div></div><p class="error" id="profile-error" role="alert"></p><button class="primary" data-action="confirm-hero">開始冒險 ${icon('arrow')}</button></div></section></main>`;
  };
  render();
})();
