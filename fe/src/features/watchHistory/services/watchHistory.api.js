import axios from "axios" ; 

const api = axios.create({
    baseURL : "http://localhost:3000/api/watchHistory" , 
    withCredentials : true 
}) ; 

export const addWatchHistory = async(data)=>{
    try {
        const res = await api.post("/" , data) ; 
        return res.data ; 
    } catch (error) {
        console.log(error) ; 
        throw error ; 
    }
}

export const getWatchHistory = async(params = {})=>{
    try {
        const res = await api.get("/" , {params}) ; 
        return res.data ; 
    } catch (error) {
        console.log(error)
        throw error
    }
}

export const clearWatchHistory = async()=>{
    try {
        const res = await api.delete("/") ;
        return res.data ; 
    } catch (error) {
        console.log(error) ; 
        throw error ; 
    }
}