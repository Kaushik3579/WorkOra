// filepath: c:\Users\LENOVO\workora\src\components\Button.jsx
import React from "react";

const Button = ({ className, icon, labelText, labelTextClassName, showIcon, style, stateProp }) => {
    return (
        <button className={className} disabled={stateProp === "disabled"}>
            {showIcon && icon}
            <span className={labelTextClassName}>{labelText}</span>
        </button>
    );
};

export { Button };