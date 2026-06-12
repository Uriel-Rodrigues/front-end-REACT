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

    useEffect (() => {
        const menssage = sessionStorage.getItem("successMenssage")
        if(menssage) {
            setSuccess(menssage)
            sessionStorage.removeItem("successMenssage")
        }
    },[])

    return (
        <div className="bg-login ">
            <div className="card-login">
                <div className="logo-wrapper-login">
                    <a href="/">
                    <img src="/image/curso_ia_unimontes-500x500.png" alt="logo" className="logo-login"/>
                    </a>
                </div>

                <h1 className="title-login ">Área restrita</h1>

                {/* mostrar carregamento */}
                {loading && <p>{loading}</p>}
                {/* mostrar erro caso tenh */}
                {error && <p className="alert-danger">{error}</p>}
                {/* mostrar mensagfem de sucesso caso tenha */}
                {success && <p className="alert-success">{success}</p>}
                {/* mostrar formulario caso não esteja carregando e não tenha erros */}
                {!loading && !error && (
                    <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
                        <div className="form-group-login">
                            <label htmlFor="email" className="fotm-group-logi">*Email: </label>
                            <input 
                                id = "email"
                                type="email" 
                                placeholder= "Email de usuario"
                                {...register('email')}
                                className ="form-input-login"
                            />
                            {/* exibir erros de validação de campo  */}
                            {errors.email && <p className="alert-danger">{errors.email.message}</p> }
                        </div>

                        <br /> 

                        <div className="form-group-login">
                            <label htmlFor="password" className="fotm-group-logi">*Senha: </label>
                            <input
                                id = "password"
                                type="password"
                                placeholder="Senha"
                                {...register('password')}
                                className ="form-input-login"
                            />
                            {/* exibir erro de validação de campo */}
                            {errors.password && <p className="alert-danger">{errors.password.message}</p>}
                        </div>


                        <div className="btn-group-login">
                            <Link href="/recover-password" className="link-login">Esqueceu a senha?</Link>
                            <button type="submit" className="btn-primary-md" disabled = {loading}>{loading ? "Acessando..." : "Entrar"}
                            </button>
                        </div>
                        <div className="mt-4 text-center">
                            <Link href="/login/create" className="link-login">Criar nova conta !</Link>
			            </div>
                    </form>
                )}
            </div>
        </div>
    )
}

