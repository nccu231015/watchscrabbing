import "../card/card.css"
import PriceTags from "./priceTag"
import moment from "moment/moment";

export default function Prices({price, sold, lastupdate}){
  // 根據 updatedAt 進行排序，新的在上面
  const sortedPrices = [...price].sort((a, b) => {
    const timeA = moment(a.updatedAt);
    const timeB = moment(b.updatedAt);
    return timeB - timeA;  // 降序排列
  });

  return (
    <div className="price">
      {sold ? <PriceTags time={lastupdate} check="2" price="sold"/> : <></>}
  
      {sortedPrices.map((priceItem, i) => {
        const check = i === sortedPrices.length-1 ? 0 : 
                     priceItem.price < sortedPrices[i + 1].price ? -1 : 1;
        
        return (
          <PriceTags
            key={i}
            price={priceItem.price}
            time={priceItem.updatedAt}
            check={check}
          />
        );
      })}
    </div>
  )
}