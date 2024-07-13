
import puppeteerCore from "puppeteer-core";
import { FastLoad } from "./Hook/FastLoad.js"
import { checkDB } from "./Hook/CheckDB.js";
import Chromium from "@sparticuz/chromium";

export const TT_url = (pg) => { return `https://ttwatches.com/products.php?&page=${pg}` }

export const TT_count = async () => {
    const CHROMIUM_PATH =
  "https://vomrghiulbmrfvmhlflk.supabase.co/storage/v1/object/public/chromium-pack/chromium-v123.0.0-pack.tar";
    let browser;
    try {
        browser = await puppeteerCore.launch({
            args: Chromium.args,
            defaultViewport: Chromium.defaultViewport,
            executablePath: await Chromium.executablePath(CHROMIUM_PATH),
            headless: Chromium.headless,
        });
        const page = await browser.newPage();
        FastLoad(page);
        await page.goto("https://ttwatches.com/products.php");
        const pages = await page.evaluate(() => {
            const pg = document.querySelector('#boxWidth > div.pagenums > select > option:nth-last-child(1)');
            return pg.innerText;
        });
        return pages;
    } catch (error) {
        console.error('Error in TT_count:', error);
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}



export const TT_main = async ({page, data})=>{
    const {url,database} = data
    FastLoad(page);
    await page.goto(url,{waitUntil:'networkidle0'})

    const wachtes = await page.evaluate(()=>{
        return document.querySelectorAll('.oneProBox').length
    })
    
    for (let i=0 ; i<wachtes ; i++){
        
        while(await page.url()==url){
            await page.click(`#boxWidth > div.proBox > div:nth-child(${i+2})`);
        }
       await page.waitForSelector('#boxWidth > div.prodedata > div.datatxts > h1 > a')
       
        const Info = await page.evaluate(()=>{
            const name_Chn = document.querySelector('#boxWidth > div.prodedata > div.datatxts > h1 > a')|| false
            const name = document.querySelector('#boxWidth > div.prodedata > div.datatxts > div:nth-child(3) > span.txts')|| false
            const series_name = document.querySelector('#boxWidth > div.prodedata > div.datatxts > div:nth-child(3) > span.txts')|| false
            const material = document.querySelector('#boxWidth > div.prodedata > div.datatxts > div:nth-child(6) > span.txts')|| false
            const status = document.querySelector('#boxWidth > div.prodedata > div.datatxts > div:nth-child(17) > span.txts')|| false
            const core = document.querySelector('#boxWidth > div.prodedata > div.datatxts > div:nth-child(9) > span.txts')|| false
            const box_placeholder = document.querySelector('#boxWidth > div.prodedata > div.datatxts > div:nth-child(15) > span.txts')|| false
            const insurance_placeholder = document.querySelector('#boxWidth > div.prodedata > div.datatxts > div:nth-child(14) > span.txts')|| false
            const insurance = insurance_placeholder=="無"?"":`保險:${insurance_placeholder.innerText}`
            const box = box_placeholder=="無"?"":"有附盒"
            const sereis_number = document.querySelector('#boxWidth > div.prodedata > div.datatxts > div:nth-child(4) > span.txts')
            
            var _price = document.querySelector('#boxWidth > div.prodedata > div.datatxts > div:nth-last-child(2) > span.txts')|| false
            var price = parseInt(_price.innerText.replace(/[^0-9]/g, ''), 10)
            
            if(price<200){
                _price = document.querySelector('#boxWidth > div.prodedata > div.datatxts > div:nth-last-child(1) > span.txts')|| false
                price = parseInt(_price.innerText.replace(/[^0-9]/g, ''), 10)
            }

            const img_comp = document.querySelector('#boxWidth > div.prodedata > div.imgboxs > div')
            const images = window.getComputedStyle(img_comp).backgroundImage
            let cleanedImage = images.replace(/^url\(["']?/, '').replace(/["']?\)$/, '');

            return ([`${name_Chn?name_Chn.innerText:""} ${series_name?series_name.innerText:""} ${sereis_number?sereis_number.innerText:""} ${material?material.innerText:""} ${box} ${insurance} `,price, cleanedImage])
        })
    
        checkDB(database,Info,"TTWatches 台北腕錶",url)

        await page.goto(url,{waitUntil:'domcontentloaded'});
        

    }    
}
