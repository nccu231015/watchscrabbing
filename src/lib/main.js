
import {Cluster} from 'puppeteer-cluster';
import { YC,url_YC, YC_count } from './YongChang.js';
import { XinRue_main, XR_count, url_XR } from './XinRue.js';
import { WS_url, WS_main, WS_count } from './watchstore.js';
import { AG_count, url_AG, AGan_main } from './AGan.js';
import { BL_count, url_BL, BayLin_main } from './BayLin.js';
import { emc2_count, emc2_main, url_emc2 } from './emc2.js';
import { HS_Main, HS_count, url_HS } from './HanShiJi.js';
import { HSe_count, HSe_url, HSe_main } from './HongSen.js';
import { JC_count, JC_url, JC_main } from './JinChen.js';
import { url_MBW,MBW_main, MBW_count } from './MingBiaoWo.js';
import { PW_count,PW_url,PW_main } from './playwatch.js';
import { RD_url, RD_main, RD_count } from './Radar.js';
import { TNJ_count, TNJ_main, url_TNJ } from './TaiNanJing.js';
import { YS_count, YS_url, YS_main } from './scrabbing.js';
import { TT_count, TT_main, TT_url } from './TTWatches.js';



import {watchesss} from './Database/database.js';
import mongoose from 'mongoose';
import fetchWatchMiddleware from './Database/fetchWatch.js';
import puppeteer from 'puppeteer-core';
import chromium from "@sparticuz/chromium"

const clusterTask = async (w)=>{
    const cluster = await Cluster.launch({
        concurrency: Cluster.CONCURRENCY_CONTEXT,
        maxConcurrency: 5,
        puppeteer,
        puppeteerOptions:{
            args: chromium.args,
            defaultViewport: chromium.defaultViewport,
            executablePath: await chromium.executablePath(),
            headless: chromium.headless,
            ignoreHTTPSErrors: true,
        },
        monitor: true,
        timeout: 360000,
    });

    cluster.on('taskerror', (err, data) => {
        console.log(`Error crawling ${data}: ${err.message}`);
        return
    });

    const pages = {}


    console.log("爬取開始")
    
    // Get Total pages
    try{
    await TT_count().then(value=>{
        pages['TT'] = value
    })}catch(error){
        console.log(`爬取 TT 頁面時出錯 ${error}`)
    }

    console.log("爬取開始1")

    try{
    await YS_count().then(value=>{
        pages['YS'] = value
    })}catch(error){
        console.log(`爬取 YS 頁面時出錯 ${error}`)
    }
    console.log("爬取開始2")

    try{
    await RD_count().then(value=>{
        pages['RD'] = value
    })}catch(error){
        console.log(`爬取 RD 頁面時出錯 ${error}`)
    }
    console.log("爬取開始3")

    try{
    await TNJ_count().then(value=>{
        pages['TNJ'] = value
    })}catch(error){
        console.log(`爬取 TNJ 頁面時出錯 ${error}`)
    }
    console.log("爬取開始4")

    try{
    await PW_count().then(value=>{
        pages['PW'] = value
    })}catch(error){
        console.log(`爬取 PW 頁面時出錯 ${error}`)
    }
    console.log("爬取開始5")

    try{
    await MBW_count().then(value=>{
        pages['MBW'] = value
    })}catch(error){
        console.log(`爬取 MBW 頁面時出錯 ${error}`)
    }
    console.log("爬取開始6")

    try{
    await JC_count().then(value=>{
        pages['JC'] = value
    })}catch(error){
        console.log(`爬取 JC 頁面時出錯 ${error}`)
    }
    console.log("爬取開始7")

    try{
    await HSe_count().then(value=>{
        pages['HSe'] = value
    })}catch(error){
        console.log(`爬取 HSe 頁面時出錯 ${error}`)
    }
    console.log("爬取開始8")

    try{
    await YC_count().then(value=>{
        pages["YC"] = value
    })}catch(error){
        console.log(`爬取 YC 頁面時出錯 ${error}`)
    }
    console.log("爬取開始9")

    try{
    await WS_count().then(value=>{
        pages["WS"] = value
    })}catch(error){
        console.log(`爬取 WS 頁面時出錯 ${error}`)
    }
    console.log("爬取開始10")

    try{
    await XR_count().then(value=>{
        pages["XR"] = value
    })}catch(error){
        console.log(`爬取 XR 頁面時出錯 ${error}`)
    }
    console.log("爬取開始11")

    try{
    await AG_count().then(value=>{
        pages["AG"] = value
    })}catch(error){
        console.log(`爬取 AG 頁面時出錯 ${error}`)
    }
    console.log("爬取開始12")

    try{
    await BL_count().then(value=>{
        pages["BL"] = value
    })}catch(error){
        console.log(`爬取 BL 頁面時出錯 ${error}`)
    }
    console.log("爬取開始13")
    try{
    await emc2_count().then(value=>{
        pages["emc2"] = value
    })}catch(error){
        console.log(`爬取 emc2 頁面時出錯 ${error}`)
    }
    console.log("爬取開始14")
    try{
    await HS_count().then(value=>{
        pages["HS"] = value
    })}catch(error){
        console.log(`爬取 HS 頁面時出錯 ${error}`)
    }
    console.log("End")
   
    //YC
    const TT_urlss= []
    
    for(let i=0; i<pages["TT"];i++){
        TT_urlss.push(TT_url(i+1));
    }
    
    for(const u of TT_urlss){
        cluster.queue({url:u, database:w},TT_main)
    }

    const YS_urlss= []
    
    for(let i=0; i<pages["YS"];i++){
        YS_urlss.push(YS_url(i+1));
    }
    
    for(const u of YS_urlss){
        cluster.queue({url:u, database:w},YS_main)
    }

    const TNJ_urlss= []
    
    for(let i=0; i<pages["TNJ"];i++){
        TNJ_urlss.push(url_TNJ(i));
    }
    
    for(const u of TNJ_urlss){
        cluster.queue({url:u, database:w},TNJ_main)
    }

    const RD_urlss= []
    
    for(let i=0; i<pages["RD"];i++){
        RD_urlss.push(RD_url(i+1));
    }
    
    for(const u of RD_urlss){
        cluster.queue({url:u, database:w},RD_main)
    }

    const PW_urlss= []
    
    for(let i=0; i<pages["PW"];i++){
        PW_urlss.push(PW_url(i+1));
    }
    
    for(const u of PW_urlss){
        cluster.queue({url:u, database:w},PW_main)
    }

    const MBW_urlss= []
    
    for(let i=0; i<pages["MBW"];i++){
        MBW_urlss.push(url_MBW(i));
    }

    for(const u of MBW_urlss){
        cluster.queue({url:u, database:w},MBW_main)
    }

    const JC_urlss= []
    
    for(let i=0; i<pages["JC"];i++){
        JC_urlss.push(JC_url(i+1));
    }

    for(const u of JC_urlss){
        cluster.queue({url:u, database:w},JC_main)
    }

    const HSe_urlss= []
    for(let i=0; i<pages["HSe"];i++){
        HSe_urlss.push(HSe_url(i+1));
    }

    for(const u of HSe_urlss){
        cluster.queue({url:u, database:w},HSe_main)
    }

    const YC_urlss = [];
    for (let i = 0; i <= pages["YC"]-1; i++) {
        YC_urlss.push(url_YC(i * 30));
    }

    for (const u of YC_urlss) {
        cluster.queue({url:u, database:w},YC);
    }

    const WS_urlss=[]
    for(let i=0; i<=pages["WS"];i++){
        WS_urlss.push(WS_url(i));
    }

    for (const u of WS_urlss){
        cluster.queue({url:u, database:w},WS_main)
    }

    const XR_urlss= []
    for(let i=0; i<pages["XR"];i++){
        XR_urlss.push(url_XR(i));
    }

    for(const u of XR_urlss){
        cluster.queue({url:u, database:w},XinRue_main)
    }

    const AG_urlss= []
    for(let i=0; i<pages["AG"];i++){
        AG_urlss.push(url_AG(i));
    }

    for(const u of AG_urlss){
        cluster.queue({url:u, database:w},AGan_main)
    }

    const BL_urlss= []
    for(let i=0; i<pages["BL"];i++){
        BL_urlss.push(url_BL(i));
    }

    for(const u of BL_urlss){
        cluster.queue({url:u, database:w},BayLin_main)
    }

    const emc2_urlss= []
    for(let i=0; i<=pages["emc2"];i++){
        emc2_urlss.push(url_emc2(i+1));
    }

    for(const u of emc2_urlss){
        cluster.queue({url:u, database:w},emc2_main)
    }

    const HS_urlss= []
    for(let i=0; i<=pages["HS"];i++){
        HS_urlss.push(url_HS(i+1));
    }

    for(const u of HS_urlss){
        cluster.queue({url:u, database:w},HS_Main)
    }

    await cluster.idle();
    await cluster.close();
    console.log("done")
}


export default async function main(){
    await fetchWatchMiddleware();
    await clusterTask(watchesss);
}

main();