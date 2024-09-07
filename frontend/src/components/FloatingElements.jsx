import React, { useState } from 'react';

const FloatingLabelInput = ({ label, id, type = "text" }) => {
  const [isFocused, setIsFocused] = useState(false);
  
  return (
    <div className="relative mt-6">
      <input
        type={type}
        id={id}
        className={`block w-full px-2.5 pb-2.5 pt-4 text-left text-sm text-gray-900 bg-white border-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer 
          ${isFocused ? 'border-blue-600' : 'border-gray-300'}`}
        placeholder=" "
        onFocus={() => setIsFocused(true)}
        onBlur={(e) => setIsFocused(e.target.value !== "")}
      />
      <label
        htmlFor={id}
        className={`absolute text-sm text-gray-500 text-left duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 
          ${isFocused ? 'text-blue-600' : 'text-gray-500'}`}
      >
        {label}
      </label>
    </div>
  );
};

export default FloatingLabelInput;
