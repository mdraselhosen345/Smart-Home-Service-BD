import React, { useState } from "react";
import { AuthContext } from "./AuthContext";

const AuthProvider = ({ children }) => {

    return (
        <AuthContext.Provider value={cardInfo}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;