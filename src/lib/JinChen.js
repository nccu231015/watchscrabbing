import puppeteerCore from "puppeteer-core";
import { checkDB } from "./Hook/CheckDB.js";
export const JC_url = (pg) =>{ return `https://www.369rolexwatch.com/index.asp?index=${pg}`}
import { FastLoad } from "./Hook/FastLoad.js";
import Chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer";

export const JC_count = async() => {
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
    await page.goto('https://www.369rolexwatch.com/')
    
    const pg = await page.evaluate(()=>{
        const _p = document.querySelector('body > div.main_bk > div > table > tbody > tr:nth-child(2) > td > div > table > tbody > tr > td > div > table > tbody > tr > td > table > tbody > tr > td:nth-child(3) > span > a:nth-last-child(1)')
        return _p.innerText
    })
    return pg
    
} catch (error) {
    console.error('Error in TT_count:', error);
}  finally{
    await browser.close();
}
}


export const JC_main = async ({page,data})=>{


    const {url,database} = data
    FastLoad(page);
    await page.goto('https://www.369rolexwatch.com/')
    await page.goto(url)
    
    const  Information = await page.evaluate(()=>{
        
        info = []
        const articles =  document.querySelectorAll('body > div.main_bk > div > table > tbody > tr:nth-child(2) > td > div > table > tbody > tr > td > table > tbody > tr > td')
        const _images= document.querySelectorAll('body > div.main_bk > div > table > tbody > tr:nth-child(2) > td > div > table > tbody > tr > td > table > tbody > tr > td table > tbody > tr:nth-child(1) > td > table > tbody > tr > td > table > tbody > tr > td > table')
        for (let i=0 ; i<articles.length ; i++){
            if(articles[i].innerText==null){
                continue
            }

            const name = articles[i].querySelectorAll('table  tbody  tr:nth-child(3)')
            const images = window.getComputedStyle(_images[info.length]).backgroundImage
            let cleanedImage = images.replace(/^url\(["']?/, '').replace(/["']?\)$/, '');
            const _price = articles[i].querySelectorAll('table  tbody  tr:nth-child(5)')
            
            const situation = articles[i].querySelectorAll('table  tbody tr:nth-child(6)')
            if(name[0]){
                const link = 'https://www.369rolexwatch.com/'+articles[i].querySelector('table  tbody  tr:nth-child(3) a').getAttribute('href')
                const price = parseInt(_price[0].innerText.replace(/[^0-9]/g, ''), 10);
                info.push([name[0].innerText+situation[0].innerText,price,cleanedImage,link])
            }
        }
        return [info,info.length]
    })
    // console.log(Information[0])
        

        for (let i=0; i<Information[1]; i++){

            checkDB(database,Information[0][i],"金宸名表",Information[0][i][3])
    }
    await page.close();
    
}

