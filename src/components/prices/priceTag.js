import "./pricetag.css"

export default function PriceTags({price, time, check, nd_string}){
    // 將 UTC 時間轉換為台北時間（UTC+8）
    const date = new Date(time);
    const tpeDate = new Date(date.getTime() + (8 * 60 * 60 * 1000)); // 加上 8 小時
    
    const hours = String(tpeDate.getUTCHours()).padStart(2, '0');
    const minutes = String(tpeDate.getUTCMinutes()).padStart(2, '0');
    
    return(
        <div className="tag" style={{
            color: check === 1 ? '#DE5A24' : check === -1 ? '#3CA517' : check==="2" ? '#DE5A24' : 'black', // Default to black if check is 0 or any other value
          }}>
            <div>{nd_string? nd_string :time.slice(0,10)}</div>
            <div>{`${hours}:${minutes}`}</div>
            <div>{price === "sold" ? "SOLD" : price?price:"無報價"}</div>
            <div>{check === 0 ? "-" : check === 1 ? "↑" : check === -1 ? "↓" : ""}</div>
        </div>
    )
}