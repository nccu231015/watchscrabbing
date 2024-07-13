import mongoose from "mongoose";
import puppeteerCore from "puppeteer-core";
import { watchesss } from "./Database/database.js";
import { FastLoad } from "./Hook/FastLoad.js";
import moment from "moment";
import { checkDB } from "./Hook/CheckDB.js";

export const url_HS = (pg) => {
    return `https://www.goodtimezone.com.tw/index.asp?index=${pg}`;
};

export const HS_count = async () => {
    const CHROMIUM_PATH =
    "https://vomrghiulbmrfvmhlflk.supabase.co/storage/v1/object/public/chromium-pack/chromium-v123.0.0-pack.tar";
      let browser;
      try{
        browser = await puppeteerCore.launch({
            args: Chromium.args,
            defaultViewport: Chromium.defaultViewport,
            executablePath: await Chromium.executablePath(CHROMIUM_PATH),
            headless: Chromium.headless,
        });
    const page = await browser.newPage();
    await page.goto("https://www.goodtimezone.com.tw/", { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('#content > div.prodmain > div.prodleft.fr > div.pordpage > span:nth-child(20)');
    const l_pages = await page.evaluate(() => {
        const _pg = document.querySelector('#content > div.prodmain > div.prodleft.fr > div.pordpage > span:nth-child(20)');
        return _pg.innerText;
    });
    return l_pages;
}catch (error) {
    console.error('Error in HanshiJI_count:', error);
} finally {
    if (browser) {
        await browser.close();
    }
}
};

export const HS_Main = async ({ page, data }) => {
    const { url, database } = data;

    FastLoad(page);
    await page.goto(`https://www.goodtimezone.com.tw/`);
    await page.goto(url);

    // await page.waitForSelector('#content > div.prodmain > div.prodleft.fr > div.prodlist > table > tbody > tr > td')
    // const articles = await page.$$('#content > div.prodmain > div.prodleft.fr > div.prodlist > table > tbody > tr > td');
    const articles = await page.evaluate(()=>{
        const location = document.querySelectorAll('#content > div.prodmain > div.prodleft.fr > div.prodlist > table > tbody > tr > td')
        return [location,location.length]
    })

    console.log(articles)
    for (let i = 0; i < articles[1]; i++) {
        
        let row = Math.floor(i / 3) + 1; // Row starts at 1
        let column = (i % 3) + 1; 
    
        const homepage = await page.evaluate(({row,column})=>{
            
            const element = document.querySelector(`#content > div.prodmain > div.prodleft.fr > div.prodlist > table > tbody > tr:nth-child(${row}) > td:nth-child(${column})`)
            const watchsereis  = element.querySelector("table > tbody > tr:nth-child(4) > td").innerText
            const _price = element.querySelector("table > tbody > tr:nth-child(5) > td > span")
            const price = parseInt(_price.innerText.replace(/[^0-9]/g, ''), 10);
            return [watchsereis,price]
        },{row,column})

        const [watchsereis,price] = homepage
        const exists = await database.exists({watchsereis:watchsereis})
        const watch = await database.where("watchsereis").equals(watchsereis)
        if (exists){
            const lastUpdatedAt = moment(watch[0].latestUpdate);
            const now = moment();
            const difference = now.diff(lastUpdatedAt, 'minutes');
            
            if(watch.length==1 && difference >= 20){
                if(watch[0].prices[watch[0].prices.length-1].price == price && difference >= 3){
                    watch[0].latestUpdate = moment();
                    await watch[0].save();
                    continue
                }else {
                    console.log(`${watchsereis} already in the database, update prices`)
                    await watch[0].prices.push({price:price})
                    
                    watch[0].latestUpdate = moment();
                    await watch[0].save();
                    continue
            }
        }
        }


        while (page.url() === url) {
            await page.click(`#content > div.prodmain > div.prodleft.fr > div.prodlist > table > tbody > tr:nth-child(${row}) > td:nth-child(${column})`, { waitUntil: 'domcontentloaded' });
        }

        const situation = await page.evaluate(() => {
            const photo = document.querySelector("#photo1").getAttribute("src")
            const name = document.querySelector("#content > div.prodmain > div.prodleft.fr > div > table > tbody > tr > td > table:nth-child(3) > tbody > tr:nth-child(1) > td").innerText
            const _price = document.querySelector("#content > div.prodmain > div.prodleft.fr > div > table > tbody > tr > td > table:nth-child(3) > tbody > tr:nth-child(3) > td.a_txt_7 > span")
            const price = parseInt(_price.innerText.replace(/[^0-9]/g, ''), 10);
            const _sereis = document.querySelector("#content > div.prodmain > div.prodleft.fr > div > table > tbody > tr > td > table:nth-child(3) > tbody > tr:nth-child(2) > td.a_txt_7");
            const _s = document.querySelector('#content > div.prodmain > div.prodleft.fr > div > table > tbody > tr > td > table:nth-child(3) > tbody > tr:nth-child(5) > td.a_txt_7');
            const sereis = _sereis ? _sereis.innerText : "";
            const s = _s ? _s.innerText : "";
            return [photo,name,sereis, s];
        });

        console.log("ready to add")
        const [photo,name,sereis,s] = situation
        const full_name = `${name} ${s} ${sereis}`;
       
        const _exists = await database.exists({name:full_name})
        const _watch = await database.where("name").equals(full_name)
        if (_exists){
            if(_watch[0].prices[_watch[0].prices.length-1].price == price){
                _watch[0].latestUpdate = moment()
                await _watch[0].save();
            } else{
                console.log(`${name} in "好時計鐘錶" already in the database, update prices`)
                _watch[0].latestUpdate = moment()
                await _watch[0].prices.push({price:price})
                await _watch[0].save()
            }
        } else{
            await database.create({
                name: full_name,
                prices: [{
                    price: price
                }],
                stores: "好時計鐘錶",
                photos: "https://www.goodtimezone.com.tw/"+photo,
                webp: url,
                watchsereis: watchsereis
            })
            await console.log(`${name} in "好時計鐘錶" added sucessfully`);
        }
            
            await page.goto(url, { waitUntil: 'domcontentloaded' });
        }
   
};
