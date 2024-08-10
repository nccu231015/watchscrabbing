export default function FilterBought({onboughtchange}){
    return(
        <div className="dropdownwrapper">
            <select className="dropdown" id="shop-select" onChange={(event)=>{onboughtchange(event.currentTarget.value)}}>
            <option value= "">全部</option>
            <option value= "unsale">未出售</option>
            <option value= "sale">已出售</option>
            </select>
        </div>
    )
}