import { useState, useCallback } from "react";

function debounce(func, wait) {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }



export default function FilterShop({startloading, store, onshopchange = f => f}){
    const [localInputValue, setLocalInputValue] = useState();

    const debouncedHandleInputChange = useCallback(debounce((value) => {
        onshopchange(value);
      }, 300), [onshopchange]);


    const handleChange = (event) => {
        startloading();
        const value = event.currentTarget.value;
        setLocalInputValue(value);
        debouncedHandleInputChange(value);
    };

    return(
        <div className="dropdownwrapper">
            <select className="dropdown" id="shop-select" onChange={handleChange}>
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