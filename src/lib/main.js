
import { YC, url_YC, YC_count } from "./YongChang.js";

import { XinRue_main, XR_count, url_XR } from "./XinRue.js";
import { WS_url, WS_main, WS_count } from "./watchstore.js";
import { AG_count, url_AG, AGan_main } from "./AGan.js";
import { BL_count, url_BL, BayLin_main } from "./BayLin.js";
import { emc2_count, emc2_main, url_emc2 } from "./emc2.js";
import { HS_Main, HS_count, url_HS } from "./HanShiJi.js";
import { HSe_count, HSe_url, HSe_main } from "./HongSen.js";
import { JC_count, JC_url, JC_main } from "./JinChen.js";
import { url_MBW, MBW_main, MBW_count } from "./MingBiaoWo.js";
import { PW_count, PW_url, PW_main } from "./playwatch.js";
import { RD_url, RD_main, RD_count } from "./Radar.js";
import { TNJ_count, TNJ_main, url_TNJ } from "./TaiNanJing.js";
import { YS_count, YS_url, YS_main } from "./scrabbing.js";
import { TT_count, TT_main, TT_url } from "./TTWatches.js";
import { YSW_count, YSW_main, YSW_url } from "./YongSanWeb.js";
import { YSWF_count, YSWF_main, YSWF_url } from "./YongSanWebFemale.js";

import { YSMB_main, YSWS_count, url_YSWS } from "./YongSanWenShin.js";
import { url_YSWC,YSWC_count,YSMBWC_main } from "./YongSanWuChuen.js";
import { TEW_count, TEW_main, TEW_url } from "./TheendWeb.js";  


import { Cluster } from "puppeteer-cluster";
import { watchesss } from "./Database/database.js";
import fetchWatchMiddleware from "./Database/fetchWatch.js";
import Chromium from "@sparticuz/chromium";
import puppeteerCore from "puppeteer-core";
import puppeteer from "puppeteer-core";

// IPv6 管理相關導入
import ipv6Manager from "./ipv6-proxy-manager.js";
import systemManager from "./ipv6-system-manager.js";
import IPv6Config, { showIPv6Config } from "./ipv6-config.js";

let clusterInstance = null;

const pages = {};

const createCluster = async () => {
  return await Cluster.launch({
    concurrency: Cluster.CONCURRENCY_CONTEXT,
    maxConcurrency: 5,
    monitor: true,
    timeout: 360000,
    puppeteerOptions:{
      headless: true,
      args:[
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu',
        '--incognito'
      ],
      timeout: 60000,
    }
    
  });
};

const getClusterInstance = async () => {
  if (!clusterInstance) {
    clusterInstance = await createCluster();
  }
  return clusterInstance;
};

const clusterTask = async (w, shop) => {
  // 顯示 IPv6 配置信息
  showIPv6Config();
  
  // 顯示初始統計
  console.log('📊 IPv6 管理器狀態：');
  ipv6Manager.showStats();
  await systemManager.showStatus();
  
  const cluster = await getClusterInstance();

  cluster.on("taskerror", (err, data) => {
    console.log(`Error crawling ${data}: ${err.message}`);
    return;
  });

  console.log("🚀 爬取開始");

    if(shop=="TT"){
        Scrapping(TT_count,TT_url,TT_main,w,cluster)
    }
   
    var pages = {}

    try{
      await TEW_count().then(value=>{
        pages['TEW'] = value
      })
    }catch(error){
      console.log(`爬取 TEW 頁面時出錯 ${error}`)
    }

    try{
      await YSW_count().then(value=>{
        pages['YSW'] = value
      })
    }catch(error){
      console.log(`爬取 YSW 頁面時出錯 ${error}`)
    }

    try{
      await YSWF_count().then(value=>{
        pages['YSWF'] = value
      })
    }catch(error){
      console.log(`爬取 YSW 頁面時出錯 ${error}`)
    }

    try{
      await AJ_count().then(value=>{
        pages['AJ'] = value
      })
    }catch(error){
      console.log(`爬取 AJ 頁面時出錯 ${error}`)
    }
    try{
      await TE_count().then(value=>{
        pages['TE'] = value
      })
    }catch(error){
      console.log(`爬取 TE 頁面時出錯 ${error}`)
    }

    try{
        await YSWS_count().then(value=>{
            pages['YSWS'] = value
        })}catch(error){
            console.log(`爬取 YSWS 頁面時出錯 ${error}`)
        }

        try{
            await YSWC_count().then(value=>{
                pages['YSWC'] = value
            })}catch(error){
                console.log(`爬取 YSWC 頁面時出錯 ${error}`)
            }


    start hash here
    try{
    await TT_count().then(value=>{
        pages['TT'] = value
    })}catch(error){
        console.log(`爬取 TT 頁面時出錯 ${error}`)
    }
 
    console.log("TT END")
    try{
    await PW_count().then(value=>{
        pages['PW'] = value
    })}catch(error){
        console.log(`爬取 PW 頁面時出錯 ${error}`)
    }
    console.log("PW END")

  
    // try{
    // await MBW_count().then(value=>{
    //     pages['MBW'] = value
    // })}catch(error){
    //     console.log(`爬取 MBW 頁面時出錯 ${error}`)
    // }
    // console.log("MBW END")

    // try{
    //     await TNJ_count().then(value=>{
    //         pages['TNJ'] = value
    //     })}catch(error){
    //         console.log(`爬取 TNJ 頁面時出錯 ${error}`)
    //     }
    //     console.log("TNJ END")
    try{
    await JC_count().then(value=>{
        pages['JC'] = value
    })}catch(error){
        console.log(`爬取 JC 頁面時出錯 ${error}`)
    }
   
    console.log("JC END")
    try{
    await HSe_count().then(value=>{
        pages['HSe'] = value
    })}catch(error){
        console.log(`爬取 HSe 頁面時出錯 ${error}`)
    }
    console.log("HSe END")

    try{
    await YC_count().then(value=>{
        pages["YC"] = value
    })
  }catch(error){
        console.log(`爬取 YC 頁面時出錯 ${error}`)
    }
    console.log("YC END")

    try{
    await WS_count().then(value=>{
        pages["WS"] = value
    })}catch(error){
        console.log(`爬取 WS 頁面時出錯 ${error}`)
    }
  
    console.log("WS END")
    // try{
    // await XR_count().then(value=>{
    //     pages["XR"] = value
    // })}catch(error){
    //     console.log(`爬取 XR 頁面時出錯 ${error}`)
    // }
    
    // console.log("XR END")
    // try{
    // await AG_count().then(value=>{
    //     pages["AG"] = value
    // })}catch(error){
    //     console.log(`爬取 AG 頁面時出錯 ${error}`)
    // }
   
    // console.log("AG END")
    // try{
    // await BL_count().then(value=>{
    //     pages["BL"] = value
    // })}catch(error){
    //     console.log(`爬取 BL 頁面時出錯 ${error}`)
    // }
    
    // console.log("BL END")
  
 
    try{
    await HS_count().then(value=>{
        pages["HS"] = value
    })}catch(error){
        console.log(`爬取 HS 頁面時出錯 ${error}`)
    }
   
    console.log("HS END")
    try{
        await RD_count().then(value=>{
            pages['RD'] = value
        })}catch(error){
            console.log(`爬取 RD 頁面時出錯 ${error}`)
        }
   
        console.log("開始爬蟲")
    
  //////

    const YSW_urlss=[]
    for(let i=0; i<pages["YSW"];i++){
      YSW_urlss.push(YSW_url(i))
    }
    for(const u of YSW_urlss){
      cluster.queue({url:u, database:w},YSW_main)
    }

    const YSWF_urlss=[]
    for(let i=0; i<pages["YSWF"];i++){
      YSWF_urlss.push(YSWF_url(i))
    }
    for(const u of YSW_urlss){
      cluster.queue({url:u, database:w},YSWF_main)
    }

    const AJ_urlss=[]

    for(let i=0; i<pages["AJ"];i++){
      AJ_urlss.push(url_AJ(i))
    }

    for(const u of AJ_urlss){
      cluster.queue({url:u, database:w},AJ_main)
    }

        const TE_urlss= []
        
        for(let i=0; i<pages["TE"];i++){
            TE_urlss.push(url_TE(i));
        }
        
        for(const u of TE_urlss){
            cluster.queue({url:u, database:w},TE_main)
        }

        const YSWS_urlss= []
        
        for(let i=0; i<pages["YSWS"];i++){
            YSWS_urlss.push(url_YSWS(i));
        }
        
        for(const u of YSWS_urlss){
            cluster.queue({url:u, database:w},YSMB_main)
        }


        const YSWC_urlss= []
        
        for(let i=0; i<pages["YSWC"];i++){
            YSWC_urlss.push(url_YSWC(i));
        }
        
        for(const u of YSWC_urlss){
            cluster.queue({url:u, database:w},YSMBWC_main)
        }


    const TT_urlss= []
        
        for(let i=0; i<pages["TT"];i++){
            TT_urlss.push(TT_url(i+1));
        }
        
        for(const u of TT_urlss){
            cluster.queue({url:u, database:w},TT_main)
        }


  const PW_urlss = [];

  for (let i = 0; i < pages["PW"]; i++) {
    PW_urlss.push(PW_url(i + 1));
  }

  for (const u of PW_urlss) {
    cluster.queue({ url: u, database: w }, PW_main);
  }


//   const MBW_urlss = [];

//   for (let i = 0; i < pages["MBW"]; i++) {
//     MBW_urlss.push(url_MBW(i));
//   }

//   for (const u of MBW_urlss) {
//     cluster.queue({ url: u, database: w }, MBW_main);
//   }

  const TEW_urlss = [];
  for (let i = 0; i < pages["TEW"]; i++) {
    TEW_urlss.push(TEW_url(i));
  }
  for (const u of TEW_urlss) {
    cluster.queue({ url: u, database: w }, TEW_main);
  }

  const YS_urlss = [];

  for (let i = 0; i < pages["YS"]; i++) {
    YS_urlss.push(YS_url(i + 1));
  }

  for (const u of YS_urlss) {
    cluster.queue({ url: u, database: w }, YS_main);
  }
  const JC_urlss = [];

  for (let i = 0; i < pages["JC"]; i++) {
    JC_urlss.push(JC_url(i + 1));
  }

  for (const u of JC_urlss) {
    cluster.queue({ url: u, database: w }, JC_main);
  }

  const HSe_urlss = [];
  for (let i = 0; i < pages["HSe"]; i++) {
    HSe_urlss.push(HSe_url(i + 1));
  }

  for (const u of HSe_urlss) {
    cluster.queue({ url: u, database: w }, HSe_main);
  }

  const YC_urlss = [];
  for (let i = 0; i <= pages["YC"] - 1; i++) {
    YC_urlss.push(url_YC(i * 30));
  }

  for (const u of YC_urlss) {
    cluster.queue({ url: u, database: w }, YC);
  }

  // cluster.queue({url:url_YC(0), database: w}, YC)

  const WS_urlss = [];
  for (let i = 0; i <= pages["WS"]; i++) {
    WS_urlss.push(WS_url(i));
  }

  for (const u of WS_urlss) {
    cluster.queue({ url: u, database: w }, WS_main);
  }

  const XR_urlss = [];
  for (let i = 0; i < pages["XR"]; i++) {
    XR_urlss.push(url_XR(i));
  }

  for (const u of XR_urlss) {
    cluster.queue({ url: u, database: w }, XinRue_main);
  }

  const AG_urlss = [];
  for (let i = 0; i < pages["AG"]; i++) {
    AG_urlss.push(url_AG(i));
  }

  for (const u of AG_urlss) {
    cluster.queue({ url: u, database: w }, AGan_main);
  }

  const BL_urlss = [];
  for (let i = 0; i < pages["BL"]; i++) {
    BL_urlss.push(url_BL(i));
  }

  for (const u of BL_urlss) {
    cluster.queue({ url: u, database: w }, BayLin_main);
  }

  const emc2_urlss = [];
  for (let i = 0; i <= pages["emc2"]; i++) {
    emc2_urlss.push(url_emc2(i + 1));
  }

  for (const u of emc2_urlss) {
    cluster.queue({ url: u, database: w }, emc2_main);
  }

  const HS_urlss = [];
  for (let i = 0; i <= pages["HS"]; i++) {
    HS_urlss.push(url_HS(i + 1));
  }

  for (const u of HS_urlss) {
    cluster.queue({ url: u, database: w }, HS_Main);
  }

  const RD_urlss = [];

  for (let i = 0; i < pages["RD"]; i++) {
    RD_urlss.push(RD_url(i + 1));
  }

  for (const u of RD_urlss) {
    cluster.queue({ url: u, database: w }, RD_main);
  }

  const TNJ_urlss = [];

  for (let i = 0; i < pages["TNJ"]; i++) {
    TNJ_urlss.push(url_TNJ(i));
  }

  for (const u of TNJ_urlss) {
    cluster.queue({ url: u, database: w }, TNJ_main);
  }

  await cluster.idle();
  await cluster.close();
  
  // 顯示最終統計
  console.log('\n📊 爬取完成統計：');
  ipv6Manager.showStats();
  
  // 可選：清理系統上的 IPv6 地址（如果需要）
  // await systemManager.cleanup();
  
  console.log("✅ 爬取完成");
};

export default async function main(shop) {
  await fetchWatchMiddleware();
  await clusterTask(watchesss, shop);
  process.exit(0);
}

main();


import fs from "fs"
import { TE_count, TE_main, url_TE } from "./Theend.js";
import { AJ_count, AJ_main, url_AJ } from "./AJLuxury.js";
import { url } from "inspector";


const loadUrls = ()=>{
    const data = fs.readFileSync('src/test.watchdatas.json')
    const jsonData = JSON.parse(data)
    return jsonData.map(item=>item._id)
}

const watches_delete = async ()=>{
    await fetchWatchMiddleware();
    const urls = loadUrls();
    for(const url of urls){
        try {
            const result = await watchesss.deleteMany({ webp: url });
            console.log(`Deleted ${result.deletedCount} documents with webp: ${url}`);
          } catch (error) {
            console.error(`Error deleting documents with webp: ${url}`, error);
          }
    }
    console.log("Deletion completed");
}

// watches_delete();

