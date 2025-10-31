/**
 * IPv6 系統管理器
 * 
 * 功能：
 * - 在系統層級添加和移除 IPv6 地址
 * - 驗證 IPv6 地址是否可用
 * - 批量管理 IPv6 地址
 * - 支援 macOS 和 Linux
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import IPv6Config from './ipv6-config.js';

const execAsync = promisify(exec);

class IPv6SystemManager {
  constructor(interfaceName = null) {
    this.interface = interfaceName || IPv6Config.interface;
    this.enabled = IPv6Config.enabled;
    this.verbose = IPv6Config.verbose;
    
    // 追蹤已添加的地址
    this.addedAddresses = new Set();
    
    // 檢測操作系統
    this.platform = process.platform;
    
    if (this.verbose) {
      console.log(`🔧 IPv6SystemManager 初始化完成`);
      console.log(`   平台: ${this.platform}`);
      console.log(`   介面: ${this.interface}`);
      console.log(`   啟用: ${this.enabled}`);
    }
  }

  /**
   * 檢查 IPv6 地址是否已存在於系統上
   */
  async checkIpv6Exists(ipv6) {
    if (!this.enabled) {
      // 模擬模式：假設地址存在
      return true;
    }

    try {
      let command;
      
      if (this.platform === 'darwin') {
        // macOS
        command = `ifconfig ${this.interface}`;
      } else {
        // Linux
        command = `ip -6 addr show dev ${this.interface}`;
      }
      
      const { stdout } = await execAsync(command);
      return stdout.includes(ipv6);
    } catch (error) {
      if (this.verbose) {
        console.error(`❌ 檢查 IPv6 ${ipv6} 失敗: ${error.message}`);
      }
      return false;
    }
  }

  /**
   * 在系統上添加 IPv6 地址
   */
  async addIpv6Address(ipv6) {
    // 如果設置了跳過系統添加（生產環境，直接使用 /64 子網）
    if (process.env.IPV6_SKIP_SYSTEM_ADD === 'true') {
      this.addedAddresses.add(ipv6);
      if (this.verbose) {
        console.log(`✓ [跳過添加] 使用 IPv6: ${ipv6}`);
      }
      return { success: true, skipped: true };
    }
    
    // 如果未啟用，只記錄不實際執行
    if (!this.enabled) {
      if (this.verbose) {
        console.log(`🔸 [模擬] 添加 IPv6: ${ipv6}`);
      }
      this.addedAddresses.add(ipv6);
      return { success: true, simulated: true };
    }

    // 檢查是否已添加
    if (this.addedAddresses.has(ipv6)) {
      if (this.verbose) {
        console.log(`✓ IPv6 已存在（已追蹤）: ${ipv6}`);
      }
      return { success: true, existed: true };
    }

    try {
      // 先檢查系統上是否已存在
      const exists = await this.checkIpv6Exists(ipv6);
      if (exists) {
        this.addedAddresses.add(ipv6);
        if (this.verbose) {
          console.log(`✓ IPv6 已存在（系統上）: ${ipv6}`);
        }
        return { success: true, existed: true };
      }

      // 根據平台執行不同的命令
      let command;
      
      if (this.platform === 'darwin') {
        // macOS
        command = `sudo ifconfig ${this.interface} inet6 ${ipv6}/64 add`;
      } else {
        // Linux
        command = `sudo ip -6 addr add ${ipv6}/64 dev ${this.interface}`;
      }

      await execAsync(command);
      this.addedAddresses.add(ipv6);
      
      if (this.verbose) {
        console.log(`✅ 成功添加 IPv6: ${ipv6}`);
      }
      
      return { success: true, added: true };
    } catch (error) {
      console.error(`❌ 添加 IPv6 失敗 ${ipv6}: ${error.message}`);
      return { success: false, error: error.message };
    }
  }

  /**
   * 批量添加 IPv6 地址
   */
  async addMultipleIpv6(ipv6List, showProgress = true) {
    if (showProgress) {
      console.log(`\n🚀 開始批量添加 ${ipv6List.length} 個 IPv6 地址...`);
    }

    const results = [];
    let successful = 0;
    let existed = 0;
    let failed = 0;

    for (const [index, ipv6] of ipv6List.entries()) {
      if (showProgress && (index + 1) % 10 === 0) {
        console.log(`   進度: ${index + 1}/${ipv6List.length}`);
      }

      const result = await this.addIpv6Address(ipv6);
      results.push({ ipv6, ...result });

      if (result.success) {
        if (result.added) {
          successful++;
        } else if (result.existed) {
          existed++;
        }
      } else {
        failed++;
      }
    }

    const summary = {
      total: ipv6List.length,
      successful,
      existed,
      failed,
      results,
    };

    if (showProgress) {
      console.log(`\n✅ 批量添加完成:`);
      console.log(`   成功: ${successful}`);
      console.log(`   已存在: ${existed}`);
      console.log(`   失敗: ${failed}`);
      console.log('');
    }

    return summary;
  }

  /**
   * 移除 IPv6 地址
   */
  async removeIpv6Address(ipv6) {
    // 如果未啟用，只記錄不實際執行
    if (!this.enabled) {
      if (this.verbose) {
        console.log(`🔸 [模擬] 移除 IPv6: ${ipv6}`);
      }
      this.addedAddresses.delete(ipv6);
      return { success: true, simulated: true };
    }

    try {
      let command;
      
      if (this.platform === 'darwin') {
        // macOS
        command = `sudo ifconfig ${this.interface} inet6 ${ipv6}/64 delete`;
      } else {
        // Linux
        command = `sudo ip -6 addr del ${ipv6}/64 dev ${this.interface}`;
      }

      await execAsync(command);
      this.addedAddresses.delete(ipv6);
      
      if (this.verbose) {
        console.log(`🗑️  已移除 IPv6: ${ipv6}`);
      }
      
      return { success: true, removed: true };
    } catch (error) {
      console.error(`❌ 移除 IPv6 失敗 ${ipv6}: ${error.message}`);
      return { success: false, error: error.message };
    }
  }

  /**
   * 清理所有已添加的 IPv6 地址
   */
  async cleanup() {
    if (this.addedAddresses.size === 0) {
      console.log('✓ 沒有需要清理的 IPv6 地址');
      return { success: true, cleaned: 0 };
    }

    console.log(`\n🧹 開始清理 ${this.addedAddresses.size} 個 IPv6 地址...`);
    
    const addresses = Array.from(this.addedAddresses);
    let cleaned = 0;
    let failed = 0;

    for (const ipv6 of addresses) {
      const result = await this.removeIpv6Address(ipv6);
      if (result.success) {
        cleaned++;
      } else {
        failed++;
      }
    }

    console.log(`✅ 清理完成: 成功 ${cleaned}, 失敗 ${failed}\n`);
    
    return { success: true, cleaned, failed };
  }

  /**
   * 驗證 IPv6 地址是否可以連接到外網
   */
  async verifyIpv6Connectivity(ipv6, testHost = 'google.com') {
    if (!this.enabled) {
      if (this.verbose) {
        console.log(`🔸 [模擬] 驗證 IPv6 連接: ${ipv6}`);
      }
      return { success: true, simulated: true };
    }

    try {
      let command;
      
      if (this.platform === 'darwin') {
        // macOS
        command = `ping6 -c 1 -S ${ipv6} ${testHost}`;
      } else {
        // Linux
        command = `ping6 -c 1 -I ${ipv6} ${testHost}`;
      }

      await execAsync(command, { timeout: 5000 });
      
      if (this.verbose) {
        console.log(`✅ IPv6 ${ipv6} 連接正常`);
      }
      
      return { success: true, reachable: true };
    } catch (error) {
      if (this.verbose) {
        console.log(`❌ IPv6 ${ipv6} 無法連接: ${error.message}`);
      }
      return { success: false, reachable: false, error: error.message };
    }
  }

  /**
   * 獲取當前介面的所有 IPv6 地址
   */
  async listCurrentIpv6Addresses() {
    try {
      let command;
      
      if (this.platform === 'darwin') {
        command = `ifconfig ${this.interface} | grep inet6`;
      } else {
        command = `ip -6 addr show dev ${this.interface} | grep inet6`;
      }

      const { stdout } = await execAsync(command);
      
      // 解析輸出提取 IPv6 地址
      const addresses = [];
      const lines = stdout.split('\n');
      
      for (const line of lines) {
        const match = line.match(/inet6\s+([0-9a-f:]+)/);
        if (match) {
          addresses.push(match[1]);
        }
      }
      
      return addresses;
    } catch (error) {
      console.error(`❌ 列出 IPv6 地址失敗: ${error.message}`);
      return [];
    }
  }

  /**
   * 顯示當前狀態
   */
  async showStatus() {
    console.log('\n📊 IPv6 系統管理器狀態：');
    console.log(`   平台: ${this.platform}`);
    console.log(`   介面: ${this.interface}`);
    console.log(`   啟用: ${this.enabled ? '✅' : '❌ (模擬模式)'}`);
    console.log(`   已追蹤地址數: ${this.addedAddresses.size}`);
    
    if (this.enabled) {
      const current = await this.listCurrentIpv6Addresses();
      console.log(`   系統當前 IPv6 數: ${current.length}`);
    }
    
    console.log('');
  }

  /**
   * 獲取統計信息
   */
  getStats() {
    return {
      platform: this.platform,
      interface: this.interface,
      enabled: this.enabled,
      trackedAddresses: this.addedAddresses.size,
      addresses: Array.from(this.addedAddresses),
    };
  }
}

// 創建單例實例
export const systemManager = new IPv6SystemManager();

// 也導出類本身
export { IPv6SystemManager };

export default systemManager;

