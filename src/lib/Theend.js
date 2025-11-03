import puppeteerCore from "puppeteer-core";
import puppeteer from "puppeteer";
import { scrollToBottom } from "./Hook/ScrollToBottom.js";
import { yahooscrab } from "./Hook/yahooScrabbing.js";
import { checkDB } from "./Hook/CheckDB.js";
import { FastLoad } from "./Hook/FastLoad.js";
import Chromium from "@sparticuz/chromium";

export const url_TE = (pg)=>{
    return `https://tw.bid.yahoo.com/booth/Y3736379923?pg=${pg+1}`
}

export const TE_count = async ()=>{
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
    await page.goto(url_TE(1),{waitUntil:'networkidle0'});
   
    const pages = await page.evaluate(()=>{
        const pgs = document.querySelector("div.sc-16fedlx-0 > div > :nth-last-child(1)")
        return pgs.innerText
    })
    return pages
    console.log("TE 頁面總數爬取完畢")
    
}catch(error){
    console.log("當爬取 TE 頁面時出錯")
}finally{
    await browser.close();
}

}

export const TE_main = async ({page, data})=>{
    // const browser = await puppeteer.launch({headless:false})
    // const page = await browser.newPage()
    // const url = url_AG(1);

        const {url,database} = data
        FastLoad(page);
        await page.goto(url,{waitUntil:'networkidle0'})
        await scrollToBottom(page);
        await page.waitForSelector('li[role="gridcell"]')
        const Info = await yahooscrab(page);
        for (let i=0; i<Info.length; i++){
            await checkDB(database,Info[i],"鐘點站名錶",Info[i][3])
        }
    await page.close();
}