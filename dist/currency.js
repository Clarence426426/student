'use strict';
function migrateCrystalCurrency(save){if(!save||save.currencyVersion===2)return save;const visit=o=>{if(!o||typeof o!=='object')return;if(Array.isArray(o)){o.forEach(visit);return}for(const [oldKey,newKey] of [['coins','crystals'],['bonusCoins','bonusCrystals'],['baseCoins','baseCrystals']])if(Object.hasOwn(o,oldKey)){o[newKey]=(Number(o[newKey])||0)+(Number(o[oldKey])||0);delete o[oldKey]}Object.values(o).forEach(visit)};visit(save);save.crystals=Number(save.crystals)||0;save.currencyVersion=2;return save}
if(typeof module!=='undefined')module.exports={migrateCrystalCurrency};
