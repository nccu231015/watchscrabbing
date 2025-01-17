import moment from "moment"
export const checkDB = async (database,Info,shop,url) => {
    try{
    
    const [name,price,photo] = Info
    const exists = await database.exists({photos:photo})
    const watch = await database.where("photos").equals(photo)
    
    if (exists){
        if(photo == "https://s.yimg.com/cl/api/res/1.2/rYdMHH4puBhX_TZqByn4fA--/YXBwaWQ9eXR3YXVjdGlvbnNlcnZpY2U7Zmk9ZmlsbDtoPTIyMDtxPTg1O3JvdGF0ZT1hdXRvO3NyPTEuMjtzcz0xLjI7dz0yMjA-/https://s.yimg.com/ob/image/dfa3afe7-bb91-4634-8ed1-757569f6e1fe.jpg"){
            
        }
        if(watch[0].prices.length > 10){
            
            return
        }
        
        watch[0].latestUpdate = moment()
        await watch[0].save();
        
        
        if(watch[0].prices[watch[0].prices.length-1].price == price){
            await watch[0].save();
        } else{
            
            console.log(`${name} in ${shop} already in the database, update prices`)
            
            await watch[0].prices.push({price:price})
            await watch[0].save()
        }
    } else{
        await database.create({
            name: name,
            prices: [{
                price: price
            }],
            stores: shop,
            photos: photo,
            webp: url
        })
        await console.log(`${name} in ${shop} added sucessfully`);
    }
   
}catch (error){
    const [name,price,photo] = Info
    const watch = await database.where("name").equals(name)
    console.log(`Error when checking for duplicated: ${error} and the watch is ${watch[0]}`)
}
}