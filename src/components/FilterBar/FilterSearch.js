import { useState, useCallback } from "react";

// Debounce function
function debounce(func, wait) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

export default function FilterSearch({ inputValue, handleInputChange,startloading, endloading}) {
  const [localInputValue, setLocalInputValue] = useState(inputValue);

  // Debounced input change handler to call the parent handler after 500ms of inactivity
  const debouncedHandleInputChange = useCallback(debounce((value) => {
    
    handleInputChange(value);
  }, 1500), [handleInputChange]);

  const onInputChange = (event) => {
    startloading();
    const value = event.currentTarget.value;
    setLocalInputValue(value);
    debouncedHandleInputChange(value);
  };

  return (
    <input
      className="dropdownwrapper"
      type="text"
      value={localInputValue}
      onChange={onInputChange}
      placeholder="搜尋手錶"
    />
  );
}