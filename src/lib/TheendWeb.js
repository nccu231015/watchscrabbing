import puppeteerCore from "puppeteer-core";
import { checkDB } from "./Hook/CheckDB.js";
import { FastLoad } from "./Hook/FastLoad.js";
import Chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer";


export const TEW_url = (pg)=> {return `https://www.hourstack.com.tw/index.asp?index=${pg}`}

export const TEW_count = async () => {
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
    await page.goto('https://www.hourstack.com.tw/')
    
    const pg = await page.evaluate(()=>{
       
        const _p = document.querySelector('body > div.main > table > tbody > tr > td:nth-child(2) > div > div:nth-child(3) > table > tbody > tr > td > div > table > tbody > tr > td > table > tbody > tr > td:nth-child(3) > span > a:nth-last-child(1)')
        return _p.innerText
    })
    return pg
   
}catch (error) {
    console.error('Error in TT_count:', error);
}  finally{
    browser.close();
}
}


export const TEW_main = async ({page, data})=>{
    // const browser = await puppeteer.launch({headless:false})
    // const page = await browser.newPage()
    const {url,database} = data

    FastLoad(page);

    await page.goto('https://www.hourstack.com.tw/');
    await page.goto(url);
    
    const  Information = await page.evaluate(()=>{

        info = []

        const articles =  document.querySelectorAll('body > div.main > table > tbody > tr > td:nth-child(2) > div > div:nth-child(3) > table > tbody > tr > td > table > tbody > tr > td')
        for (let i=0 ; i<articles.length ; i++){
            let stores = ""
            const name = articles[i].querySelectorAll('table > tbody > tr:nth-child(3)')
            const _price = articles[i].querySelectorAll('table > tbody > tr:nth-child(5)')
            const _images = articles[i].querySelectorAll('table > tbody > tr > td > div > a:nth-child(2) > img')
            
            let situation = articles[i].querySelectorAll('table > tbody > tr:nth-child(6)')
            let _link = articles[i].querySelector('table > tbody > tr > td > div > a:nth-child(2)')
            
            if(_link){
                let link = "https://www.hourstack.com.tw/"+_link.getAttribute('href')
                let stores_text = stores[0] != undefined?stores[0].innerText:""
                let situation_text = situation[0] != undefined?situation[0].innerText:""
                
                const images = "https://www.hourstack.com.tw/"+_images[0].getAttribute('src')
                const price = parseInt(_price[0].innerText.replace(/[^0-9]/g, ''), 10);
                info.push([name[0].innerText+situation_text,price,images,stores_text,link])
            }
        }
        return [info,info.length]
    })
    console.log(Information[0])
    
    for (let i=0; i<Information[1]; i++){
        const [name,price,photo,shop,link] = Information[0][i]
        checkDB(database,Information[0][i],`鐘點站名錶`,Information[0][i][4])
}
await page.close();
}
