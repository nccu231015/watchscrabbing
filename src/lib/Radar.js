import puppeteer from "puppeteer"
import { checkDB } from "./Hook/CheckDB.js";
import { FastLoad } from "./Hook/FastLoad.js";



export const RD_url = (pg)=> {return `https://www.rdwatch.com.tw/index.asp?index=${pg}`}

export const RD_count = async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setRequestInterception(true);
    page.on('request', (request) => {
        if (['stylesheet', 'image', 'font'].includes(request.resourceType())) {
            request.abort();
        } else {
            request.continue();
        }
    });
    await page.goto('https://www.rdwatch.com.tw/')
    
    const pg = await page.evaluate(()=>{
        const _p = document.querySelector('body > div:nth-child(4) > div > table > tbody > tr > td > div > div.main > div:nth-child(4) > table > tbody > tr > td > div > table > tbody > tr > td > table > tbody > tr > td:nth-child(3) > span > a:nth-last-child(1)')
        return _p.innerText
    })
    return pg
    await browser.close()
}


export const RD_main = async ({page, data})=>{
    // const browser = await puppeteer.launch({headless:false})
    // const page = await browser.newPage()
    const {url,database} = data

    FastLoad(page);

    await page.goto('https://www.rdwatch.com.tw/');
    await page.goto(url);
    
    const  Information = await page.evaluate(()=>{

        info = []
        const articles =  document.querySelectorAll('body > div:nth-child(4) > div > table > tbody > tr > td > div > div.main > div:nth-child(4) > table > tbody > tr > td > table > tbody > tr > td')
        
        
        for (let i=0 ; i<articles.length ; i++){
            let stores = articles[i].querySelectorAll('table > tbody > tr:nth-child(2)')
            const name = articles[i].querySelectorAll('table > tbody > tr:nth-child(3)')
            const _price = articles[i].querySelectorAll('table > tbody > tr:nth-child(5)')
            const _images = articles[i].querySelectorAll('div > table > tbody > tr:nth-child(1) > td > table > tbody > tr > td > table > tbody > tr > td > table > tbody > tr > td > div:nth-child(2) > a:nth-child(2) > img')
            
            let situation = articles[i].querySelectorAll('table > tbody > tr:nth-child(6)')
            let size = articles[i].querySelectorAll('table > tbody > tr:nth-child(7)')
            if(name[0]){
                let stores_text = stores[0] != undefined?stores[0].innerText:""
                let situation_text = situation[0] != undefined?situation[0].innerText:""
                let size_text = size[0] != undefined ?size[0].innerText:""
                
                const images = "https://www.rdwatch.com.tw/"+_images[0].getAttribute('src')
                const price = parseInt(_price[0].innerText.replace(/[^0-9]/g, ''), 10);
                info.push([name[0].innerText+situation_text+size_text,price,images,stores_text])
            }
        }
        return [info,info.length]
    })
    
    for (let i=0; i<Information[1]; i++){
        const [name,price,photo,shop] = Information[0][i]
        checkDB(database,Information[0][i],`名錶雷達站${shop}`,url)
}
}