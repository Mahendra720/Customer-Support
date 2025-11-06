import React, { createContext, useState, useContext } from "react";
import { colors } from "../colors";

// 1️⃣ Create the context
const RatingContext = createContext();

// 2️⃣ Create the Provider component
export const RatingProvider = ({ children }) => {
    const [rating, setRating] = useState(null);

    return (
        <RatingContext.Provider value={{ rating, setRating}} colors={colors}>
            {children}
        </RatingContext.Provider>
    );
};

// 3️⃣ Create a custom hook for easy access
export const useRating = () => {
    const context = useContext(RatingContext);
    if (!context) {
        throw new Error("useRating must be used within a RatingProvider");
    }
    return context;
};
