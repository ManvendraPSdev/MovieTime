import axios from "axios" ; 
import { API_ORIGIN } from "../../../config/api.js";

const api = axios.create({
    baseURL : `${API_ORIGIN}/api/auth` , 
    withCredentials : true
})

export async function register({userName , email , password}){
    try {
        const response = await api.post("/register" , {
            userName , email , password
        })
        return response.data ; 
    } catch (error) {
        console.log(error)
        throw error
    }
}

export async function login({email , password}){
    try {
        const response = await api.post("/login" , {
            email , password
        })
        return response.data ; 
    } catch (error) {
        console.log(error) ; 
        throw error
    }
}

export async function logout(){
    try {
        const response = await api.post("/logout") ; 
        return response.data ; 
    } catch (error) {
        console.log(error) ; 
        throw error
    }
}

export async function getMe(){
    try {
        const response = await api.get("/getMe") ; 
        return response.data ; 
    } catch (error) {
        console.log(error) ; 
        throw error
    }
}