import puppeteer from "puppeteer"
import { scrollToBottom } from "./Hook/ScrollToBottom.js"
import { yahooscrab } from "./Hook/yahooScrabbing.js"
import { checkDB } from "./Hook/CheckDB.js"
import { FastLoad } from "./Hook/FastLoad.js"



export const url_MBW = (pg)=>{
    return `https://tw.bid.yahoo.com/booth/Y5182163893?pg=${pg+1}`
}


export const MBW_count = async ()=>{
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.goto(url_MBW(1),{waitUntil:'networkidle0'});
   
    const pages = await page.evaluate(()=>{
        const pgs = document.querySelector("div.sc-16fedlx-0.gZkaGA.sc-5ehcvq-5.fpEedn > div > a:nth-last-child(1)")
        return pgs.innerText
    })

    return pages
    await browser.close()
}

//{page, data}
export const MBW_main = async ({page, data})=>{

    // const browser = await puppeteer.launch({headless:false})
    // const page = await browser.newPage()
    const {url,database} = data
    FastLoad(page);
    await page.goto(url,{waitUntil:'networkidle0'})

       


       await scrollToBottom(page);
       await page.waitForSelector('div.sc-1drl28c-4.njFQL > span')
        
      const Info = yahooscrab(page);

        for (let i=0; i<Info.length; i++){
            checkDB(database,Info[i],"名錶窩Yahoo",url) 
        }


    }

