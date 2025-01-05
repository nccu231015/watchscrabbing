import moment from "moment"
export const checkDB = async (database,Info,shop,url) => {
    try{
    
    const [name,price,photo] = Info
    const exists = await database.exists({photos:photo})
    const watch = await database.where("name").equals(name)
    
    if (exists){
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
    console.log(`Error when checking for duplicated: ${error}`)
}
}