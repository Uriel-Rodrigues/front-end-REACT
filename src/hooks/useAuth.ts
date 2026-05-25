'use client'

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import instance from "@/services/api"

export function useAuth (){
    //instanciar o router para usar depois
    const router = useRouter ()
    //estado para armazenar autenticação 
    const [authenticated, setAuthenticated] = useState <boolean> (false)
    //comtrole de carregamento
    const [loading, setLoading] = useState <boolean> (false)
    
    //Hookspara verificar se o token existe 
    useEffect(() => {
        //recperar o token do localStorage
        const token = localStorage.getItem("token")
        // verificar se o token existe 
        if(!token) {
            //se nao existir encaminha o usuario para a pagina de login 
            router.push("/login")
        }
        else {
            //verifica avalidade do token na API 
            const validateToken = async () => {
                try{
                    //fazer a requisição à API
                    await instance.get("/validate-token")
                    //atribuir a situação da autenticação
                    setAuthenticated(true)

                } catch (error){
                    //remover o token invalido 
                    localStorage.removeItem("token")
                    //redirecionar para a pagina de login 
                    router.push("/login")

                } finally{
                    setLoading(false)
                }
            }
            //chamar a função validar o token  
            validateToken()
    }
    },[])
    //retornar a situação da autenticação
    return {authenticated, loading}
}