import { useState, useCallback } from "react";

function debounce(func, wait) {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }

export default function FilterBought({ onboughtchange, startloading }) {
    const [localInputValue, setLocalInputValue] = useState();
    
    const debouncedHandleInputChange = useCallback(debounce((value) => {
        onboughtchange(value);
      }, 300), [onboughtchange]);

    const handleChange = (event) => {
        startloading();
        const value = event.currentTarget.value;
        setLocalInputValue(value);
        debouncedHandleInputChange(value);
    };
  
    return (
      <div className="dropdownwrapper">
        <select
          className="dropdown"
          id="shop-select"
          onChange={handleChange}
        >
          <option value="">全部</option>
          <option value="unsale">未出售</option>
          <option value="sale">已出售</option>
        </select>
      </div>
    );
  }
  