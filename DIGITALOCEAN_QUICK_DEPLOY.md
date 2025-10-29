# 🚀 DigitalOcean IPv6 快速部署指南

## 📋 當前情況

您的 Droplet 已有 IPv6，但遇到權限問題。這是**正常的**！
以下步驟會解決所有問題。

## ✅ 快速部署步驟（5 分鐘）

### 步驟 1：SSH 到您的 Droplet

```bash
ssh daniel@your-droplet-ip
```

### 步驟 2：確認 IPv6 前綴

```bash
# 顯示您的 IPv6 地址
ip -6 addr show | grep "inet6" | grep -v "fe80" | grep -v "::1"

# 輸出範例：
# inet6 2400:6180:0:d2::1/64 scope global
#       ^^^^^^^^^^^^^^^^  ← 這是您的前綴（只要前 4 組）
```

**記下前綴**（例如：`2400:6180:0:d2`）

### 步驟 3：進入專案目錄

```bash
cd /path/to/your/watchscrabbing
# 例如：cd ~/watchscrabbing
```

### 步驟 4：創建 .env 文件

```bash
# 創建配置文件（請替換成您的實際前綴）
cat > .env << 'EOF'
ENABLE_IPV6=true
IPV6_PREFIX=2400:6180:0:d2
IPV6_INTERFACE=eth0
IPV6_POOL_SIZE=200
IPV6_SKIP_SYSTEM_ADD=true
EOF
```

**重要**：將 `2400:6180:0:d2` 替換成您在步驟 2 看到的前綴！

### 步驟 5：預先創建 IPv6 地址池

```bash
# 設置環境變數
export IPV6_PREFIX="2400:6180:0:d2"  # 替換成您的前綴
export IPV6_INTERFACE="eth0"
export IPV6_POOL_SIZE="200"

# 運行設置腳本（一次性操作，需要 sudo）
sudo ./setup-ipv6-pool.sh
```

**預期輸出**：
```
🚀 IPv6 地址池設置腳本
============================================
配置信息：
  IPv6 前綴: 2400:6180:0:d2
  網路介面: eth0
  池大小: 200

開始創建 IPv6 地址池...
✅ 成功添加: 200
⏭️  跳過（已存在）: 0
❌ 失敗: 0
```

### 步驟 6：驗證地址已創建

```bash
# 查看已添加的 IPv6 地址數量
ip -6 addr show eth0 | grep "inet6 2400" | wc -l

# 應該顯示 200 或更多
```

### 步驟 7：更新代碼到伺服器

從您的**本地機器**執行：

```bash
# 從本地推送更新的代碼到伺服器
cd /Users/danielhsiung/Documents/GitHub/watchscrabbing

# 使用 git（如果有設置）
git add .
git commit -m "Fix IPv6 system permissions"
git push

# 然後在伺服器上 pull
ssh daniel@your-droplet-ip "cd /path/to/watchscrabbing && git pull"
```

**或使用 rsync**（如果沒有 git）：

```bash
# 從本地同步文件到伺服器
rsync -avz --exclude 'node_modules' \
  /Users/danielhsiung/Documents/GitHub/watchscrabbing/ \
  daniel@your-droplet-ip:/path/to/watchscrabbing/
```

### 步驟 8：在伺服器上重啟應用

```bash
# SSH 到伺服器
ssh daniel@your-droplet-ip

# 進入專案目錄
cd /path/to/watchscrabbing

# 重啟 PM2
pm2 restart main

# 查看日誌
pm2 logs main --lines 50
```

### 步驟 9：驗證成功

**您應該看到**：

```
📋 IPv6 配置：
   前綴：2400:6180:0:d2
   介面：eth0
   啟用：✅
   池大小：200

🚀 爬取開始
🌐 [YC] 使用 IPv6: 2400:6180:0:d2::1a2b:3c4d 爬取: https://...
🌐 [TT] 使用 IPv6: 2400:6180:0:d2::5e6f:7890 爬取: https://...
```

**不應該看到**：
- ❌ "添加 IPv6 失敗"
- ❌ "sudo: a password is required"

---

## 🎯 工作原理

### 之前（有問題）：
```
程序運行 → 嘗試動態添加 IPv6 → 需要 sudo → 失敗 ❌
```

### 現在（已修復）：
```
預先創建 200 個 IPv6 → 程序使用現有地址 → 不需要 sudo → 成功 ✅
```

---

## 🔍 故障排除

### 問題 1：看到 "添加 IPv6 失敗"

檢查 `.env` 文件是否包含：
```bash
cat .env | grep IPV6_SKIP_SYSTEM_ADD
# 應該顯示：IPV6_SKIP_SYSTEM_ADD=true
```

如果沒有，添加它：
```bash
echo "IPV6_SKIP_SYSTEM_ADD=true" >> .env
pm2 restart main
```

### 問題 2：前綴格式錯誤

確保前綴**只有 4 組**，每組**最多 4 位十六進制數字**：

✅ 正確：`2400:6180:0:d2`  
❌ 錯誤：`2400:6180:0:d22`（第 4 組有 3 位）  
❌ 錯誤：`2400:6180:0:d2::1`（包含地址部分）

### 問題 3：地址池未創建

重新運行設置腳本：
```bash
sudo ./setup-ipv6-pool.sh
```

驗證：
```bash
ip -6 addr show eth0 | grep "inet6 2400" | head -5
```

### 問題 4：代碼未更新

確保從本地同步了最新代碼（包括修改的 `ipv6-system-manager.js`）

---

## 📊 監控

### 查看 IPv6 使用情況

```bash
# 實時日誌
pm2 logs main

# 只看 IPv6 相關
pm2 logs main | grep "IPv6"

# 查看統計
pm2 logs main | grep "統計"
```

### 預期日誌

```
🌐 [YC] 使用 IPv6: 2400:6180:0:d2::abc:def 爬取: https://...
🌐 [TT] 使用 IPv6: 2400:6180:0:d2::123:456 爬取: https://...

📊 IPv6 使用統計：
   已使用: 45/200
   利用率: 22.50%
```

---

## ✅ 完成檢查清單

部署前確認：

- [ ] 已確認 IPv6 前綴（只要前 4 組）
- [ ] `.env` 文件已創建，包含正確的前綴
- [ ] `.env` 包含 `IPV6_SKIP_SYSTEM_ADD=true`
- [ ] 已運行 `sudo ./setup-ipv6-pool.sh`
- [ ] 驗證已創建 200 個 IPv6 地址
- [ ] 代碼已更新到伺服器
- [ ] PM2 已重啟
- [ ] 日誌中沒有 "添加 IPv6 失敗" 錯誤

全部 ✅ 就成功了！

---

## 🎉 成功後

您的爬蟲現在會：
- ✅ 每個任務使用不同的 IPv6 地址
- ✅ 從預先創建的 200 個地址池中選擇
- ✅ 不需要 sudo 權限
- ✅ 每次重啟使用新的隨機地址組合
- ✅ 有效避免 IP 封鎖

享受您的爬蟲！🚀

