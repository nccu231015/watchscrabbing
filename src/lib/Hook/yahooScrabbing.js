
export const yahooscrab = async (page) => {
    
    const info = page.evaluate(async()=>{
    let information_list = []
    // const series = document.querySelector('#boxWidth > div.prodedata > div.datatxts > div:nth-child(4) > span.txts') || false
    // const name_Eng = document.querySelector('.is-en') || false
    const element = document.querySelectorAll('#booth > main > section > div.subjectUnit__FBanD.boothListings__RwOCH > div.subjectUnitMain__eHHPb > div > div > div > ul > li')
    

    for (let i=0; i<element.length; i++){

        const name_Chn = element[i].querySelectorAll('div.sc-1drl28c-4.njFQL > span')
        const _price = element[i].querySelectorAll(':is(div.sc-1drl28c-4.njFQL div.sc-SrAaV.gzVUEs span, div > div.sc-1drl28c-4.njFQL > div.sc-dycZeM.jTyrtf > span:nth-child(1)')
        const img = element[i].querySelectorAll(':is(.sc-1drl28c-3>img, .swiper-slide-active>img)')

        if(name_Chn[0]){
        const price = parseInt(_price[0].innerText.replace(/[^0-9]/g, ''), 10)
        information_list.push([name_Chn[0].innerText,price,img[0].getAttribute('src')])
        }
    }
      return information_list
})
return info
}