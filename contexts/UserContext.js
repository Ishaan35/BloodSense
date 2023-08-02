import { createContext, useState } from "react";

export const UserContext = createContext();

export const UserContextProvider = ({children}) => {
    const [SignedInUser, SetSignedInUser] = useState(null);
    const [LoadingPage, setLoadingPage] = useState(false);
    

    const value = {
        SignedInUser,
        SetSignedInUser,
        LoadingPage,
        setLoadingPage
    }
    return (
      <UserContext.Provider value={value}>
        {children}
      </UserContext.Provider>
    );
}