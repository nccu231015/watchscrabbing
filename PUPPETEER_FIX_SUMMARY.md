# Puppeteer 伺服器環境修復總結

## 問題描述

在沒有圖形界面的 Linux 伺服器環境中運行爬蟲程式時，所有的 scraping 任務都失敗並出現以下錯誤：

```
ERROR:ozone_platform_x11.cc(244)] Missing X server or $DISPLAY
ERROR:env.cc(258)] The platform failed to initialize. Exiting.
TypeError: Cannot read properties of undefined (reading 'close')
```

## 根本原因

Puppeteer 需要在無頭模式（headless mode）下運行，並且需要特定的 Chrome 參數才能在沒有 X server 的環境中正常工作。

## 修復內容

### 1. 主要配置檔案 (`src/lib/main.js`)

更新了 Cluster 配置，將 `headless: false` 改為 `headless: true`，並添加了必要的 Chrome 參數：

```javascript
puppeteerOptions:{
  headless: true,
  args:[
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage',
    '--disable-accelerated-2d-canvas',
    '--no-first-run',
    '--no-zygote',
    '--disable-gpu',
    '--incognito'
  ],
  timeout: 60000,
}
```

### 2. 所有爬蟲檔案

修復了以下所有檔案中的 `puppeteer.launch()` 配置：

- ✅ `src/lib/scrabbing.js` (永生名錶)
- ✅ `src/lib/TTWatches.js` (台北腕錶)
- ✅ `src/lib/YongSanWeb.js` (永生網站 - 男錶)
- ✅ `src/lib/YongSanWebFemale.js` (永生網站 - 女錶)
- ✅ `src/lib/TaiNanJing.js` (台南京)
- ✅ `src/lib/MingBiaoWo.js` (名錶窩)
- ✅ `src/lib/AGan.js` (阿幹)
- ✅ `src/lib/BayLin.js` (百林)
- ✅ `src/lib/XinRue.js` (鑫瑞)
- ✅ `src/lib/YongSanWuChuen.js` (永三五圈)
- ✅ `src/lib/TheendWeb.js` (The End Web)
- ✅ `src/lib/YongSanWenShin.js` (永三文心)
- ✅ `src/lib/HanShiJi.js` (漢時紀)
- ✅ `src/lib/JinChen.js` (金辰)
- ✅ `src/lib/HongSen.js` (宏森)
- ✅ `src/lib/emc2.js` (EMC2)
- ✅ `src/lib/Radar.js` (雷達)
- ✅ `src/lib/watchstore.js` (錶店)
- ✅ `src/lib/playwatch.js` (玩錶)
- ✅ `src/lib/YongChang.js` (永昌)
- ✅ `src/lib/Theend.js` (The End)
- ✅ `src/lib/AJLuxury.js` (AJ Luxury)

### 3. 新增配置檔案

建立了 `src/lib/puppeteer-config.js` 作為統一的配置管理檔案，方便日後維護。

## Chrome 參數說明

- `--no-sandbox`: 在沒有沙盒環境中運行（伺服器環境必需）
- `--disable-setuid-sandbox`: 禁用 setuid 沙盒
- `--disable-dev-shm-usage`: 避免共享記憶體問題
- `--disable-accelerated-2d-canvas`: 禁用 2D canvas 加速
- `--no-first-run`: 跳過首次運行任務
- `--no-zygote`: 不使用 zygote 進程
- `--disable-gpu`: 禁用 GPU 加速（伺服器無 GPU）
- `--disable-software-rasterizer`: 禁用軟體光柵化

## 測試建議

運行爬蟲程式測試修復效果：

```bash
# 測試單一爬蟲
node src/lib/main.js

# 或通過 PM2
pm2 restart main
pm2 logs main
```

## 注意事項

1. 這些修改使所有 Puppeteer 實例都在無頭模式下運行
2. 如果需要在本地開發環境中查看瀏覽器，可以臨時將 `headless: true` 改為 `headless: false`
3. 生產環境必須保持 `headless: true`

## 修復日期

2025-11-03

## 相關問題

- [Puppeteer Troubleshooting](https://pptr.dev/troubleshooting)
- [Running Puppeteer on Linux](https://github.com/puppeteer/puppeteer/blob/main/docs/troubleshooting.md#running-puppeteer-on-linux)

