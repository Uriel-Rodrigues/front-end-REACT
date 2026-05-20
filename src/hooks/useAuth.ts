'use client'

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export function useAuth (){
    //instanciar o router para usar depois
    const router = useRouter ()
    //estado para armazenar autenticação 
    const [authenticated, setAuthenticated] = useState <boolean> (false)
    
    //Hookspara verificar se o token existe 
    useEffect(() => {
        //recperar o token do localStorage
        const token = localStorage.getItem("token")
        // verificar se o token existe 
        if(!token) {
            //se nao existir encaminha o usuario para a pagina de login 
            router.push("/login")
        }else{//atribuir a situação da autenticação
            setAuthenticated(true)
        }
    },[])

    //retorna a situação da altenticação 
    return {authenticated}
}