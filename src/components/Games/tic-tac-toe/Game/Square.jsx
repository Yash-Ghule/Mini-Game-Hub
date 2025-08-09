import React from "react";

const Square = ({ onClick, value }) => {
    const getClass = () => {
        if (value === "X") return "square x";
        if (value === "O") return "square o";
        return "square";
    };

    return (
        <div onClick={onClick} className={getClass()}>
            <span>{value}</span>
        </div>
    );
};

export default Square;
