import { useContext } from "react";
import { AuthContext } from "../auth.context";
import { getMe, login, logout, register } from "../services/auth.api";

export const useAuth = ()=>{
    const context = useContext(AuthContext) ; 
    const {loading , setLoading , user , setUser} = context ; 

    const handelRegister = async({userName , email , password})=>{
        setLoading(true) ; 
        try {
            const data = await register({userName , email , password})
            setUser(data.user) ; 
            return data ; 
        } catch (error) {
            console.log(error) ; 
            throw(error) ; 
        }finally{
            setLoading(false) ; 
        }
    }
    

    const handelLogin = async({email , password})=>{
        setLoading(true) ; 
        try {
            const data = await login({email , password}) ; 
            setUser(data.user) ; 
            return data ; 
        } catch (error) {
            console.log(error) ; 
            throw(error) ; 
        }finally{
            setLoading(false) ;
        }
    }

    const handelLogout = async () => {
        setLoading(true)
        try {
            const data = await logout()
            setUser(null)
            return data
        } catch (error) {
            console.log(error)
            throw error
        } finally {
            setLoading(false)
        }
    }

    const handelGetMe = async()=>{
        setLoading(true) ; 
        try {
            const data = await getMe() ; 
            setUser(data.user) ;
            return data ; 
        } catch (error) {
            console.log(error) ; 
            throw(error) ; 
        }finally{
            setLoading(false) ;
        }
    }

    return {loading , user , handelRegister , handelLogin , handelLogout , handelGetMe}
} ; 

