import puppeteerCore from "puppeteer-core";
import puppeteer from "puppeteer";
import { scrollToBottom } from "./Hook/ScrollToBottom.js";
import { yahooscrab } from "./Hook/yahooScrabbing.js";
import { checkDB } from "./Hook/CheckDB.js";
import { FastLoad } from "./Hook/FastLoad.js";
import Chromium from "@sparticuz/chromium";

// IPv6 管理
import ipv6Manager from "./ipv6-proxy-manager.js";
import systemManager from "./ipv6-system-manager.js";


export const url_BL = (pg)=>{
    return `https://tw.bid.yahoo.com/booth/Y0796619069?guccounter=1&pg=${pg+1}`
}

export const BL_count = async ()=>{
    // const CHROMIUM_PATH =
    // "https://vomrghiulbmrfvmhlflk.supabase.co/storage/v1/object/public/chromium-pack/chromium-v123.0.0-pack.tar";
      let browser;
      try{
        // browser = await puppeteerCore.launch({
        //     args: Chromium.args,
        //     defaultViewport: Chromium.defaultViewport,
        //     executablePath: await Chromium.executablePath(CHROMIUM_PATH),
        //     headless: Chromium.headless,
        // });
        browser = await puppeteer.launch({
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-accelerated-2d-canvas',
                '--no-first-run',
                '--no-zygote',
                '--disable-gpu'
            ]
        });
        const page = await browser.newPage()
        await page.goto(url_BL(1),{waitUntil:'networkidle0'});
        await scrollToBottom(page);
        const pages = await page.evaluate(()=>{
            const pgs = document.querySelector("div.sc-16fedlx-0 > div > :nth-last-child(1)") || document.querySelector('div.sc-16fedlx-0.hzzXAb.sc-1567ie7-0.jQjUWm > div > a:nth-last-child(1)')
            return pgs.innerText
        })

        return pages
       
    }   catch (error) {
        console.error('Error in BayLin_count:', error);
    } finally{
        await browser.close();
    }
}

export const BayLin_main = async ({page, data})=>{

    // const browser = await puppeteer.launch({headless:false})
    // const page = await browser.newPage()
    const {url,database} = data
    
    // 為這個任務分配一個唯一的 IPv6 地址
    const ipv6 = ipv6Manager.getIpv6ForSite('BayLin', url);
    await systemManager.addIpv6Address(ipv6);
    console.log(`🌐 [BayLin] 使用 IPv6: ${ipv6} 爬取: ${url}`);
    
    FastLoad(page);
    await page.goto(url,{waitUntil:'networkidle0'})
    await scrollToBottom(page);
    const Info = await yahooscrab(page);
    for (let i=0; i<Info.length; i++){
        await checkDB(database,Info[i],"北林精品當鋪",Info[i][3])
    }
await page.close();
}


