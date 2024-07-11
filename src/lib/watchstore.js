
import puppeteer from "puppeteer"
import mongoose from "mongoose";
import { checkDB } from "./Hook/CheckDB.js";
import { FastLoad } from "./Hook/FastLoad.js";
import createBrowser from "./Hook/Browser.js";

// const url = "https://watchstore.tw/newproduct.asp?keywords=&larcode=&newsclass=&page=1"

export const WS_url = (pg) =>{
    return `https://watchstore.tw/newproduct.asp?keywords=&larcode=&newsclass=&page=${pg+1}`
}


export const WS_count = async () =>{
    const browser = await createBrowser();
    const page = await browser.newPage()
    await page.goto(WS_url(0))
    while(page.url() == WS_url(0)){
        await page.click('body > table:nth-child(2) > tbody > tr:nth-child(2) > td > table > tbody > tr > td:nth-child(2) > table > tbody > tr:nth-child(3) > td:nth-child(2) > table > tbody > tr:nth-child(23) > td > table > tbody > tr:nth-child(1) > td > div > a:nth-last-child(1)')
    }

    await page.waitForSelector('table > tbody > tr:nth-child(1) > td > div > font')
    const last_pages = await page.evaluate(()=>{
        const _lastPcomponent = document.querySelector('table > tbody > tr:nth-child(1) > td > div > font')
        return _lastPcomponent.innerText
    })

    return last_pages
    browser.close();
}


export const WS_main = async ({page,data})=>{
    // const browser = await puppeteer.launch({headless:false})
    // const page = await browser.newPage()
    const {url,database} = data
    FastLoad(page)
    await page.goto(url)
    
    const  Information = await page.evaluate(()=>{

        try{
        const articles =  document.querySelectorAll('body > table:nth-child(2) > tbody > tr:nth-child(2) > td > table > tbody > tr > td:nth-child(2) > table > tbody > tr:nth-child(3) > td:nth-child(2) > table > tbody > tr > td')
        const info = []
        for (let i=0 ; i<articles.length ; i++){
            if(articles[i].innerText==undefined){
                continue;
            }
            
            const shop = "名錶窩"
            
            let name = articles[i].querySelector('table > tbody > tr:nth-child(2) > td > table > tbody > tr:nth-child(1) >td >p')
            if(name == null){
                continue
            }
            
            const _price = articles[i].querySelector('table > tbody > tr:nth-child(2) > td > table > tbody > tr:nth-child(3)')
            const price_number = parseInt(_price.innerText.replace(/[^0-9]/g, ''), 10);
            // if(name){
            //     info.push(name.innerText)
            // }
           
            const _images = articles[i].querySelector('table > tbody > tr:nth-child(1) > td a > img').getAttribute('src');
            const full_images = "https://watchstore.tw/"+_images;

            info.push([shop,name.innerText,price_number,full_images])

           
        }
        return info
      
    }catch (error){
        console.log(error)
    }
    })

    for (let i=0 ; i<Information.length; i++){
        checkDB(database,[Information[i][1],Information[i][2],Information[i][3]],Information[i][0],url)
        // try{
        //     const exists = await database.exists({name:Information[i][1]})
        //     const watch = await database.where("name").equals(Information[i][1])
        //     if (exists){
        //         if(watch[0].prices[watch[0].prices.length-1].price == Information[i][2]){
        //             console.log(`${Information[i][1]} already in the database, no updates`)
        //         } else{
        //             console.log(`${Information[i][1]} already in the database, update prices`)
        //             await watch[0].prices.push({price:Information[i][2]})
        //             await watch[0].save()
        //         }
        //     } else{
        //         console.log(`${Information[i][0]} not in database, ready to add`)
        //         await database.create({
        //             name: Information[i][1],
        //             prices: [{
        //                 price: Information[i][2]
        //             }],
        //             stores: Information[i][0],
        //             photos: Information[i][3],
        //         })
        //         console.log(`${Information[i][1]} added`)
        //     }
           
        // }catch (error){
        //     console.log(`Error when checking for duplicated: ${error}`)
        // }

       
    
}
}

    

