/**
 * IPv6 代理管理器
 * 
 * 功能：
 * - 生成和管理 IPv6 地址池
 * - 為每個爬蟲任務分配唯一的 IPv6 地址
 * - 支援隨機或順序分配策略
 * - 追蹤已使用的 IPv6 地址
 */

import crypto from 'crypto';
import IPv6Config from './ipv6-config.js';

class IPv6ProxyManager {
  constructor() {
    this.prefix = IPv6Config.prefix;
    this.poolSize = IPv6Config.poolSize;
    this.verbose = IPv6Config.verbose;
    
    // 已使用的 IPv6 地址集合
    this.usedIpv6 = new Set();
    
    // 地址分配計數器（用於順序分配）
    this.counter = 1;
    
    // 任務到 IPv6 的映射（用於追蹤）
    this.taskIpv6Map = new Map();
    
    if (this.verbose) {
      console.log(`🔧 IPv6ProxyManager 初始化完成`);
      console.log(`   前綴: ${this.prefix}`);
      console.log(`   池大小: ${this.poolSize}`);
    }
  }

  /**
   * 生成隨機的 IPv6 地址（在您的 /64 子網內）
   * 
   * IPv6 地址格式：前綴:隨機1:隨機2:隨機3:隨機4
   * 例如：2604:a880:800:10:1234:5678:9abc:def0
   */
  generateRandomIpv6() {
    const maxAttempts = 100;
    let attempts = 0;
    
    while (attempts < maxAttempts) {
      // 生成後 64 位的隨機部分（4 組 16 位）
      const random1 = crypto.randomBytes(2).toString('hex');
      const random2 = crypto.randomBytes(2).toString('hex');
      const random3 = crypto.randomBytes(2).toString('hex');
      const random4 = crypto.randomBytes(2).toString('hex');
      
      const ipv6 = `${this.prefix}:${random1}:${random2}:${random3}:${random4}`;
      
      // 確保不重複
      if (!this.usedIpv6.has(ipv6)) {
        this.usedIpv6.add(ipv6);
        return ipv6;
      }
      
      attempts++;
    }
    
    // 如果隨機生成失敗，回退到順序生成
    console.warn('⚠️  隨機生成 IPv6 失敗，使用順序生成');
    return this.generateSequentialIpv6();
  }

  /**
   * 生成順序的 IPv6 地址
   * 
   * 格式：前綴::計數器
   * 例如：2604:a880:800:10::1, 2604:a880:800:10::2, ...
   */
  generateSequentialIpv6() {
    const ipv6 = `${this.prefix}::${this.counter.toString(16)}`;
    this.counter++;
    this.usedIpv6.add(ipv6);
    return ipv6;
  }

  /**
   * 獲取下一個可用的 IPv6 地址
   * 
   * @param {string} strategy - 分配策略：'random' 或 'sequential'
   * @returns {string} IPv6 地址
   */
  getNextIpv6(strategy = 'random') {
    // 檢查是否達到池大小限制
    if (this.usedIpv6.size >= this.poolSize) {
      console.warn(`⚠️  IPv6 地址池已滿 (${this.poolSize})，重用現有地址`);
      // 重用最早的地址（簡單的輪換策略）
      const addresses = Array.from(this.usedIpv6);
      return addresses[this.usedIpv6.size % addresses.length];
    }
    
    let ipv6;
    if (strategy === 'random') {
      ipv6 = this.generateRandomIpv6();
    } else {
      ipv6 = this.generateSequentialIpv6();
    }
    
    if (this.verbose) {
      console.log(`🆕 分配新 IPv6: ${ipv6} (策略: ${strategy})`);
    }
    
    return ipv6;
  }

  /**
   * 為特定任務獲取 IPv6 地址
   * 
   * @param {string} taskId - 任務 ID（例如：'YC-https://example.com/page1'）
   * @param {boolean} reuse - 是否重用已分配給該任務的地址
   * @returns {string} IPv6 地址
   */
  getIpv6ForTask(taskId, reuse = false) {
    // 如果要求重用且已有分配，返回現有地址
    if (reuse && this.taskIpv6Map.has(taskId)) {
      const existingIpv6 = this.taskIpv6Map.get(taskId);
      if (this.verbose) {
        console.log(`♻️  重用 IPv6 for task ${taskId}: ${existingIpv6}`);
      }
      return existingIpv6;
    }
    
    // 分配新地址
    const ipv6 = this.getNextIpv6();
    this.taskIpv6Map.set(taskId, ipv6);
    
    return ipv6;
  }

  /**
   * 為網站獲取 IPv6 地址
   * 
   * @param {string} siteCode - 網站代碼（例如：'YC', 'TT', 'emc2'）
   * @param {string} url - URL（可選，用於生成唯一任務 ID）
   * @returns {string} IPv6 地址
   */
  getIpv6ForSite(siteCode, url = null) {
    const taskId = url ? `${siteCode}-${url}` : siteCode;
    return this.getIpv6ForTask(taskId, false); // 每次都分配新地址
  }

  /**
   * 重置管理器狀態
   * 
   * @param {boolean} clearMapping - 是否清除任務映射
   */
  reset(clearMapping = true) {
    this.usedIpv6.clear();
    this.counter = 1;
    
    if (clearMapping) {
      this.taskIpv6Map.clear();
    }
    
    if (this.verbose) {
      console.log('🔄 IPv6ProxyManager 已重置');
    }
  }

  /**
   * 獲取統計信息
   */
  getStats() {
    return {
      totalUsed: this.usedIpv6.size,
      poolSize: this.poolSize,
      utilization: ((this.usedIpv6.size / this.poolSize) * 100).toFixed(2) + '%',
      tasksTracked: this.taskIpv6Map.size,
      currentCounter: this.counter,
    };
  }

  /**
   * 顯示統計信息
   */
  showStats() {
    const stats = this.getStats();
    console.log('\n📊 IPv6 使用統計：');
    console.log(`   已使用: ${stats.totalUsed}/${stats.poolSize}`);
    console.log(`   利用率: ${stats.utilization}`);
    console.log(`   追蹤任務: ${stats.tasksTracked}`);
    console.log(`   當前計數器: ${stats.currentCounter}`);
    console.log('');
  }

  /**
   * 獲取已使用的 IPv6 地址列表
   */
  getUsedIpv6List() {
    return Array.from(this.usedIpv6);
  }

  /**
   * 獲取任務到 IPv6 的映射
   */
  getTaskMapping() {
    return Object.fromEntries(this.taskIpv6Map);
  }
}

// 創建單例實例
export const ipv6Manager = new IPv6ProxyManager();

// 也導出類本身，以便需要創建多個實例時使用
export { IPv6ProxyManager };

export default ipv6Manager;

