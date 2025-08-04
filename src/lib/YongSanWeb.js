import puppeteerCore from "puppeteer-core";
import { checkDB } from "./Hook/CheckDB.js";
import { FastLoad } from "./Hook/FastLoad.js";
import Chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer";


export const YSW_url = (pg)=> {return `https://www.egps.com.tw/index.asp?index=${pg}`}

export const YSW_count = async () => {
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
        browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setRequestInterception(true);
    page.on('request', (request) => {
        if (['stylesheet', 'image', 'font'].includes(request.resourceType())) {
            request.abort();
        } else {
            request.continue();
        }
    });
    await page.goto('https://www.egps.com.tw/')
    
    const pg = await page.evaluate(()=>{
       
        const _p = document.querySelector(' body > table:nth-child(1) > tbody > tr > td:nth-child(1) > table:nth-child(6) > tbody > tr > td:nth-child(2) > table:nth-child(5) > tbody > tr > td > table:nth-child(4) > tbody > tr > td > table > tbody > tr > td:nth-child(3) > a:nth-last-child(1)')
        return _p.innerText
    })
    return pg
   
}catch (error) {
    console.error('Error in TT_count:', error);
}  finally{
    browser.close();
}
}


export const YSW_main = async ({page, data})=>{
    // const browser = await puppeteer.launch({headless:false})
    // const page = await browser.newPage()
    const {url,database} = data

    FastLoad(page);

    await page.goto('https://www.egps.com.tw/');
    await page.goto(url);
    
    const  Information = await page.evaluate(()=>{

        info = []
        
        const articles =  document.querySelectorAll('body > table:nth-child(1) > tbody > tr > td:nth-child(1) > table:nth-child(6) > tbody > tr > td:nth-child(2) > table:nth-child(5) > tbody > tr > td > table:nth-child(2) > tbody > tr> td')

        for (let i=0 ; i<articles.length ; i++){
            let stores = articles[i].querySelectorAll('table > tbody > tr:nth-child(2) span:nth-child(1)')
            const name = articles[i].querySelectorAll('table > tbody > tr:nth-child(3)')
            const _price = articles[i].querySelectorAll('table > tbody > tr:nth-child(5)')
            const _images = articles[i].querySelectorAll('.a_photo_photos img')
            
            let situation = articles[i].querySelectorAll('table > tbody > tr:nth-child(6)')
            let _link = articles[i].querySelector('.a_photo_photos')
            
            if(_link){
                let link = "https://www.egps.com.tw/"+_link.getAttribute('href')
                let stores_text = stores[0] != undefined?stores[0].innerText:""
                let situation_text = situation[0] != undefined?situation[0].innerText:""
                
                const images = "https://www.egps.com.tw/"+_images[0].getAttribute('src')
                const price = parseInt(_price[0].innerText.replace(/[^0-9]/g, ''), 10);
                info.push([name[0].innerText+situation_text,price,images,stores_text,link])
            }
        }
        return [info,info.length]
    })
    console.log(Information[0])
    
    for (let i=0; i<Information[1]; i++){
        const [name,price,photo,shop,link] = Information[0][i]
        checkDB(database,Information[0][i],`永生名錶`,Information[0][i][4])
}
await page.close();
}
