import "./pricetag.css"

export default function PriceTags({price, time, check}){
    const date= new Date(time);
    const _tpetime = date.toLocaleString('en-US', { timeZone: 'Asia/Taipei' });
    const tpetime = new Date(_tpetime)
    
    const hours = String(tpetime.getHours()).padStart(2, '0');
    const minutes = String(tpetime.getMinutes()).padStart(2, '0');
    return(
        <div className="tag" style={{
            color: check === 1 ? '#DE5A24' : check === -1 ? '#3CA517' : 'black', // Default to black if check is 0 or any other value
          }}>
            <div>{time.slice(0,10)}</div>
            <div>{`${hours}:${minutes}`}</div>
            <div>{price?price:"無報價"}</div>
            <div>{check === 0 ? "-" : check === 1 ? "↑" : check === -1 ? "↓" : ""}</div>
        </div>
    )
}