import Image from "next/image"
import icon from "../../../public/image 2.png"
import "./title.css";

export default function Title(){
    return(
        <div className="titlewrap">
            <Image className="image" src={icon} width={0} height={0}></Image>
            <div className="title">終點站 搜尋器</div>
        </div>
    )
}