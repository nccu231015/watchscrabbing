import puppeteerCore from "puppeteer-core";
import { checkDB } from "./Hook/CheckDB.js";
import { FastLoad } from "./Hook/FastLoad.js";
import Chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer";

// IPv6 管理
import ipv6Manager from "./ipv6-proxy-manager.js";
import systemManager from "./ipv6-system-manager.js";

export const HSe_url = (pg)=>{
    return `https://www.999watch.com/index.asp?index=${pg}`
}


export const HSe_count = async () =>{
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
    await page.goto('https://www.999watch.com/')
    await page.goto(HSe_url(1), { waitUntil: 'domcontentloaded' })
    
    const pg = await page.evaluate(()=>{
        const _p = document.querySelector('body > div:nth-child(2) > table:nth-child(5) > tbody > tr > td:nth-child(2) > table > tbody > tr > td > table:nth-child(3) > tbody > tr > td > table > tbody > tr > td:nth-child(3) > a:nth-last-child(1)')
        return _p.innerText
    })
    return pg
    
}catch (error) {
    console.error('Error in TT_count:', error);
} finally{
    await browser.close();
}
}

HSe_count().then(value=>{
    console.log(value)
})



export const HSe_main = async ({page,data})=>{
    // const browser = await puppeteer.launch({headless:false})
    // const page = await browser.newPage()
    const {url,database} = data
    
    // 為這個任務分配一個唯一的 IPv6 地址
    const ipv6 = ipv6Manager.getIpv6ForSite('HSe', url);
    await systemManager.addIpv6Address(ipv6);
    console.log(`🌐 [HSe] 使用 IPv6: ${ipv6} 爬取: ${url}`);
    
    FastLoad(page)
    await page.goto('https://www.999watch.com/')
    await page.goto(url)
    
    const  Information = await page.evaluate(()=>{

        info = []
        const articles =  document.querySelectorAll('body > div:nth-child(2) > table:nth-child(5) > tbody > tr > td:nth-child(2) > table > tbody > tr > td > table:nth-child(1) > tbody > tr > td')
        const _images= document.querySelectorAll('body > div:nth-child(2) > table:nth-child(5) > tbody > tr > td:nth-child(2) > table > tbody > tr > td > table:nth-child(1) > tbody > tr > td table > tbody > tr:nth-child(1) > td > table > tbody > tr > td > table > tbody > tr > td > table ')
        for (let i=0 ; i<articles.length ; i++){
            if(articles[i].innerText==null){
                continue
            }
            
            const name = articles[i].querySelector('table > tbody > tr:nth-child(3)')
            const images = window.getComputedStyle(_images[info.length]).backgroundImage
            let cleanedImage = images.replace(/^url\(["']?/, '').replace(/["']?\)$/, '');
            const _price = articles[i].querySelector('table > tbody > tr:nth-child(5)')
            const situation = articles[i].querySelector('table > tbody > tr:nth-child(6)')
            if(name){
                const link = 'https://www.999watch.com/'+articles[i].querySelector('table > tbody > tr:nth-child(3) a').getAttribute('href')
                const price = parseInt(_price.innerText.replace(/[^0-9]/g, ''), 10);
                info.push([name.innerText+situation.innerText,price,cleanedImage,link])
            }
        }
        return [info,info.length]
    })

    // console.log(Information)
    for (let i=0; i<Information[1]; i++){
        checkDB(database,Information[0][i],"鴻昇名表",Information[0][i][3]) 
    }
    await page.close();
    
    
}
