import { createContext , useState } from "react";

export const WatchHistoryContext = createContext() ; 

export const WatchHistoryContextProvider = ({children})=>{
    const [loading , setLoading] = useState(false) ; 
    const [error , setError] = useState(null) ; 
    const [watchHistory , setWatchHistory] = useState([]) ; 
    return(
        <WatchHistoryContext.Provider value={{loading , setLoading , error , setError, watchHistory , setWatchHistory}}>
            {children}
        </WatchHistoryContext.Provider>
    )
}