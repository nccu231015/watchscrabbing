import moment from 'moment'
import { watchesss } from './Database/database.js'
import { FastLoad } from './Hook/FastLoad.js'

import puppeteerCore from "puppeteer-core";
import Chromium from '@sparticuz/chromium';
import puppeteer from 'puppeteer'

export const url_emc2 = (pg)=>{
    return `https://www.emc2watches.com/product/index/is_featured2/1/page/${pg}.html`
}

export const emc2_count = async ()=>{
    // const CHROMIUM_PATH =
    // "https://vomrghiulbmrfvmhlflk.supabase.co/storage/v1/object/public/chromium-pack/chromium-v123.0.0-pack.tar";
    //   let browser;
      try{
        // browser = await puppeteerCore.launch({
        //     args: Chromium.args,
        //     defaultViewport: Chromium.defaultViewport,
        //     executablePath: await Chromium.executablePath(CHROMIUM_PATH),
        //     headless: Chromium.headless,
        // });
        const browser = await puppeteer.launch()
    const page = await browser.newPage()
    
    let  currentpages = 10
    let finalpages = false

    let setfinalpages = ()=>{
        finalpages=true
    }
    FastLoad(page)
    await page.goto(url_emc2(10), { waitUntil: 'domcontentloaded' });

    while(!finalpages){
            while (await page.url()!=url_emc2((currentpages))){
                await page.waitForSelector('#yw0')
                await page.click('#yw0 > li:nth-last-child(3)')
            }
            

            await page.waitForSelector('#yw0')
            const final = await page.evaluate(()=>{
                const final_pages_component = document.querySelector('#yw0 > li:nth-last-child(3).active')
                const final_pages_number = document.querySelector('#yw0 > li:nth-last-child(3)')
                return [final_pages_component,final_pages_number.innerText]
            })
            
            if(final[0] != null){
                setfinalpages()
            }else{
                currentpages = final[1]
  
            }
        }

    return currentpages
    await browser.close();
      } catch (error) {
        console.error('Error in emc2_count:', error);
    } 

}


//
export const emc2_main = async ({page,data}) => {
    // const url = "https://www.emc2watches.com/product/index/is_featured2/1.html"
    // const browser = await puppeteer.launch({headless:false})
    // const page = await browser.newPage()
    // const database = watch

    const {url,database} = data

     // ********* ******* //
    await page.goto(url, { waitUntil: 'domcontentloaded' });

        // check the home page

        // ********* ******* //
        const watches = await page.evaluate(() => {
            const _wacthCollection = [];
            const name_sn = document.querySelectorAll('.prod-name');
            const name_des = document.querySelectorAll('.prod-desc');
            const price = document.querySelectorAll('.prod-price');
            const photos = document.querySelectorAll('.prod-photo > img');
            for (let i = 0; i < name_sn.length; i++) {
                const name = name_sn[i].innerText + name_des[i].innerText;
                const photo_url = "https://www.emc2watches.com" + photos[i].getAttribute('src');
                const price_number = parseInt(price[i].innerText.replace(/[^0-9]/g, ''), 10);
                _wacthCollection.push([name, price_number, photo_url]);
            }
            return [_wacthCollection, name_sn.length];
        });

        //check if it's on the db

        //Section A
        
        for (let i=0; i<watches[1]; i++){
            try{
                const [watchsereis, price, photo] = watches[0][i]
                const exists = await database.exists({watchsereis:watchsereis})
                const watch = await database.where("watchsereis").equals(watchsereis)
                if (exists){
                    const lastUpdatedAt = moment(watch[0].latestUpdate);
                    const now = moment();
                    const difference = now.diff(lastUpdatedAt, 'minutes');
                    

                    if(watch.length==1 && difference >= 60){
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


                while(await page.url()==url){
                    await page.click(`body > div:nth-child(1) > div.prod-list.page-layout > div > div.row.page-list > div:nth-child(${i+1})`);
                }

                // 確保導航完成後再進行評估
                // await page.waitForNavigation({ waitUntil: 'domcontentloaded' });
                await page.waitForSelector('dd')

                const Info = await page.evaluate(()=>{
                    const series = document.querySelector('body > div:nth-child(1) > div.prod-detail > div > div:nth-child(2) > div:nth-child(2) > div > dl:nth-child(2) > dd') || false
                    const name_Eng = document.querySelector('body > div:nth-child(1) > div.prod-detail > div > div:nth-child(2) > div:nth-child(2) > div > h2') || false
                    // const name_Chn = document.querySelector('.is-ch')|| false
                    // const name = document.querySelector('.is-name')|| false
                    
                    const series_name = document.querySelector('body > div:nth-child(1) > div.prod-detail > div > div:nth-child(2) > div:nth-child(2) > div > dl:nth-child(3) > dd')|| false
                    const material = document.querySelector('body > div:nth-child(1) > div.prod-detail > div > div:nth-child(2) > div:nth-child(2) > div > dl:nth-child(4) > dd')|| false
                    const status = document.querySelector('body > div:nth-child(1) > div.prod-detail > div > div:nth-child(2) > div:nth-child(2) > div > dl:nth-child(11) > dd')|| false
                    const core = document.querySelector('body > div:nth-child(1) > div.prod-detail > div > div:nth-child(2) > div:nth-child(2) > div > dl:nth-child(6) > dd')|| false
                    // const size = document.querySelector('body > section.box__product > div > ul > ul.box__ainfo > ul:nth-child(2) > li:nth-child(5) > p.con-text-text.con-text-Lora.font-black')|| false
                    const box_placeholder = document.querySelector('body > div:nth-child(1) > div.prod-detail > div > div:nth-child(2) > div:nth-child(2) > div > dl:nth-child(10) > dd')|| false
                    const insurance_placeholder = document.querySelector('body > div:nth-child(1) > div.prod-detail > div > div:nth-child(2) > div:nth-child(2) > div > dl:nth-child(9) > dd')|| false
        
                    const insurance = insurance_placeholder=="無"?"":`保險:${insurance_placeholder.innerText}`
                    const box = box_placeholder=="無"?"":"有附盒"
                    
                
                    const sereis_number = document.querySelector('body > div:nth-child(1) > div.prod-detail > div > div:nth-child(2) > div:nth-child(2) > div > dl:nth-child(2) > dd')
        
                    return ([`${series?series.innerText:""} ${name_Eng?name_Eng.innerText:""} ${series_name?series_name.innerText:""} ${sereis_number?sereis_number.innerText:""} ${material?material.innerText:""} ${box} ${insurance} `])
                })

                watches[0][i].push(Info[0])

                const [watchsereis_, price_, photo_, name_] = watches[0][i]
                const exists_ = await database.exists({name:name_})
                const watch_ = await database.where("name").equals(name_)
                if(!exists_){
                    await database.create({
                        name: name_,
                        prices: [{
                            price: price_
                        }],
                        stores: '相對論鐘錶行',
                        photos: photo_,
                        watchsereis: watchsereis_,
                        webp: url,
                    })
                    await console.log(name_+"added sucessfully");
                } else if (watch_[0].prices[watch_[0].prices.length-1].price != price_){
                    
                    await watch_[0].prices.push({price:price_})
                    await watch_[0].save()
                    console.log(`ready to update prices of ${watchsereies_} with new prices ${price_}`)
                
                } 
                    await page.goto(url, { waitUntil: 'domcontentloaded' });

               
            }catch (error){
                console.log(`Error when checking for duplicated: ${error}`)
            }
        }
        await page.close();
       
    }
