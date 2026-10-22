'use strict';
const HKO_URL='https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=rhrread&lang=tc';
const WEATHER_LABELS={50:'天晴',51:'間有陽光',52:'短暫陽光',53:'陽光及幾陣驟雨',54:'陽光及驟雨',60:'多雲',61:'密雲',62:'微雨',63:'有雨',64:'大雨',65:'雷暴',70:'天色良好',71:'天色良好',72:'天色良好',73:'天色良好',74:'天色良好',75:'天色良好',76:'大致多雲',77:'大致天晴',80:'大風',81:'乾燥',82:'潮濕',83:'有霧',84:'薄霧',85:'煙霞',90:'酷熱',91:'溫暖',92:'清涼',93:'寒冷'};
function normalizeWeather(raw,now=Date.now()){
 const stamp=Date.parse(raw?.updateTime),station=raw?.temperature?.data?.find(d=>d.place==='香港天文台');const code=raw?.icon?.[0];
 if(!Number.isFinite(stamp)||stamp>now+10*60000||!station||!Number.isFinite(station.value)||station.value< -20||station.value>60||!WEATHER_LABELS[code])throw new Error('INVALID_WEATHER');
 return {available:true,temperature:station.value,station:station.place,code,description:WEATHER_LABELS[code],updatedAt:new Date(stamp).toISOString(),stale:now-stamp>2*3600000,source:'香港天文台',sourceUrl:'https://www.hko.gov.hk/tc/wxinfo/currwx/current.htm'};
}
function createWeatherReader({fetchImpl=fetch,now=Date.now}={}){let cache=null,fetchedAt=0,pending=null;return async()=>{
 if(cache&&now()-fetchedAt<10*60000)return {...cache,stale:now()-Date.parse(cache.updatedAt)>2*3600000};if(pending)return pending;
 pending=(async()=>{try{const r=await fetchImpl(HKO_URL,{signal:AbortSignal.timeout(10000)});if(!r.ok)throw new Error('WEATHER_FETCH_FAILED');cache=normalizeWeather(await r.json(),now());fetchedAt=now();return cache}catch{if(cache)return {...cache,stale:true,refreshFailed:true};return {available:false,description:'天氣暫未能更新',source:'香港天文台',sourceUrl:'https://www.hko.gov.hk/tc/wxinfo/currwx/current.htm'}}finally{pending=null}})();return pending;
}}
module.exports={normalizeWeather,createWeatherReader,HKO_URL};
