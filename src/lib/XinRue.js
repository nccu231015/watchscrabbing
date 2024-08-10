
import puppeteerCore from "puppeteer-core";
import { scrollToBottom } from "./Hook/ScrollToBottom.js"
import { yahooscrab } from "./Hook/yahooScrabbing.js"
import { checkDB } from "./Hook/CheckDB.js"
import { FastLoad } from "./Hook/FastLoad.js"
import Chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer";

// const url = "https://tw.bid.yahoo.com/booth/Y0921170303"

export const url_XR = (pg)=>{
    return `https://tw.bid.yahoo.com/booth/Y0921170303?pg=${pg+1}`
}

export const XR_count = async ()=>{
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
        browser= await puppeteer.launch();
    const page = await browser.newPage()
    await page.goto(url_XR(1),{waitUntil:'networkidle0'});
   
    const pages = await page.evaluate(()=>{
        const pgs = document.querySelector("div.sc-16fedlx-0 > div > :nth-last-child(1)")
        return pgs.innerText
    })
    return pages
  
}catch (error) {
    console.error('Error in TT_count:', error);
}  finally {
    await browser.close();
}
}




export const XinRue_main = async ({page, data})=>{

    const {url,database} = data
    FastLoad(page);
    await page.goto(url,{waitUntil:'networkidle0'})


       


       await scrollToBottom(page);
       await page.waitForSelector('div.sc-1drl28c-4 > span')
        const Info = yahooscrab(page);

        for (let i=0; i<Info.length; i++){
            checkDB(database,Info[i],"鑫瑞名錶精品",url);
        }
        await page.close();

    }

