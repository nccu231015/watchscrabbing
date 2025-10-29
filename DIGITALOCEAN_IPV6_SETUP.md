# DigitalOcean IPv6 設置指南

這份指南將幫助您在 DigitalOcean 上為爬蟲程式設置動態 IPv6 地址。

## 📋 前置條件

- DigitalOcean Droplet（任何規格都可以）
- Ubuntu 20.04 或更新版本
- 已安裝 Node.js

## 🚀 步驟 1：在 DigitalOcean 啟用 IPv6

### 方法 A：現有的 Droplet

1. 登入 [DigitalOcean 控制台](https://cloud.digitalocean.com/)
2. 選擇您的 Droplet
3. 點擊 **Networking** 標籤
4. 在 IPv6 區域，點擊 **Enable IPv6**
5. 按照提示重啟 Droplet 或應用配置

### 方法 B：創建新的 Droplet 時

在創建 Droplet 時，勾選 **IPv6** 選項

## 📡 步驟 2：查看您的 IPv6 配置

SSH 連接到您的 Droplet：

```bash
ssh root@your-droplet-ip
```

查看 IPv6 地址：

```bash
# 查看所有 IPv6 地址
ip -6 addr show

# 您應該看到類似這樣的輸出：
# 2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc fq_codel state UP group default qlen 1000
#     inet6 2604:a880:800:10::1/64 scope global
#        valid_lft forever preferred_lft forever
```

**記下您的 IPv6 前綴**（例如：`2604:a880:800:10`）

查看網路介面名稱：

```bash
ip link show

# 通常是 eth0 或 ens3
```

## 🔧 步驟 3：設置環境變數

創建或編輯 `.env` 文件（在您的專案根目錄）：

```bash
cd /path/to/your/project
nano .env
```

添加以下內容（替換成您的實際值）：

```env
# IPv6 配置
ENABLE_IPV6=true
IPV6_PREFIX=2604:a880:800:10
IPV6_INTERFACE=eth0
IPV6_POOL_SIZE=100
IPV6_VERBOSE=false

# 其他配置...
```

或者，您可以直接在終端設置環境變數：

```bash
export ENABLE_IPV6=true
export IPV6_PREFIX="2604:a880:800:10"  # 替換成您的前綴
export IPV6_INTERFACE="eth0"           # 或 ens3
```

## 🧪 步驟 4：測試 IPv6 配置

運行測試腳本：

```bash
node test-ipv6.js
```

您應該看到：
- ✅ 配置有效性通過
- ✅ IPv6 地址成功生成
- ✅ 系統管理器狀態正常

## 🎯 步驟 5：運行設置腳本（可選）

我們提供了一個自動設置腳本來預先創建 IPv6 地址池：

```bash
chmod +x setup-ipv6-pool.sh
sudo ./setup-ipv6-pool.sh
```

這會在您的系統上添加 100 個 IPv6 地址（或您配置的池大小）。

## 🏃 步驟 6：運行爬蟲程式

現在您可以正常運行爬蟲程式了：

```bash
node src/lib/main.js
```

每個爬蟲任務將自動使用不同的 IPv6 地址！

## 🔍 驗證 IPv6 是否正常工作

### 方法 1：檢查日誌

運行爬蟲時，您應該在日誌中看到：

```
🌐 [YC] 使用 IPv6: 2604:a880:800:10::a 爬取: https://...
🌐 [TT] 使用 IPv6: 2604:a880:800:10::b 爬取: https://...
```

### 方法 2：手動測試 IPv6 連接

```bash
# 測試特定 IPv6 地址的連接
curl -6 --interface 2604:a880:800:10::1 https://api64.ipify.org

# 應該返回您的 IPv6 地址
```

### 方法 3：檢查已添加的地址

```bash
# 查看當前系統上的所有 IPv6 地址
ip -6 addr show eth0 | grep "inet6 2604"

# 計算數量
ip -6 addr show eth0 | grep "inet6 2604" | wc -l
```

## 📊 監控和統計

在爬蟲程式運行時，您會看到統計信息：

```
📊 IPv6 使用統計：
   已使用: 45/100
   利用率: 45.00%
   追蹤任務: 45
```

## ⚠️ 常見問題

### 問題 1：權限不足

如果看到 "Permission denied" 錯誤：

```bash
# 使用 sudo 運行
sudo node src/lib/main.js

# 或者給 Node.js 添加 CAP_NET_ADMIN 權限
sudo setcap cap_net_admin=eip $(which node)
```

### 問題 2：IPv6 連接失敗

確保防火牆允許 IPv6 流量：

```bash
# 檢查 UFW 狀態
sudo ufw status

# 允許 IPv6
sudo ufw allow 'Nginx Full'
```

### 問題 3：地址池已滿

如果看到 "IPv6 地址池已滿" 警告：

1. 增加池大小：設置 `IPV6_POOL_SIZE=200`
2. 或者讓程式重用地址（已自動處理）

### 問題 4：IPv6 地址未生效

```bash
# 確保 IPv6 已啟用
cat /proc/sys/net/ipv6/conf/all/disable_ipv6
# 應該輸出 0

# 如果是 1，啟用 IPv6：
sudo sysctl -w net.ipv6.conf.all.disable_ipv6=0
```

## 🧹 清理

如果需要清理已添加的 IPv6 地址：

```bash
# 使用我們的清理腳本
node cleanup-ipv6.js

# 或手動刪除
sudo ip -6 addr del 2604:a880:800:10::1/64 dev eth0
```

## 💡 進階配置

### 自動啟動配置

讓 IPv6 配置在重啟後保持：

編輯 `/etc/netplan/50-cloud-init.yaml`（Ubuntu 18.04+）：

```yaml
network:
  version: 2
  ethernets:
    eth0:
      dhcp4: true
      dhcp6: true
      # 手動添加的 IPv6 地址將在這裡列出
```

或使用 systemd 服務在啟動時運行設置腳本。

### 使用 PM2 管理進程

```bash
# 安裝 PM2
npm install -g pm2

# 使用環境變數啟動
pm2 start src/lib/main.js --name "scraper" --env production

# 設置開機自啟
pm2 startup
pm2 save
```

## 📚 相關文件

- `test-ipv6.js` - IPv6 測試腳本
- `src/lib/ipv6-config.js` - IPv6 配置
- `src/lib/ipv6-proxy-manager.js` - IPv6 管理器
- `src/lib/ipv6-system-manager.js` - 系統級管理

## 🆘 需要幫助？

如果遇到問題：

1. 運行 `node test-ipv6.js` 查看詳細診斷
2. 檢查 `/var/log/syslog` 系統日誌
3. 確認 DigitalOcean 控制台中 IPv6 已啟用

## ✅ 檢查清單

在開始爬取前，確保：

- [ ] DigitalOcean Droplet 已啟用 IPv6
- [ ] 已獲取並記錄 IPv6 前綴
- [ ] 環境變數已正確設置
- [ ] `node test-ipv6.js` 測試通過
- [ ] 可以使用 IPv6 連接到外網
- [ ] 爬蟲程式正常運行

完成這些步驟後，您的爬蟲程式將為每個任務使用不同的 IPv6 地址！🎉

