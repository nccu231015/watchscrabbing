
import puppeteer, { PuppeteerError } from "puppeteer"
import { scrollToBottom } from "./Hook/ScrollToBottom.js"
import { yahooscrab } from "./Hook/yahooScrabbing.js"
import { checkDB } from "./Hook/CheckDB.js"
import { FastLoad } from "./Hook/FastLoad.js"
import createBrowser from "./Hook/Browser.js"
// const url = "https://tw.bid.yahoo.com/booth/Y0921170303"

export const url_XR = (pg)=>{
    return `https://tw.bid.yahoo.com/booth/Y0921170303?pg=${pg+1}`
}

export const XR_count = async ()=>{
    const browser = await createBrowser();
    const page = await browser.newPage()
    await page.goto(url_XR(1),{waitUntil:'networkidle0'});
   
    const pages = await page.evaluate(()=>{
        const pgs = document.querySelector("div.sc-16fedlx-0.gZkaGA.sc-5ehcvq-5.fpEedn > div > a:nth-last-child(1)")
        return pgs.innerText
    })

    return pages
    browser.close();
}




export const XinRue_main = async ({page, data})=>{

    const {url,database} = data
    FastLoad(page);
    await page.goto(url,{waitUntil:'networkidle0'})


       


       await scrollToBottom(page);
       await page.waitForSelector('div.sc-1drl28c-4.njFQL > span')
     const Info = yahooscrab(page);

        for (let i=0; i<Info.length; i++){
            checkDB(database,Info[i],"鑫瑞名錶精品",url);
        }


    }

