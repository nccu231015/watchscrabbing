import puppeteerCore from "puppeteer-core";
import { scrollToBottom } from "./Hook/ScrollToBottom.js"
import { yahooscrabforYC } from "./Hook/yahooScrabForYC.js";
import { checkDB } from "./Hook/CheckDB.js"
import { FastLoad } from "./Hook/FastLoad.js"
import Chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer";


export const url_YSWC = (pg)=>{
    return `https://tw.bid.yahoo.com/tw/booth/Y5651372126?pg=${pg+1}`
}


export const YSWC_count = async ()=>{
    // const CHROMIUM_PATH =
    // "https://vomrghiulbmrfvmhlflk.supabase.co/storage/v1/object/public/chromium-pack/chromium-v123.0.0-pack.tar";
    let browser
    try{
        // browser = await puppeteerCore.launch({
        //     args: Chromium.args,
        //     defaultViewport: Chromium.defaultViewport,
        //     executablePath: await Chromium.executablePath(CHROMIUM_PATH),
        //     headless: Chromium.headless,
        // });
        browser = await puppeteer.launch();
    const page = await browser.newPage()
    await page.goto(url_YSWC(1),{waitUntil:'networkidle0'});
    const pages = await page.evaluate(()=>{
        
        const pgs = document.querySelector("div.sc-16fedlx-0.jwCAFM.sc-5ehcvq-5.ylMOH > div.sc-16fedlx-1.jDxESf > a:nth-last-child(1)")
        return pgs.innerText
    })

    return pages
   
}catch (error) {
    console.error('Error in TT_count:', error);
}  finally{
    await browser.close();
}
}

//{page, data}
export const YSMBWC_main = async ({page, data})=>{
    const {url,database} = data
    FastLoad(page);
    await page.goto(url,{waitUntil:'networkidle0'})
    await scrollToBottom(page);
    const Info = await yahooscrabforYC(page);
    for (let i=0; i<Info.length; i++){
        await checkDB(database,Info[i],"永生名錶",Info[i][3])
    }
    await page.close();

    }


