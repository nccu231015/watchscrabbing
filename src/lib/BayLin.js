import puppeteerCore from "puppeteer-core";
import { scrollToBottom } from "./Hook/ScrollToBottom.js";
import { yahooscrab } from "./Hook/yahooScrabbing.js";
import { checkDB } from "./Hook/CheckDB.js";
import { FastLoad } from "./Hook/FastLoad.js";
import Chromium from "@sparticuz/chromium";


export const url_BL = (pg)=>{
    return `https://tw.bid.yahoo.com/booth/Y0796619069?guccounter=1&pg=${pg+1}`
}

export const BL_count = async ()=>{
    const CHROMIUM_PATH =
    "https://vomrghiulbmrfvmhlflk.supabase.co/storage/v1/object/public/chromium-pack/chromium-v123.0.0-pack.tar";
      let browser;
      try{
        browser = await puppeteerCore.launch({
            args: Chromium.args,
            defaultViewport: Chromium.defaultViewport,
            executablePath: await Chromium.executablePath(CHROMIUM_PATH),
            headless: Chromium.headless,
        });
        const page = await browser.newPage()
        await page.goto(url_BL(1),{waitUntil:'networkidle0'});
    
        const pages = await page.evaluate(()=>{
            const pgs = document.querySelector("div.sc-16fedlx-0 > div > :nth-last-child(1)")
            return pgs.innerText
        })

        return pages
    }   catch (error) {
        console.error('Error in BayLin_count:', error);
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

export const BayLin_main = async ({page, data})=>{

    // const browser = await puppeteer.launch({headless:false})
    // const page = await browser.newPage()
    const {url,database} = data
    FastLoad(page);
    await page.goto(url,{waitUntil:'networkidle0'})


       

       await scrollToBottom(page);
       await page.waitForSelector('div.sc-1drl28c-4.njFQL > span')
        const Info = yahooscrab(page);

        for (let i=0; i<Info.length; i++){
            checkDB(database,Info[i],"北林精品當鋪",url)
        }
    }


