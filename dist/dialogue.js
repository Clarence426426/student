'use strict';
// Original encouragement is kept separate from attributed public-domain quotations.
const ROOM_DIALOGUE_GROUPS={
 cantonese:[
 '今日學識一樣新嘢，已經好值得開心。',
 '唔使一步登天，行好眼前呢一步就得。',
 '你肯開始，就已經踏出勇敢嘅一步。',
 '唔明唔緊要，問一問就多一條線索。',
 '錯咗一題，可能就發現咗一個新方法。',
 '慢慢嚟，學習唔係鬥快。',
 '你嘅努力，唔止一個分數睇得晒。',
 '今日嘅你，可以比尋日多識少少。',
 '試多一個方法，可能就會豁然開朗。',
 '肯改正，就係成長緊嘅證明。',
 '將大任務拆細，一小步都算進步。',
 '先做最容易嗰一步，幫自己熱熱身。',
 '一道難題，可以分幾次慢慢諗。',
 '試吓講出你點諗，思路會清楚啲。',
 '答之前，先睇清楚題目問緊乜。',
 '計完一次，再檢查單位同符號。',
 '寫低唔明嘅地方，等陣一齊問。',
 '學完試吓合埋書，講返重點畀自己聽。',
 '用自己嘅說話解釋，就更容易發現邊度未明。',
 '舉個生活例子，知識就會親切啲。',
 '生字可以畫成圖，幫自己記住意思。',
 '將相似嘅字放埋一齊，睇清楚有咩唔同。',
 '讀故事嗰陣，試吓估下一頁會發生咩事。',
 '數學唔止得答案，方法都值得欣賞。',
 '遇到應用題，可以先畫幅小圖。',
 '訂正唔係重做一次，而係搵到更清楚嘅方法。',
 '揀一個細目標，例如今日弄明白一題。',
 '做完一小段，停一停睇吓自己學到咩。',
 '今日最想問嘅一條問題，係乜嘢呢？',
 '你可以同家長講：呢度我想再學一次。',
 '攰咗可以休息，照顧自己都好重要。',
 '飲啖水，畀自己一個小小停頓。',
 '伸展一下肩膊，準備好再出發。',
 '眼睛望一望遠處，畀佢哋休息吓。',
 '好好瞓覺，都係學習旅程嘅一部分。',
 '有時休息之後，會有新嘅諗法。',
 '今日做唔晒，可以同家長商量點安排。',
 '覺得緊張，可以慢慢呼吸幾下。',
 '唔使同其他人比，你有自己嘅步伐。',
 '你可以為自己認真試過而自豪。',
 '好奇心，就係打開知識寶箱嘅鎖匙。',
 '每一個「點解」，都可能帶你去新地方。',
 '今日想發現一個關於世界嘅秘密嗎？',
 '書本入面，可能藏住你下一個興趣。',
 '學識一個新詞，就多一種表達方法。',
 '你留意到嘅小細節，都值得分享。',
 '試吓問：如果換個方法，會點呢？',
 '一個好問題，有時比即刻答啱更有意思。',
 '同朋友交流方法，可以互相學到新嘢。',
 '聽吓別人點諗，再試吓講出自己嘅理由。',
 '我嘅背囊裝住地圖，你嘅腦袋裝住新發現！',
 '今日嘅冒險，可能由翻開一頁書開始。',
 '知識小水晶，係一點一滴儲返嚟㗎。',
 '呢間小屋，永遠有個位畀你好好諗嘢。',
 '勇者都會問路，唔需要乜都自己識。',
 '遇到難題，先觀察，再揀一條路試吓。',
 '一本書，就好似一張通往新世界嘅地圖。',
 '寶箱唔一定有水晶，有時係一個好主意。',
 '學識求助，都係勇者嘅本領。',
 '我哋帶住好奇心出發啦！',
 '記得欣賞自己今日認真做過嘅一件事。',
 '你可以話「我仲未明」，唔需要話「我一定唔得」。',
 '試過之後發現方法唔啱，都係有用嘅經驗。',
 '有啲嘢要練幾次先熟，完全唔出奇。',
 '今日識少少，下次可以再加少少。',
 '唔同嘅人，可以有唔同嘅解題方法。',
 '將學到嘅嘢教畀小伙伴聽，睇吓有咩新發現。',
 '你嘅想像力，都可以幫手解難。',
 '做完任務，記得同自己講聲辛苦晒。',
 '學習嘅路好長，每一步都可以有新風景。'
 ],
 chinese:[
 '把不懂的地方圈起來，就是找到下一個學習方向。',
 '認真觀察生活，課本上的知識也會變得生動。',
 '願意傾聽，也願意提問，都是學習的好習慣。',
 '學習不只為了考試，也為了看懂更大的世界。',
 '當你能說明原因，答案就不只是一個數字。',
 '一次練習不決定你的能力，成長需要時間。',
 '把新的知識和熟悉的事情連起來，試試有甚麼發現。',
 '做事有計劃，也要為休息留下位置。',
 '從書中認識不同的人，也學習理解不同的想法。',
 '今天的疑問，可能成為明天的新發現。'
 ],
 english:[
 ['One small step is still a step.','一小步，都係向前行緊。'],
 ['Questions open new doors.','問問題，可以打開新嘅門。'],
 ['Take your time. You are learning.','慢慢嚟，你正在學習。'],
 ['A mistake can be a useful clue.','錯誤，都可以係有用嘅線索。'],
 ['You can ask for help.','需要幫手嗰陣，可以開口問。'],
 ['Try a different way.','試吓換一個方法。'],
 ['Rest, then try again.','休息一下，準備好再試。'],
 ['Your ideas are worth sharing.','你嘅諗法，值得同人分享。'],
 ['Be curious about the world.','帶住好奇心，認識世界。'],
 ['Notice what you learned today.','留意吓今日學識咗啲乜。']
 ]
};
const ROOM_CLASSICS=[
 ['學而時習之，不亦說乎？','《論語・學而》','學過之後時常溫習，也可以感受到學習嘅喜悅。','https://www.edb.gov.hk/attachment/tc/curriculum-development/kla/chi-edu/recommended-passages/PingYin/stage2/KS2_01_pinyin.pdf'],
 ['溫故而知新，可以為師矣。','《論語・為政》','重溫學過嘅知識，可能會有新嘅理解。','https://www.edb.gov.hk/attachment/tc/curriculum-development/kla/chi-edu/recommended-passages/PingYin/stage2/KS2_01_pinyin.pdf'],
 ['學而不思則罔，思而不學則殆。','《論語・為政》','學習同思考要一齊做，唔好只係背答案。','https://www.edb.gov.hk/attachment/tc/curriculum-development/kla/chi-edu/recommended-passages/PingYin/stage2/KS2_01_pinyin.pdf'],
 ['知之為知之，不知為不知，是知也。','《論語・為政》','識就話識，唔明就承認，先容易搵到學習方向。','https://zh.wikisource.org/wiki/論語註疏/卷02'],
 ['三人行，必有我師焉。','《論語・述而》','身邊每個人，都可能有值得我哋學習嘅地方。','https://www.edb.gov.hk/tc/curriculum-development/kla/chi-edu/second-lang/student.html'],
 ['敏而好學，不恥下問。','《論語・公冶長》','喜歡學習，唔怕向人請教。','https://www.edb.gov.hk/tc/curriculum-development/kla/chi-edu/second-lang/student.html'],
 ['知之者不如好之者，好之者不如樂之者。','《論語・雍也》','搵到學習嘅興趣，同樣值得珍惜。','https://zh.wikisource.org/wiki/中庸論上'],
 ['學不可以已。','《荀子・勸學》','學習可以陪我哋成長，日日都有新嘢可以認識。','https://zh.wikisource.org/zh-hant/劝学'],
 ['不積跬步，無以至千里。','《荀子・勸學》','行得遠，係由一小步一小步開始。','https://zh.wikisource.org/zh-hant/劝学'],
 ['鍥而不舍，金石可鏤。','《荀子・勸學》','持續練習，可以慢慢做到原本覺得難嘅事。','https://zh.wikisource.org/zh-hant/劝学']
];
const ROOM_DIALOGUES=[
 ...ROOM_DIALOGUE_GROUPS.cantonese.map(text=>({text,category:'encouragement',lang:'zh-HK'})),
 ...ROOM_DIALOGUE_GROUPS.chinese.map(text=>({text,category:'reflection',lang:'zh-Hant'})),
 ...ROOM_DIALOGUE_GROUPS.english.map(([text,meaning])=>({text,meaning,category:'english',lang:'en'})),
 ...ROOM_CLASSICS.map(([text,source,meaning,url])=>({text,source,meaning,url,category:'classic',lang:'zh-Hant'}))
].map((entry,index)=>({id:index,...entry}));
function makeDialogueDeck({random=Math.random,saved=null,onSave=()=>{}}={}){
 const valid=saved&&Array.isArray(saved.remaining)&&saved.remaining.every(n=>Number.isInteger(n)&&n>=0&&n<ROOM_DIALOGUES.length)&&new Set(saved.remaining).size===saved.remaining.length;
 let remaining=valid?[...saved.remaining]:[],last=valid?saved.last:null;
 return {next(){if(!remaining.length){remaining=ROOM_DIALOGUES.map(q=>q.id);for(let i=remaining.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[remaining[i],remaining[j]]=[remaining[j],remaining[i]]}if(remaining.at(-1)===last)[remaining[0],remaining[remaining.length-1]]=[remaining.at(-1),remaining[0]];}
 const id=remaining.pop();last=id;onSave({remaining:[...remaining],last});return ROOM_DIALOGUES[id];}};
}
let roomDialogueDeck;
function nextRoomDialogue(){if(!roomDialogueDeck){let saved=null;try{saved=JSON.parse(sessionStorage.getItem('starlight-dialogue-deck-v1'))}catch{}roomDialogueDeck=makeDialogueDeck({saved,onSave:value=>{try{sessionStorage.setItem('starlight-dialogue-deck-v1',JSON.stringify(value))}catch{}}})}return roomDialogueDeck.next()}
function showRoomDialogue(bubble){
 const line=nextRoomDialogue();bubble.replaceChildren();bubble.classList.add('varied-dialogue');
 const main=document.createElement('span');main.className='dialogue-main';main.lang=line.lang;main.textContent=line.text;bubble.append(main);
 if(line.source){const source=document.createElement('a');source.className='dialogue-source';source.href=line.url;source.target='_blank';source.rel='noopener noreferrer';source.textContent='— '+line.source;source.setAttribute('aria-label','查看名句出處：'+line.source);bubble.append(source)}
 if(line.meaning){const meaning=document.createElement('span');meaning.className='dialogue-meaning';meaning.lang='zh-HK';meaning.textContent=line.meaning;bubble.append(meaning)}
 bubble.classList.add('show');bubble.style.marginLeft='0px';const rect=bubble.getBoundingClientRect(),width=document.documentElement.clientWidth;const shift=rect.left<12?12-rect.left:rect.right>width-12?width-12-rect.right:0;bubble.style.marginLeft=shift+'px';return Math.min(15000,Math.max(7000,(line.text.length+(line.meaning?.length||0))*160));
}
