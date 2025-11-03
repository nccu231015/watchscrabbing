import puppeteerCore from "puppeteer-core";
import { checkDB } from "./Hook/CheckDB.js";
import { FastLoad } from "./Hook/FastLoad.js";
import Chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer";

// IPv6 管理
import ipv6Manager from "./ipv6-proxy-manager.js";
import systemManager from "./ipv6-system-manager.js";
export const PW_url = (pg)=>{ return `http://www.playwatch.com.tw/index.asp?index=${pg}`}

export const PW_count = async () => {
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
    const page = await browser.newPage();
    await page.goto('http://www.playwatch.com.tw/')
    
    const pg = await page.evaluate(()=>{
        const _p = document.querySelector('body > div.main_bk > div > table > tbody > tr:nth-child(2) > td > div > table > tbody > tr > td > div > table > tbody > tr > td > table > tbody > tr > td:nth-child(3) > span > a:nth-last-child(1)')
        return _p.innerText
    })
    return pg
   
}catch (error) {
    console.error('Error in TT_count:', error);
} finally{
    await browser.close();
}
}


export const PW_main = async ({page, data})=>{
    // const browser = await puppeteer.launch({headless:false})
    // const page = await browser.newPage()
    const {url,database} = data
    
    // 為這個任務分配一個唯一的 IPv6 地址
    const ipv6 = ipv6Manager.getIpv6ForSite('PW', url);
    await systemManager.addIpv6Address(ipv6);
    console.log(`🌐 [PW] 使用 IPv6: ${ipv6} 爬取: ${url}`);
    
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
                const link = "http://www.playwatch.com.tw/"+articles[i].querySelector('table > tbody > tr:nth-child(3) a').getAttribute('href')
                const situation = _situation[0] != undefined? _situation[0].innerText:""
                const price = parseInt(_price[0].innerText.replace(/[^0-9]/g, ''), 10);
                const number = _number[0] != undefined? _number[0].innerText:""
                info.push([name[0].innerText+situation+number,price,cleanedImage,link])
            }
        }
        return [info,info.length]
    })
    
    for (let i=0; i<Information[1]; i++){

        checkDB(database,Information[0][i],"玩錶舍",Information[0][i][3])
      
      
}
await page.close();
}
