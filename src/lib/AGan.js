import puppeteer from "puppeteer";
import { scrollToBottom } from "./Hook/ScrollToBottom.js";
import { yahooscrab } from "./Hook/yahooScrabbing.js";
import { checkDB } from "./Hook/CheckDB.js";
import { FastLoad } from "./Hook/FastLoad.js";
import createBrowser from "./Hook/Browser.js";


export const url_AG = (pg)=>{
    return `https://tw.bid.yahoo.com/booth/Y9321626809?pg=${pg+1}`
}

export const AG_count = async ()=>{
    try{
    const browser = await createBrowser();
    const page = await browser.newPage()
    await page.goto(url_AG(1),{waitUntil:'networkidle0'});
   
    const pages = await page.evaluate(()=>{
        const pgs = document.querySelector("div.sc-16fedlx-0 > div > :nth-last-child(1)")
        return pgs.innerText
    })
    return pages
    console.log("AGan 頁面總數爬取完畢")
    await browser.close()
}catch(error){
    console.log("當爬取 AGan 頁面時出錯")
}

}

export const AGan_main = async ({page, data})=>{

    // const browser = await puppeteer.launch({headless:false})
    // const page = await browser.newPage()
    // const url = url_AG(1);
    const {url,database} = data
    FastLoad(page);
    await page.goto(url,{waitUntil:'networkidle0'})
    await scrollToBottom(page);
    await page.waitForSelector('div.sc-1drl28c-4.njFQL > span')
    const Info = await yahooscrab(page);
    for (let i=0; i<Info.length; i++){
        await checkDB(database,Info[i],"阿甘精品",url)
    }
}