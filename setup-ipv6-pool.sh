#!/bin/bash

# IPv6 地址池設置腳本
# 用於在 DigitalOcean 上預先創建 IPv6 地址

set -e

# 顏色定義
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 IPv6 地址池設置腳本${NC}"
echo "============================================"
echo ""

# 從環境變數讀取或使用預設值
IPV6_PREFIX="${IPV6_PREFIX:-fd00::}"
INTERFACE="${IPV6_INTERFACE:-eth0}"
POOL_SIZE="${IPV6_POOL_SIZE:-200}"

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

# 檢查是否已經有 IPv6 配置
echo "檢查現有 IPv6 配置..."
EXISTING_COUNT=$(ip -6 addr show dev "$INTERFACE" | grep -c "inet6 $IPV6_PREFIX" || true)
echo "  已存在的地址: $EXISTING_COUNT"
echo ""

# 開始添加地址
echo -e "${GREEN}開始創建 IPv6 地址池...${NC}"
echo ""

SUCCESS_COUNT=0
SKIP_COUNT=0
FAIL_COUNT=0

for i in $(seq 1 $POOL_SIZE); do
    # 生成 IPv6 地址
    IPV6="${IPV6_PREFIX}::$(printf '%x' $i)"
    
    # 檢查是否已存在
    if ip -6 addr show dev "$INTERFACE" | grep -q "$IPV6"; then
        SKIP_COUNT=$((SKIP_COUNT + 1))
        if [ $((i % 20)) -eq 0 ]; then
            echo -e "${YELLOW}  [$i/$POOL_SIZE] 跳過已存在的地址...${NC}"
        fi
    else
        # 添加地址
        if ip -6 addr add "$IPV6/64" dev "$INTERFACE" 2>/dev/null; then
            SUCCESS_COUNT=$((SUCCESS_COUNT + 1))
            if [ $((i % 20)) -eq 0 ]; then
                echo -e "${GREEN}  [$i/$POOL_SIZE] 成功添加 $SUCCESS_COUNT 個地址...${NC}"
            fi
        else
            FAIL_COUNT=$((FAIL_COUNT + 1))
            echo -e "${RED}  [$i/$POOL_SIZE] 添加失敗: $IPV6${NC}"
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

# 測試連接（可選）
echo "測試 IPv6 連接..."
TEST_IPV6="${IPV6_PREFIX}::1"

if ping6 -c 1 -I "$TEST_IPV6" google.com &> /dev/null; then
    echo -e "${GREEN}  ✅ IPv6 連接正常${NC}"
else
    echo -e "${YELLOW}  ⚠️  IPv6 無法連接到外網（可能需要配置路由）${NC}"
fi

echo ""
echo "💡 提示："
echo "  - 這些地址在系統重啟後會消失"
echo "  - 要讓配置永久生效，請編輯 /etc/netplan/50-cloud-init.yaml"
echo "  - 或使用 systemd 服務在啟動時運行此腳本"
echo ""
echo "下一步："
echo "  1. 設置環境變數："
echo "     export ENABLE_IPV6=true"
echo "     export IPV6_PREFIX=\"$IPV6_PREFIX\""
echo "     export IPV6_INTERFACE=\"$INTERFACE\""
echo ""
echo "  2. 運行測試："
echo "     node test-ipv6.js"
echo ""
echo "  3. 啟動爬蟲："
echo "     node src/lib/main.js"
echo ""

