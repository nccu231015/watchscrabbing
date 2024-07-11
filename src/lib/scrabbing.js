import puppeteer from "puppeteer-core";
import { FastLoad } from "./Hook/FastLoad.js"
import { checkDB } from "./Hook/CheckDB.js"
import createBrowser from "./Hook/Browser.js"

export const YS_url = (pg)=>{ return  `https://www.egps.com.tw/index.asp?index=${pg}`}

export const YS_count = async()=>{
    const browser = await createBrowser();
    const page = await browser.newPage();
    await page.goto("https://www.egps.com.tw/", { waitUntil: 'domcontentloaded' })
    
    const l_pages = await page.evaluate(()=>{
        const _pg = document.querySelectorAll('body > table:nth-child(9) > tbody > tr > td:nth-child(1) > table:nth-child(7) > tbody > tr > td:nth-child(2) > table:nth-child(5) > tbody > tr > td > table:nth-child(4) > tbody > tr > td > table > tbody > tr > td:nth-child(3) > a:nth-last-child(1)')
        return _pg[0].innerText
    })
    return l_pages
    await browser.close()
}
//{page,data}
export const YS_main = async ({page,data})=>{
    // const browser = await puppeteer.launch({headless:false})
    // const page = await browser.newPage()
    // const url = YS_url(36)

    const {url,database} = data
    FastLoad(page);

    await page.goto('https://www.egps.com.tw')
    await page.goto(url,{waitUntil:'networkidle0'})
    
    const  Information = await page.evaluate(()=>{

        function keepOnlyChineseCharacters(input) {
            // Define a regular expression to match Chinese characters
            var chineseChars = input.match(/[\u4e00-\u9fff]/g);
            
            // Join the matched characters into a single string
            return chineseChars ? chineseChars.join('') : '';
        }

        let info = []
        
        const articles =  document.querySelectorAll('body > table:nth-child(9) > tbody > tr > td:nth-child(1) > table:nth-child(7) > tbody > tr > td:nth-child(2) > table:nth-child(5) > tbody > tr > td > table:nth-child(2) > tbody > tr >td')

        for (let i=0 ; i<articles.length ; i++){
           
            const shop = articles[i].querySelectorAll('td.shopping_Price') 
            const name = articles[i].querySelectorAll('a.a_table_list_txt')
            const _price = articles[i].querySelectorAll('span.shopping_Price')
            const _situation = articles[i].querySelectorAll('td>table>tbody>tr:nth-child(5)')
            const image = articles[i].querySelectorAll('#picture > div > a > img')

            if(name[0]){
                const price = parseInt(_price[0].innerText.replace(/[^0-9]/g, ''), 10);
                if(_situation[0]!== undefined){
                    var situation = _situation[0].innerText;
                }
                info.push([name[0].innerText+" "+situation,price,"https://www.egps.com.tw/"+image[0].getAttribute('src'),keepOnlyChineseCharacters(shop[0].innerText)])
            }
        }

        return [info,info.length]
    
    })
   


    for (let i=0; i<Information[1]; i++){
        const [name,price,photo,shop] = Information[0][i]
        // console.log(Information[0][i])
        checkDB(database,Information[0][i],'永生名錶'+shop,url)
}
}

