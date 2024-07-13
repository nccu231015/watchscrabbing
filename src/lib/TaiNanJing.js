
import puppeteerCore from "puppeteer-core";
import { scrollToBottom } from "./Hook/ScrollToBottom.js"
import { FastLoad } from "./Hook/FastLoad.js"
import { yahooscrab } from "./Hook/yahooScrabbing.js"
import { checkDB } from "./Hook/CheckDB.js"
import Chromium from "@sparticuz/chromium";

export const url_TNJ = (pg)=>{
    return `https://tw.bid.yahoo.com/booth/Y8401229000?pg=${pg+1}`
}


export const TNJ_count = async ()=>{
    try{
        browser = await puppeteerCore.launch({
            args: Chromium.args,
            defaultViewport: Chromium.defaultViewport,
            executablePath: await Chromium.executablePath(CHROMIUM_PATH),
            headless: Chromium.headless,
        });
    const page = await browser.newPage()
    await page.goto(url_TNJ(1),{waitUntil:'networkidle0'});
   
    const pages = await page.evaluate(()=>{
        const pgs = document.querySelector("div.sc-16fedlx-0.gZkaGA.sc-5ehcvq-5.fpEedn > div > a:nth-last-child(1)")
        return pgs.innerText
    })

    return pages
}catch (error) {
    console.error('Error in TT_count:', error);
} finally {
    if (browser) {
        await browser.close();
    }
}
}


 export const TNJ_main = async ({page, data})=>{

    // const browser = await puppeteer.launch({headless:false})
    // const page = await browser.newPage()
    const {url,database} = data
    FastLoad(page)
    await page.goto(url,{waitUntil:'networkidle0'})
       await scrollToBottom(page);
       await page.waitForSelector('div.sc-1drl28c-4.njFQL > span')
        
      const Info = yahooscrab(page);

        for (let i=0; i<Info.length; i++){

            checkDB(database,Info[i],"台南仁德仁川精品",url) 
          
        }


    }


