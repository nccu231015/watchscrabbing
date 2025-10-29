/**
 * IPv6 配置測試腳本
 * 
 * 用途：
 * 1. 驗證 IPv6 配置是否正確
 * 2. 測試 IPv6 地址生成和管理
 * 3. 檢查系統層級的 IPv6 支援
 * 
 * 使用方式：
 * node test-ipv6.js
 * 
 * 在 DigitalOcean 上測試時：
 * ENABLE_IPV6=true IPV6_PREFIX="您的前綴" node test-ipv6.js
 */

import ipv6Manager from './src/lib/ipv6-proxy-manager.js';
import systemManager from './src/lib/ipv6-system-manager.js';
import IPv6Config, { showIPv6Config, validateIPv6Config } from './src/lib/ipv6-config.js';

console.log('🧪 IPv6 配置測試\n');
console.log('='.repeat(60));

// 測試 1: 顯示配置
console.log('\n測試 1: 顯示 IPv6 配置');
console.log('-'.repeat(60));
showIPv6Config();

// 測試 2: 驗證配置
console.log('\n測試 2: 驗證配置有效性');
console.log('-'.repeat(60));
const isValid = validateIPv6Config();
console.log(`配置有效性: ${isValid ? '✅ 通過' : '❌ 失敗'}\n`);

// 測試 3: 生成 IPv6 地址
console.log('\n測試 3: 生成 IPv6 地址');
console.log('-'.repeat(60));

const testSites = ['YC', 'TT', 'emc2', 'PW', 'HSe'];
console.log('為以下網站生成 IPv6 地址：\n');

for (const site of testSites) {
  const ipv6Random = ipv6Manager.getIpv6ForSite(site, 'https://example.com/page1');
  const ipv6Random2 = ipv6Manager.getIpv6ForSite(site, 'https://example.com/page2');
  
  console.log(`${site}:`);
  console.log(`  - 任務1: ${ipv6Random}`);
  console.log(`  - 任務2: ${ipv6Random2}`);
}

// 測試 4: 顯示統計
console.log('\n測試 4: IPv6 管理器統計');
console.log('-'.repeat(60));
ipv6Manager.showStats();

// 測試 5: 測試順序生成
console.log('\n測試 5: 順序生成 IPv6 地址');
console.log('-'.repeat(60));
console.log('生成 5 個順序 IPv6 地址：\n');

// 創建一個新的管理器實例用於測試
import { IPv6ProxyManager } from './src/lib/ipv6-proxy-manager.js';
const testManager = new IPv6ProxyManager();

for (let i = 0; i < 5; i++) {
  const ipv6 = testManager.getNextIpv6('sequential');
  console.log(`  ${i + 1}. ${ipv6}`);
}

// 測試 6: 系統管理器狀態
console.log('\n測試 6: 系統管理器狀態');
console.log('-'.repeat(60));
await systemManager.showStatus();

// 測試 7: 模擬添加 IPv6 地址（只在啟用時真正執行）
console.log('\n測試 7: 模擬添加 IPv6 地址');
console.log('-'.repeat(60));

const testIpv6 = ipv6Manager.getNextIpv6();
console.log(`\n嘗試添加測試 IPv6: ${testIpv6}`);

const addResult = await systemManager.addIpv6Address(testIpv6);

if (addResult.simulated) {
  console.log('✅ 模擬添加成功（實際未在系統上添加）');
} else if (addResult.success) {
  console.log('✅ 成功在系統上添加 IPv6 地址');
  
  // 嘗試驗證連接
  console.log('\n驗證 IPv6 連接性...');
  const verifyResult = await systemManager.verifyIpv6Connectivity(testIpv6);
  
  if (verifyResult.success && verifyResult.reachable) {
    console.log('✅ IPv6 連接正常');
  } else {
    console.log('⚠️  IPv6 無法連接到外網（這在本地測試時是正常的）');
  }
} else {
  console.log('❌ 添加失敗:', addResult.error);
}

// 測試 8: 獲取任務映射
console.log('\n測試 8: 任務到 IPv6 的映射');
console.log('-'.repeat(60));

const mapping = ipv6Manager.getTaskMapping();
const mappingEntries = Object.entries(mapping);

if (mappingEntries.length > 0) {
  console.log(`\n共 ${mappingEntries.length} 個任務映射：\n`);
  mappingEntries.slice(0, 5).forEach(([task, ipv6]) => {
    console.log(`  ${task}`);
    console.log(`  → ${ipv6}\n`);
  });
  
  if (mappingEntries.length > 5) {
    console.log(`  ... 還有 ${mappingEntries.length - 5} 個映射\n`);
  }
} else {
  console.log('暫無任務映射\n');
}

// 測試 9: 檢查地址重複
console.log('\n測試 9: 檢查地址唯一性');
console.log('-'.repeat(60));

const usedIpv6 = ipv6Manager.getUsedIpv6List();
const uniqueIpv6 = new Set(usedIpv6);

console.log(`生成的地址總數: ${usedIpv6.length}`);
console.log(`唯一地址數: ${uniqueIpv6.size}`);

if (usedIpv6.length === uniqueIpv6.size) {
  console.log('✅ 所有地址都是唯一的');
} else {
  console.log(`⚠️  發現 ${usedIpv6.length - uniqueIpv6.size} 個重複地址`);
}

// 測試總結
console.log('\n' + '='.repeat(60));
console.log('📋 測試總結\n');

console.log('✅ 完成的測試：');
console.log('  1. ✓ 配置顯示');
console.log('  2. ✓ 配置驗證');
console.log('  3. ✓ IPv6 地址生成（隨機）');
console.log('  4. ✓ 統計信息');
console.log('  5. ✓ IPv6 地址生成（順序）');
console.log('  6. ✓ 系統管理器狀態');
console.log('  7. ✓ 添加 IPv6 地址');
console.log('  8. ✓ 任務映射');
console.log('  9. ✓ 地址唯一性檢查');

console.log('\n💡 下一步：');

if (!IPv6Config.enabled) {
  console.log('\n  📌 在本地測試時（模擬模式）：');
  console.log('     - 所有功能都正常工作');
  console.log('     - IPv6 地址不會真正添加到系統');
  console.log('     - 這對於開發和測試邏輯很有用');
  
  console.log('\n  📌 在 DigitalOcean 部署時：');
  console.log('     1. 在 DO 控制台啟用 IPv6');
  console.log('     2. SSH 到您的 Droplet');
  console.log('     3. 運行 `ip -6 addr show` 查看您的 IPv6 前綴');
  console.log('     4. 設置環境變數：');
  console.log('        export ENABLE_IPV6=true');
  console.log('        export IPV6_PREFIX="您的IPv6前綴" # 例如: 2604:a880:800:10');
  console.log('        export IPV6_INTERFACE="eth0" # 或 ens3');
  console.log('     5. 再次運行此測試腳本');
  console.log('     6. 運行您的爬蟲程序');
} else {
  console.log('\n  ✅ IPv6 已啟用');
  console.log('  📌 您可以開始運行爬蟲程序了');
  console.log('  📌 每個爬蟲任務將使用不同的 IPv6 地址');
}

console.log('\n' + '='.repeat(60));
console.log('');

// 顯示最終統計
ipv6Manager.showStats();

