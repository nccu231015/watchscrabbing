import "../card/card.css"
import PriceTags from "./priceTag"
import moment from "moment/moment";


   

export default function Prices({price, sold, lastupdate}){
  console.log(price)
    return (
      
        <div className="price">
        {sold?<PriceTags time={lastupdate} check="2" price="sold"/>:<></>}
    
    {price.map((priceItem, i) => {
        const check = i === price.length-1 ? 0 : priceItem.price < price[i + 1].price ? -1 : 1;
        
        return (
          <PriceTags
            key={i} // It's a good practice to use a unique key for list items
            price={priceItem.price}
            time={priceItem.updatedAt}
            check={check}
          />
        );
      })}
      
        </div>
       
    )
}