export default function FilterShop({store, onshopchange = f => f}){
    return(
        <div className="dropdownwrapper">
            <select className="dropdown" id="shop-select" onChange={(event)=>{onshopchange(event.target.value)}}>
                <option value="">選擇商店</option>
                {store.map((shop,i) => (
                    <option key={i} value={shop}>
                    {shop}
                    </option>
                ))}
            </select>
      </div>
    )
}