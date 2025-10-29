/**
 * IPv6 清理腳本
 * 
 * 用途：移除所有由爬蟲程式添加的 IPv6 地址
 * 
 * 使用方式：
 * node cleanup-ipv6.js
 * 
 * 注意：需要 sudo 權限
 */

import systemManager from './src/lib/ipv6-system-manager.js';
import { showIPv6Config } from './src/lib/ipv6-config.js';

console.log('🧹 IPv6 地址清理腳本\n');
console.log('='.repeat(60));

// 顯示配置
showIPv6Config();

// 顯示當前狀態
await systemManager.showStatus();

// 詢問確認
console.log('⚠️  警告：此操作將移除所有已追蹤的 IPv6 地址');
console.log('');

const stats = systemManager.getStats();

if (stats.trackedAddresses === 0) {
  console.log('✓ 沒有需要清理的 IPv6 地址');
  process.exit(0);
}

console.log(`即將清理 ${stats.trackedAddresses} 個 IPv6 地址：`);
stats.addresses.slice(0, 5).forEach(addr => {
  console.log(`  - ${addr}`);
});

if (stats.addresses.length > 5) {
  console.log(`  ... 還有 ${stats.addresses.length - 5} 個地址`);
}

console.log('');

// 在真實環境中執行清理
if (process.env.ENABLE_IPV6 === 'true') {
  console.log('開始清理...\n');
  const result = await systemManager.cleanup();
  
  console.log('\n清理結果：');
  console.log(`  成功: ${result.cleaned}`);
  console.log(`  失敗: ${result.failed}`);
} else {
  console.log('💡 在模擬模式下運行，未實際清理');
  console.log('   要啟用真實清理，請設置 ENABLE_IPV6=true');
}

console.log('\n' + '='.repeat(60));
console.log('✅ 清理完成\n');

