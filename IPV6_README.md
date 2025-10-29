# 🌐 動態 IPv6 爬蟲系統

## 概述

此系統為每個爬蟲任務分配唯一的 IPv6 地址，有效避免 IP 封鎖，提升爬蟲成功率。

## ✨ 核心功能

- 🔄 **動態 IPv6 分配**：每個爬蟲任務使用不同的 IPv6 地址
- 🎲 **靈活策略**：支援隨機和順序兩種分配策略
- 📊 **智能管理**：自動追蹤和管理已使用的地址
- 🧪 **模擬模式**：在本地開發時無需真實 IPv6
- 🚀 **生產就緒**：在 DigitalOcean 上開箱即用

## 📁 新增檔案

```
watchscrabbing/
├── src/lib/
│   ├── ipv6-config.js              # IPv6 配置文件
│   ├── ipv6-proxy-manager.js       # IPv6 地址池管理器
│   ├── ipv6-system-manager.js      # 系統級 IPv6 管理
│   ├── main.js                     # 已更新：整合 IPv6 管理
│   └── YongChang.js                # 已更新：示例爬蟲函數
├── test-ipv6.js                    # IPv6 測試腳本
├── setup-ipv6-pool.sh              # IPv6 地址池設置腳本
├── cleanup-ipv6.js                 # IPv6 清理腳本
├── DIGITALOCEAN_IPV6_SETUP.md      # DigitalOcean 部署指南
└── IPV6_README.md                  # 本文件
```

## 🚀 快速開始

### 在本地測試（模擬模式）

```bash
# 1. 運行測試腳本
node test-ipv6.js

# 2. 運行爬蟲（會使用模擬 IPv6）
node src/lib/main.js
```

### 在 DigitalOcean 部署

```bash
# 1. 啟用 IPv6（在 DO 控制台）
# 2. 查看您的 IPv6 前綴
ip -6 addr show

# 3. 設置環境變數
export ENABLE_IPV6=true
export IPV6_PREFIX="2604:a880:800:10"  # 替換成您的前綴
export IPV6_INTERFACE="eth0"

# 4. 運行設置腳本（可選，預先創建地址池）
sudo ./setup-ipv6-pool.sh

# 5. 測試配置
node test-ipv6.js

# 6. 運行爬蟲
node src/lib/main.js
```

詳細步驟請參考：[DIGITALOCEAN_IPV6_SETUP.md](./DIGITALOCEAN_IPV6_SETUP.md)

## 🔧 配置選項

### 環境變數

| 變數 | 預設值 | 說明 |
|------|--------|------|
| `ENABLE_IPV6` | `false` | 是否啟用真實 IPv6（本地測試設為 false） |
| `IPV6_PREFIX` | `fd00::` | IPv6 前綴（DigitalOcean 上獲得的前綴） |
| `IPV6_INTERFACE` | `eth0` | 網路介面名稱 |
| `IPV6_POOL_SIZE` | `100` | IPv6 地址池大小 |
| `IPV6_VERBOSE` | `false` | 是否顯示詳細日誌 |

### 修改配置

**方法 1：環境變數**
```bash
export ENABLE_IPV6=true
export IPV6_PREFIX="您的前綴"
```

**方法 2：.env 文件**
```env
ENABLE_IPV6=true
IPV6_PREFIX=2604:a880:800:10
IPV6_INTERFACE=eth0
IPV6_POOL_SIZE=200
```

**方法 3：修改代碼**
編輯 `src/lib/ipv6-config.js`

## 📊 工作原理

### 架構圖

```
┌─────────────────┐
│  爬蟲任務開始   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ IPv6Manager     │ ← 生成唯一的 IPv6 地址
│ getIpv6ForSite()│
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ SystemManager   │ ← 在系統上添加地址
│ addIpv6Address()│
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ 使用該 IPv6     │
│ 執行爬蟲        │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ 爬蟲任務完成    │
└─────────────────┘
```

### 地址分配策略

#### 隨機策略（預設）
```javascript
// 每次生成隨機的 IPv6 地址
fd00:::a1b2:c3d4:e5f6:7890
fd00:::1234:5678:9abc:def0
```

#### 順序策略
```javascript
// 按順序生成 IPv6 地址
fd00::::1
fd00::::2
fd00::::3
```

### 示例代碼

在您的爬蟲函數中使用：

```javascript
import ipv6Manager from './ipv6-proxy-manager.js';
import systemManager from './ipv6-system-manager.js';

export const YourScraper = async ({page, data}) => {
  // 為這個任務獲取一個 IPv6 地址
  const ipv6 = ipv6Manager.getIpv6ForSite('YourSite', data.url);
  
  // 確保地址在系統上可用
  await systemManager.addIpv6Address(ipv6);
  
  console.log(`🌐 使用 IPv6: ${ipv6}`);
  
  // 繼續您的爬蟲邏輯...
  await page.goto(data.url);
  // ...
}
```

## 📈 監控和統計

### 查看統計信息

程式運行時會自動顯示：

```
📊 IPv6 使用統計：
   已使用: 45/100
   利用率: 45.00%
   追蹤任務: 45
   當前計數器: 46
```

### 手動查詢

```javascript
import ipv6Manager from './src/lib/ipv6-proxy-manager.js';

// 獲取統計
const stats = ipv6Manager.getStats();
console.log(stats);

// 顯示統計
ipv6Manager.showStats();

// 獲取已使用的地址列表
const addresses = ipv6Manager.getUsedIpv6List();
console.log(addresses);
```

## 🧪 測試

### 完整測試

```bash
node test-ipv6.js
```

測試包括：
1. ✅ 配置驗證
2. ✅ IPv6 地址生成（隨機和順序）
3. ✅ 系統管理器功能
4. ✅ 地址唯一性檢查
5. ✅ 任務映射
6. ✅ 連接性測試（在啟用時）

### 單獨測試 IPv6 連接

```bash
# 測試特定 IPv6 地址
curl -6 --interface 2604:a880:800:10::1 https://api64.ipify.org

# 應該返回該 IPv6 地址
```

## 🔍 調試

### 啟用詳細日誌

```bash
export IPV6_VERBOSE=true
node test-ipv6.js
```

### 檢查系統上的 IPv6

```bash
# 查看所有 IPv6 地址
ip -6 addr show

# 只看特定前綴
ip -6 addr show | grep "2604:a880"

# 計算數量
ip -6 addr show | grep "2604:a880" | wc -l
```

### 常見問題

#### 問題：權限不足
```bash
# 解決方案 1：使用 sudo
sudo node src/lib/main.js

# 解決方案 2：給 node 添加權限
sudo setcap cap_net_admin=eip $(which node)
```

#### 問題：地址池已滿
```bash
# 增加池大小
export IPV6_POOL_SIZE=200
```

#### 問題：IPv6 無法連接外網
```bash
# 檢查 IPv6 是否啟用
cat /proc/sys/net/ipv6/conf/all/disable_ipv6
# 應該是 0

# 檢查路由
ip -6 route show

# 測試基本連接
ping6 google.com
```

## 🧹 清理

### 清理所有 IPv6 地址

```bash
# 使用清理腳本
node cleanup-ipv6.js

# 或在代碼中
import systemManager from './src/lib/ipv6-system-manager.js';
await systemManager.cleanup();
```

### 重置管理器狀態

```javascript
import ipv6Manager from './src/lib/ipv6-proxy-manager.js';

// 重置所有狀態
ipv6Manager.reset();
```

## 📦 相依套件

所需的 npm 套件：
- `puppeteer` 或 `puppeteer-core` （已有）
- `puppeteer-cluster` （已有）

## 🎯 效能考量

### 地址池大小建議

| 爬蟲規模 | 建議池大小 | 說明 |
|---------|-----------|------|
| 小型（<100 URL） | 50 | 足夠使用 |
| 中型（100-1000） | 100-200 | 預設配置 |
| 大型（>1000） | 500+ | 可根據需要調整 |

### 記憶體使用

- 每個 IPv6 地址約佔用 ~50 bytes
- 100 個地址 ≈ 5KB
- 可以安全使用數千個地址

## 🚀 進階用法

### 為不同網站使用固定 IPv6

```javascript
const siteIpv6Map = {
  'YC': 'fd00::::10',
  'TT': 'fd00::::20',
  'emc2': 'fd00::::30',
};

const ipv6 = siteIpv6Map[siteCode];
```

### 實現 IP 輪換

```javascript
// 每 N 個請求後切換 IP
let requestCount = 0;
const ROTATE_AFTER = 10;

if (requestCount++ % ROTATE_AFTER === 0) {
  ipv6Manager.reset(); // 重新開始分配
}
```

### 與代理結合使用

如果需要更高級的功能，可以結合 SOCKS5 代理使用。

## 📞 技術支援

遇到問題？

1. 先運行 `node test-ipv6.js` 診斷
2. 查看 [DIGITALOCEAN_IPV6_SETUP.md](./DIGITALOCEAN_IPV6_SETUP.md)
3. 檢查系統日誌：`/var/log/syslog`

## 📄 授權

與主專案相同的授權。

## 🎉 開始使用

```bash
# 本地測試
node test-ipv6.js

# DigitalOcean 部署
# 1. 啟用 IPv6
# 2. 設置環境變數
# 3. 運行 sudo ./setup-ipv6-pool.sh
# 4. 開始爬蟲！

node src/lib/main.js
```

祝您爬蟲順利！🚀

