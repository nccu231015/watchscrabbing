import puppeteerCore from "puppeteer-core";
import { scrollToBottom } from "./Hook/ScrollToBottom.js"
import { yahooscrab } from "./Hook/yahooScrabbing.js"
import { checkDB } from "./Hook/CheckDB.js"
import { FastLoad } from "./Hook/FastLoad.js"
import Chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer";


export const url_AJ = (pg)=>{
    return `https://tw.bid.yahoo.com/tw/booth/Y5182163893?pg=${pg+1}`
}


export const AJ_count = async ()=>{
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
    await page.goto(url_AJ(1),{waitUntil:'networkidle0'});
    const pages = await page.evaluate(()=>{
        const pgs = document.querySelector("div.sc-16fedlx-0 > div > :nth-last-child(1)")
        return pgs.innerText
    })

    return pages
   
}catch (error) {
    console.error('Error in AJLuxury_count:', error);
}  finally{
    await browser.close();
}
}

//{page, data}
export const AJ_main = async ({page, data})=>{
    const {url,database} = data
    FastLoad(page);
    await page.goto(url,{waitUntil:'networkidle0'})
    await scrollToBottom(page);
    const Info = await yahooscrab(page);
    for (let i=0; i<Info.length; i++){
        await checkDB(database,Info[i],"AJ Luxury",Info[i][3])
    }
    await page.close();

    }


