#!/bin/bash

# IPv6 大量隨機地址池設置腳本
# 創建 500-1000 個隨機 IPv6 地址，確保每次運行都有新的可用

set -e

# 顏色定義
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 IPv6 大量隨機地址池設置腳本${NC}"
echo "============================================"
echo ""

# 從環境變數讀取或使用預設值
IPV6_PREFIX="${IPV6_PREFIX:-fd00::}"
INTERFACE="${IPV6_INTERFACE:-eth0}"
POOL_SIZE="${IPV6_POOL_SIZE:-1000}"  # 預設 1000 個

echo "配置信息："
echo "  IPv6 前綴: $IPV6_PREFIX"
echo "  網路介面: $INTERFACE"
echo "  池大小: $POOL_SIZE"
echo ""

# 檢查是否以 root 權限運行
if [ "$EUID" -ne 0 ]; then 
    echo -e "${YELLOW}⚠️  需要 root 權限，嘗試使用 sudo...${NC}"
    exec sudo "$0" "$@"
fi

# 檢查介面是否存在
if ! ip link show "$INTERFACE" &> /dev/null; then
    echo -e "${RED}❌ 錯誤: 網路介面 $INTERFACE 不存在${NC}"
    echo ""
    echo "可用的網路介面："
    ip link show | grep '^[0-9]' | cut -d: -f2 | sed 's/^ //'
    exit 1
fi

# 檢查現有地址
echo "檢查現有 IPv6 配置..."
EXISTING_COUNT=$(ip -6 addr show dev "$INTERFACE" | grep -c "inet6 $IPV6_PREFIX" || true)
echo "  已存在的地址: $EXISTING_COUNT"
echo ""

# 如果已經有很多地址，詢問是否清理
if [ "$EXISTING_COUNT" -gt 100 ]; then
    echo -e "${YELLOW}⚠️  已存在 $EXISTING_COUNT 個地址${NC}"
    echo "建議先清理舊地址（可選）"
    echo ""
fi

echo -e "${GREEN}開始創建隨機 IPv6 地址池...${NC}"
echo "這可能需要幾分鐘，請耐心等待..."
echo ""

SUCCESS_COUNT=0
SKIP_COUNT=0
FAIL_COUNT=0

# 生成隨機 IPv6 地址
generate_random_ipv6() {
    local prefix=$1
    # 生成 4 組隨機十六進制數（每組 2 bytes = 4 位十六進制）
    local r1=$(openssl rand -hex 2)
    local r2=$(openssl rand -hex 2)
    local r3=$(openssl rand -hex 2)
    local r4=$(openssl rand -hex 2)
    echo "${prefix}:${r1}:${r2}:${r3}:${r4}"
}

# 創建地址
for i in $(seq 1 $POOL_SIZE); do
    # 生成隨機 IPv6
    IPV6=$(generate_random_ipv6 "$IPV6_PREFIX")
    
    # 檢查是否已存在
    if ip -6 addr show dev "$INTERFACE" | grep -q "$IPV6"; then
        SKIP_COUNT=$((SKIP_COUNT + 1))
    else
        # 添加地址
        if ip -6 addr add "$IPV6/64" dev "$INTERFACE" 2>/dev/null; then
            SUCCESS_COUNT=$((SUCCESS_COUNT + 1))
            
            # 每 50 個顯示進度
            if [ $((SUCCESS_COUNT % 50)) -eq 0 ]; then
                echo -e "${GREEN}  [$i/$POOL_SIZE] 已成功添加 $SUCCESS_COUNT 個地址...${NC}"
            fi
        else
            FAIL_COUNT=$((FAIL_COUNT + 1))
        fi
    fi
done

echo ""
echo "============================================"
echo -e "${GREEN}✅ 設置完成！${NC}"
echo ""
echo "統計："
echo "  ✅ 成功添加: $SUCCESS_COUNT"
echo "  ⏭️  跳過（已存在）: $SKIP_COUNT"
echo "  ❌ 失敗: $FAIL_COUNT"
echo "  📊 總計: $POOL_SIZE"
echo ""

# 驗證
FINAL_COUNT=$(ip -6 addr show dev "$INTERFACE" | grep -c "inet6 $IPV6_PREFIX" || true)
echo "驗證："
echo "  當前 $INTERFACE 上的 IPv6 地址數: $FINAL_COUNT"
echo ""

# 顯示前 5 個地址作為範例
echo "範例地址（前 5 個）："
ip -6 addr show dev "$INTERFACE" | grep "inet6 $IPV6_PREFIX" | head -5 | awk '{print "  - " $2}'
echo ""

# 測試連接（可選）
echo "測試 IPv6 連接..."
TEST_IPV6=$(ip -6 addr show dev "$INTERFACE" | grep "inet6 $IPV6_PREFIX" | head -1 | awk '{print $2}' | cut -d'/' -f1)

if [ -n "$TEST_IPV6" ]; then
    if ping6 -c 1 -I "$TEST_IPV6" google.com &> /dev/null; then
        echo -e "${GREEN}  ✅ IPv6 連接正常${NC}"
    else
        echo -e "${YELLOW}  ⚠️  IPv6 無法連接到外網（可能需要配置路由）${NC}"
    fi
fi

echo ""
echo "💡 重要提示："
echo "  - 這些地址是隨機生成的"
echo "  - 每次運行此腳本會添加新的隨機地址"
echo "  - 您的程式會從這個大池中隨機選擇"
echo "  - 建議定期重新運行此腳本來更新地址池"
echo ""
echo "下一步："
echo "  1. 確保 .env 文件包含："
echo "     ENABLE_IPV6=true"
echo "     IPV6_PREFIX=\"$IPV6_PREFIX\""
echo "     IPV6_INTERFACE=\"$INTERFACE\""
echo "     IPV6_SKIP_SYSTEM_ADD=true"
echo ""
echo "  2. 啟動您的應用："
echo "     pm2 restart main"
echo ""



