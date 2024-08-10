import Image from "next/image";
import Prices from "../prices/Prices";
import "./card.css";

export default function Card({watch}){
    return (
        <div className="wrap">
            <div className="name">{watch.name}</div>
            <div className="imagePrice">
                <Image className="image" alt={watch.name} src={watch.photos} width={100} height={100}/>
                <Prices className="price" price={watch.prices}></Prices>
            </div>
            <div className="information">
                <div>{watch.stores}</div>
                <a href={watch.webp} target="_blank">網站頁面</a>
            </div>
        </div>
    );
}