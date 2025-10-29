/**
 * IPv6 配置文件
 * 
 * 配置說明：
 * - 在本地測試時，使用模擬模式（ENABLE_IPV6 = false）
 * - 在 DigitalOcean 部署時，設置環境變數並啟用 IPv6
 * 
 * 環境變數：
 * - IPV6_PREFIX: 您的 IPv6 前綴，例如 "2604:a880:800:10"
 * - IPV6_INTERFACE: 網路介面名稱，例如 "eth0"
 * - ENABLE_IPV6: 是否啟用真實 IPv6 (true/false)
 */

// 從環境變數讀取配置
export const IPv6Config = {
  // 您從 DigitalOcean 獲得的 IPv6 前綴（/64 子網）
  // 在 DigitalOcean 上部署時，請設置環境變數 IPV6_PREFIX
  prefix: process.env.IPV6_PREFIX || 'fd00::', // 預設使用本地測試地址
  
  // 網路介面名稱
  // DigitalOcean Ubuntu 通常是 eth0，某些系統可能是 ens3
  interface: process.env.IPV6_INTERFACE || 'eth0',
  
  // 是否啟用真實的 IPv6 配置
  // 在本地測試時設為 false，在 DigitalOcean 上設為 true
  enabled: process.env.ENABLE_IPV6 === 'true',
  
  // IPv6 地址池大小
  poolSize: parseInt(process.env.IPV6_POOL_SIZE || '200'),
  
  // 是否在日志中顯示詳細信息
  verbose: process.env.IPV6_VERBOSE === 'true',
};

/**
 * 檢查 IPv6 配置是否有效
 */
export function validateIPv6Config() {
  const issues = [];
  
  if (!IPv6Config.prefix) {
    issues.push('❌ IPv6 前綴未設置');
  }
  
  if (!IPv6Config.interface) {
    issues.push('❌ 網路介面未設置');
  }
  
  if (issues.length > 0) {
    console.warn('⚠️  IPv6 配置問題：');
    issues.forEach(issue => console.warn(issue));
    return false;
  }
  
  return true;
}

/**
 * 顯示當前 IPv6 配置
 */
export function showIPv6Config() {
  console.log('\n📋 IPv6 配置：');
  console.log(`   前綴：${IPv6Config.prefix}`);
  console.log(`   介面：${IPv6Config.interface}`);
  console.log(`   啟用：${IPv6Config.enabled ? '✅' : '❌ (模擬模式)'}`);
  console.log(`   池大小：${IPv6Config.poolSize}`);
  console.log('');
  
  if (!IPv6Config.enabled) {
    console.log('💡 提示：目前在模擬模式下運行');
    console.log('   要啟用真實 IPv6，請設置環境變數：');
    console.log('   export ENABLE_IPV6=true');
    console.log('   export IPV6_PREFIX="您的IPv6前綴"');
    console.log('');
  }
}

export default IPv6Config;

