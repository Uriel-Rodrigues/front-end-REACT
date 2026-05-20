'use client'
import instance from "@/services/api";
import Menu from "../components/Menu";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import * as yup from "yup"
import { resolve } from "path";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
//criar eschema yup para validação 
const schema = yup.object().shape({
    email: yup.string().required("o campo email é obrigatório!").email("digite um email valido!"),
    password: yup.string().required("o campo senha é obrigatorio!")
})

export default function Login (){
    //instanciar o router para usar posteriormente
    const router = useRouter()
    //criar estado para controle de carregamento
    const [loading, setLoading] = useState <boolean> (false)
    //estado para controle de erro 
    const [error, setError ] = useState <string | null> (null) 
    // estado para controle de acerto
    const [success, setSuccess] = useState <string | null> (null)

    //iniciar o formulario com validações
    const {register, handleSubmit, formState :{errors}, reset} = useForm({
        resolver: yupResolver(schema)
    })

    //função para encaminhar dados para a API validar
    const onSubmit = async (data: {email:string ; password: string}) => {
        //inicar carregamento
        setLoading(true)

        //limpar erros anteriores
        setError(null)
        //limpa sucesso anterior 
        setSuccess(null)

        try{
            //fazer requisição para api enviar dados os dados
            const response = await instance.post("/", data)
            
            // capturar o token e armazenar em sessionStorage
            localStorage.setItem("token",response.data.user.token)

            //redirecionar o usuario para pagina principal 
            router.push("/deshboard")
        }
        catch (error: any) {
            //verificar se ocorreu erro de autenicação
            if(error.response && error.response.data && error.response.data.menssage){
                
                //mostrar mensagem caso seja um array de manssagem 
                if(Array.isArray(error.response.data.menssage)){
                    setError(error.response.data.menssage.join("-"))
                }   
                
                //mostrar mensagem caso seja somente uma menssagem
                else{
                    setError(error.response.data.menssage)
                }
            }  
        }
        finally{
            //parar de carregar 
            setLoading(false)
        }
    }

    return (
        <div>
            <h1>LOGIN DE USUARIO</h1>
            <br />
            {/* mostrar carregamento */}
            {loading && <p>{loading}</p>}
            {/* mostrar erro caso tenh */}
            {error && <p style={{color:"#AB080B"}}>{error}</p>}
            {/* mostrar mensagfem de sucesso caso tenha */}
            {success && <p style={{color:"#3CB648"}}>{success}</p>}
            {/* mostrar formulario caso não esteja carregando e não tenha erros */}
            {!loading && !error && (
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div>
                        <label htmlFor="email">*Email: </label>
                        <input 
                            id = "email"
                            type="email" 
                            placeholder= "Email de usuario"
                            {...register('email')}
                            className ="border"
                            />
                    </div>
                    {/* exibir erros de validação de campo  */}
                    {errors.email && <p style={{color:"#AB080B"}}>{errors.email.message}</p> }
                    <br /> 

                    <div>
                        <label htmlFor="password">*Senha: </label>
                        <input
                            id = "password"
                            type="password"
                            placeholder="Senha"
                            {...register('password')}
                            className ="border"
                            />
                    </div>
                    {/* exibir erro de validação de campo */}
                    {errors.password && <p style={{color:"#AB080B"}}>{errors.password.message}</p>}

                    <br />
                    <button type="submit" disabled = {loading}>
                        {loading ? "Acessando..." : "Entrar"}
                    </button>
                </form>
            )}
        </div>
    )
}

