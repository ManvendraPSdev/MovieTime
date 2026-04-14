import { createContext , useState } from "react";

export const MovieContext = createContext()

export const MovieContextProvider = ({children})=>{
    const [loading , setLoading] = useState(false) ; 
    const [movie , setMovie] = useState(null) ; 
    const [movies , setMovies] = useState([]) ; 
    const [error , setError] = useState(null) ; 

    return (
        <MovieContext.Provider value = {{loading , setLoading , movie , setMovie , movies , setMovies , error , setError}}>
            {children}
        </MovieContext.Provider>
    )
}