import puppeteer from "puppeteer-core";
import { checkDB } from "./Hook/CheckDB.js";
import { FastLoad } from "./Hook/FastLoad.js";
import createBrowser from "./Hook/Browser.js";

export const PW_url = (pg)=>{ return `http://www.playwatch.com.tw/index.asp?index=${pg}`}

export const PW_count = async () => {
    const browser = await createBrowser();
    const page = await browser.newPage();
    await page.goto('http://www.playwatch.com.tw/')
    
    const pg = await page.evaluate(()=>{
        const _p = document.querySelector('body > div.main_bk > div > table > tbody > tr:nth-child(2) > td > div > table > tbody > tr > td > div > table > tbody > tr > td > table > tbody > tr > td:nth-child(3) > span > a:nth-last-child(1)')
        return _p.innerText
    })
    return pg
    await browser.close()
}


export const PW_main = async ({page, data})=>{
    // const browser = await puppeteer.launch({headless:false})
    // const page = await browser.newPage()
    const {url,database} = data
    FastLoad(page);
    await page.goto('http://www.playwatch.com.tw/')
    await page.goto(url)
    
    const  Information = await page.evaluate(()=>{

        info = []
        
        const articles =  document.querySelectorAll('body > div.main_bk > div > table > tbody > tr:nth-child(2) > td > div > table > tbody > tr > td > table > tbody > tr > td')
        const _images= document.querySelectorAll('body > div.main_bk > div > table > tbody > tr:nth-child(2) > td > div > table > tbody > tr > td > table > tbody > tr > td table > tbody > tr:nth-child(1) > td > table > tbody > tr > td > table > tbody > tr > td > table')
        for (let i=0 ; i<articles.length ; i++){
            if(articles[i].innerText==null){
                continue
            }
            const name = articles[i].querySelectorAll('table > tbody > tr:nth-child(3)')
            const _price = articles[i].querySelectorAll('table > tbody > tr:nth-child(5)')
            const images = window.getComputedStyle(_images[info.length]).backgroundImage
            let cleanedImage = images.replace(/^url\(["']?/, '').replace(/["']?\)$/, '');
            const _situation = articles[i].querySelectorAll('table > tbody > tr:nth-child(6)')
            const _number = articles[i].querySelectorAll('table > tbody > tr:nth-child(4)')
            if(name[0]){
                const situation = _situation[0] != undefined? _situation[0].innerText:""
                const price = parseInt(_price[0].innerText.replace(/[^0-9]/g, ''), 10);
                const number = _number[0] != undefined? _number[0].innerText:""
                info.push([name[0].innerText+situation+number,price,cleanedImage])
            }
        }
        return [info,info.length]
    })
    
    for (let i=0; i<Information[1]; i++){

        checkDB(database,Information[0][i],"玩錶舍",url)
      
      
}
}
