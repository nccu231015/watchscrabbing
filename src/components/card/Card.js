import Image from "next/image";
import Prices from "../prices/Prices";
import "./card.css";
import moment from "moment";
import { ImCross } from "react-icons/im";

export default function Card({watch}){

    const checkifsold = (watch)=>{
        const now = moment().utc();
        const latestUpdate = moment(watch.latestUpdate).utc();
        const differenceInMinutes = now.diff(latestUpdate, 'minutes');
        return differenceInMinutes>720;
    }

    const sold = checkifsold(watch)
   


    return (
        <div className="wrap">
            <div className="name">{watch.name}</div>
            <div className="imagePrice">
                <Image className="image" alt={watch.name} src={watch.photos} width={100} height={100}/>
                <Prices lastupdate = {watch.latestUpdate} sold={sold} className="price" price={watch.prices}></Prices>
            </div>
            <div className="information">  
                <div>{watch.stores}</div>
                <a href={watch.webp} target="_blank">網站頁面</a>
            </div>
        </div>
    );
}