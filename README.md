# 星光冒險 · Starlight Chronicle

原創日式繪本 RPG 風格的香港小學生溫習 app 可操作原型。

## 測試

以靜態網頁伺服器開啟 `dist/`。例如：`python3 -m http.server 4173 --directory dist`。

- 家長：`admin` / `admin`
- 小朋友：`test` / `test`

以上為前端示範登入，並非安全身份驗證；資料儲存於目前瀏覽器 localStorage。家長和小朋友於同一瀏覽器及相同網址共用一個測試檔案，並無跨裝置同步。

## 可操作內容

- 遊戲開場及鍵盤開始、雙身份登入
- 首次登入四選一男性角色、命名、之後直接返回小屋
- 小屋角色以靜態姿勢在房間移動，間中切換吃東西、閱讀、坐下、休息等姿勢
- 家具功能入口：任務、日曆、專注計時、換角色、寶物
- 角色狀態：經驗值、等級、水晶、裝備與成就
- 家長新增及移除未完成任務
- 計時暫停、儲存進度、完成回報、獎勵寶箱與紀念物裝備
- 減少動態效果偏好、鍵盤可操作對話框

## 美術

使用內建 ImageGen 製作的原創素材，已複製至 `dist/assets/`。

1. `cottage.png`：Wide Japanese RPG watercolor storybook cozy medieval cottage interior, desk left, quest board, calendar, arched door center, wardrobe right, treasure chest bottom right, warm amber light, no text or characters.
2. `characters.png`：3-column 2-row sheet of six original full-body young Japanese fantasy RPG adventurers: forest knight, star mage, moon scholar, leaf ranger, dawn healer, sky explorer; watercolor gouache, cream background, no text.
3. `heroes-transparent.png`：Background extraction edit of the six-character sheet; preserve character identities and 3-by-2 layout, transparent background.

文字、按鈕及功能均由 HTML/CSS/JavaScript 呈現，並非圖片介面。背景音為瀏覽器合成的簡單環境和弦，可關閉。

## 第二版：公會管理及練習

- RPG 身份選擇式登入；角色檔案加入年級及出生年份。
- 家長公會：總覽、科目進度、活動記錄、待批改、任務工房、考試 Boss、成就及禮物。
- 任務可選紙本專注或螢幕練習；螢幕支援單選、文字、參考答案及家長批改，可儲存作答草稿。
- Boss 以累積 EXP 作門檻，不消耗 EXP；達標後小朋友可挑戰，由家長確認考試完成及領取獎勵。
- 自訂成就按任務數、專注時間、EXP 或手動頒發解鎖，獎勵只可領一次。
- 禮物支援遊戲紀念物、金幣水晶及家庭實體兌換券，領取及實體兌換分開記錄。
- 保留既有 localStorage 存檔；並無將兒童資料或原始碼上載到外部服務。

檢查：`node --test tests/progression.test.cjs`；涵蓋存檔升級、答題、重複獎勵、Boss 門檻、角色權限、禮物及成就領取。

新增原創素材 `dist/assets/forest-dragon.png`，由內建 ImageGen 生成。生成描述：Original Japanese fantasy RPG storybook full-body ancient forest dragon, child friendly majestic moss green scales, warm gold belly and antlers, leaf-like wings, amber eyes, curled tail, floating crystal, watercolor gouache and delicate ink, three-quarter view facing left, transparent background, no text or interface.

## 第三版：AI、個人化獎勵與骨架動畫

啟動改用 `npm start`（或 `node server.cjs`），網址維持本機 4173。靜態伺服器不提供 AI 功能。

- 家長「AI 出題設定」輸入自己的 OpenAI API key；key 只保存在本機 Node 服務的家長 session 記憶體，登出、切換小朋友或重啟服務時清除；不寫入檔案或瀏覽器存檔。
- 「任務工房」選科目、年級、課題、難度及題數，生成後先預覽、修改，再派發。示範題按鈕不呼叫 AI。
- 使用官方 Responses API Structured Outputs；不自動傳送姓名、出生年份或學習成績。外部請求只送到 `https://api.openai.com/v1/responses`。
- 每項任務可定合格比例、重試上限、達標分數、額外 EXP／金幣／水晶及成就。家長可以修改，達標獎勵只派一次。
- 家長「成長設定」可調整累積 EXP 及每級所需 EXP。
- 小朋友可以提出分數目標，家長核准獎勵後記錄成績。考試 Boss 可設定最低任務完成數、EXP、考試目標分數及達標獎勵。
- 屋內角色放大，採用程式控制的 2D 骨架：大腿、小腿、腳掌、手臂交替動作；移動速度與步幅同步。臉部使用原有繪本圖像，其餘為可動向量身體。原先嘗試生成步行圖集兩次皆因網絡失敗，未使用失敗素材或浮移替代。

真實付費 AI 呼叫尚未測試（未提供真實 API key）；已用模擬供應商驗證 API 請求、輸出校驗、key 不回傳及登出撤銷。

官方參考：
- https://developers.openai.com/api/docs/guides/structured-outputs
- https://developers.openai.com/api/docs/models/gpt-4.1-mini

## 角色對白

`dist/dialogue.js` 收錄 100 句：70 句原創粵語、10 句原創書面中文、10 句原創英文（附粵語意思）及10句古典名句（附書名、出處連結及自行撰寫的淺白解釋）。以不重複洗牌輪播，sessionStorage 保留本次瀏覽的輪播進度，長句延長停留時間；減少動態效果模式亦可以看對白。英語原創句並不冒稱名人語錄。

## 星海群島世界地圖

「出發冒險」進入香港海岸、半島及島嶼輪廓為靈感的虛構群島地圖，包含霧語黑森林、雲頂觀星台、古鐘地城、星晶城堡、月泉小村、曦光港市集及風燈海岸。

家長可以在派任務及任務詳情指定地點；舊任務按科目自動安排。地圖地點顯示當地任務數，選任務後沿用真實練習／計時及獎勵流程。城堡連到考試 Boss，港口商店使用遊戲金幣購買收藏裝備，購買會扣幣、記錄並加入寶物背囊，每件限購一次。手機可橫向滑動完整地圖。

原創素材 `dist/assets/world-map.png` 使用內建 ImageGen 生成，提示描述：Landscape 16:9 hand-painted oil/gouache Japanese storybook fantasy RPG world map inspired by Hong Kong's mainland, peninsula, southwest island, southern island and eastern islands. Teal seas, winding coasts, dark northwest forest, northern mountain observatory, northeast dungeon ruins, central crystal castle, southwest spring village, southern harbor marketplace, southeast lighthouse; golden paths, ferry routes, parchment border, no lettering or UI. All labels and clickable destinations are live HTML.

## 小屋日期、天氣與季節

`room-environment.js` 在角色名牌下以大字顯示香港日期、星期、24 小時時鐘（每秒更新）及天氣。已移除原本歡迎文案。`GET /api/weather` 讀取香港天文台即時天氣 API 的香港天文台測站溫度及天氣圖示，伺服器快取 10 分鐘；斷線顯示未能取得／舊資料標示，不會虛構溫度。資料來源：https://data.weather.gov.hk/weatherAPI/doc/HKO_Open_Data_API_Documentation.pdf 。

右上「窗外景色」可選跟隨香港天氣／時間／月份、自動每 90 秒輪播、晴天、細雨、月夜、秋日或幻想雪景。場景選擇保存於本機；場景預覽不會改變真實時鐘及天氣。保留同一小屋構圖、傢俬位置及互動；新背景交淡切換，雨雪落葉效果只顯示於窗外。切換不重新建立角色動畫。

四張背景 `cottage-{rain,night,snow,autumn}.png` 使用內建 ImageGen，以原有 cottage.png 作參考編輯：preserve the exact room architecture, furniture positions, window/door/rug positions, camera and dimensions; change only the exterior weather or season and corresponding illumination. Rain: overcast grey exterior with rainfall, cool daylight and warm lanterns. Night: moon, stars, deep blue exterior, warm candlelight. Snow: fantasy snowy landscape and frost outside, cozy interior. Autumn: ochre, orange and red outside foliage and golden sunlight. No weather indoors, no new UI or text.

驗證：37 項測試全部通過；瀏覽器確認天文台讀數、日期時間及月夜／秋日／雪景切換，角色保持行動。

## 家長註冊

登入頁「註冊家長帳戶 · Register」由家長建立家庭，填寫家長稱呼及登入名稱／密碼、小朋友暱稱及登入名稱／密碼、年級、出生年份；確認密碼一致及帳戶名稱未被使用。完成後返回家長登入，小朋友首次登入選擇角色。

帳戶在本機 `local-data/accounts.json` 保存，使用隨機 salt 與 scrypt 雜湊，不保存明文密碼；該目錄已加入 .gitignore。登入資料由本機 API 驗證。學習進度按 familyId 分開保存在目前瀏覽器；家長與小朋友使用同一瀏覽器來源時共享家庭進度，暫不跨裝置同步。原有 admin/admin、test/test 示範家庭保留。沒有新增公開註冊網站或寄信功能。

角色按用戶要求恢復完整原創繪本插圖（heroes-transparent.png），移除小屋內向量身體及拼接頭部；保留移動路徑、方向、輕微步行擺動及100句對白。

## 按鈕音效及專注橫向旅程

`adventure.js` 以 Web Audio 合成低音量按鈕提示、出發及完成音效，不依賴音效下載；所有按鈕共用捕捉事件，鍵盤開始亦有音效。音效與背景音樂分開控制，可關閉並記住選擇。

紙本／計時任務使用卡通 2D 橫向捲動場景，遠山、前景、地面以不同速度移動，保留原本完整繪本主角。每45秒換森林／山谷／海岸／古城，每30秒換晴／雨／夜／雪；沿途出現不同顏色及名稱的小怪物。場景進度按真實投入計時決定，暫停同步停止動畫，不影響原有完成申報及獎勵。所有背景及怪物為程式原創 SVG/CSS，沒有引入外部遊戲素材。減少動態效果設定會停止動畫。

橫向旅程現已換成 ImageGen 原創油畫背景 `journey-{forest,valley,coast,castle}.png`：Japanese fantasy storybook oil/gouache painting, detailed brushwork, side-on horizontal path, landscape scenery, no text, UI or characters. 四款敵人 `journey-enemies.png` 為透明 2×2 素材：leaf slime, amber golem, water spirit, violet ghost，沿用油畫繪本風格。

每20秒循環接近（7秒）、交戰（3秒）、擊退（3秒）及繼續行走；交戰背景停下，主角向前攻擊、光效及短促受擊音、敵人後退消失。整段循環持續至計時完成；暫停同時凍結動畫。動畫不發放額外分數、經驗或金幣。單元測試驗證戰鬥狀態順序及循環。

## 家庭日曆、更新提示、自律休息

`calendar-rest.js` 提供月曆、週日程、未來三個月清單，可往前後切換及返回今天。家長側欄與小朋友小屋都能新增／編輯同一家庭活動（名稱、日期、全日或時間、備註）；任務與Boss自動列入日曆。沿用目前同一瀏覽器來源的家庭儲存，不提供跨裝置同步。

家長儲存任務、Boss、日曆、禮物、成就、目標或升級設定的變更，會留下未讀更新；小屋顯示發光通知，打開後標記已讀，並提供日曆／任務入口。

床邊「自律休息」可設1–60分鐘倒數，展示小屋床鋪與原繪本角色躺臥、呼吸及 zZ 效果。截止時間保存於家庭進度，收起視窗仍繼續；時間到響提示音、提醒繼續任務，重新載入後亦能處理到期提醒。計時任務進行中需要先儲存再休息。金幣、水晶及數字已放大。

驗證：月曆新增活動與週視圖、床鋪倒數與提前返回任務均經瀏覽器檢查；測試覆蓋跨年日期、日曆聚合、家長變更通知去重、休息結束提醒一次。

## 單一水晶貨幣

所有錢包、商店購買、任務基本及達標獎勵、Boss、目標、禮物及成就統一使用水晶。舊版本金幣按 1:1 合併到水晶；`currencyVersion:2` 避免重複轉換，連同未領取獎勵設定一起合併，保留原有經驗、購買紀錄及領取狀態。示範家庭與註冊家庭讀取時均執行轉換。商店價格數字維持原值，單位改水晶。

## 四位勇者的靜態姿勢圖集

角色選擇提供四位全新男性勇者：森之劍士、星語魔法師、月光學者、翠葉遊俠。每位只有一張正式使用的透明橫向圖集，十個獨立格依序為 walk、eat、sleep、read、attack、magic、shield、sit、play、win。每格左右保留透明空位，不會露出鄰格圖像。小屋內角色以固定步行姿勢移動，到達位置才換姿勢；專注任務中依序行走、戰鬥、再行走。角色本身不再逐格播放步行或變形動畫。圖集資料見 `dist/assets/hero-sprites.json`，來源插畫與重建程式在 `tools/source-art/`、`tools/build-pose-sheets.py`。

## Google Drive 雲端存檔

登入頁可使用 Google 帳戶登入，並把每個使用者的遊戲存檔儲存到該帳戶的私人 Google Drive `appDataFolder`。實作及 Google Cloud Console 設定步驟見 [GOOGLE_DRIVE_SETUP.md](GOOGLE_DRIVE_SETUP.md)。公開版本必須先在 `dist/google-drive-config.js` 填入 OAuth Web Client ID；此 Client ID 可公開，但不可放入 Client Secret。
