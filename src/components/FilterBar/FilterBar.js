import FilterBought from "./FilterBought"
import FilterSearch from "./FilterSearch"
import FilterShop from "./FIlterShop"
import "./Filter.css"

export default function FilterBar({store, onshopchange = f => f, onboughtchange = f => f, inputValue, handleInputChange,startloading}){
    return(
    <div className="filterwrapper">
        <FilterShop store={store} onshopchange = {onshopchange}></FilterShop>
        <FilterBought onboughtchange={onboughtchange}></FilterBought>
        <FilterSearch inputValue={inputValue} handleInputChange={handleInputChange} startloading={startloading}></FilterSearch>
    </div>        
    )
}