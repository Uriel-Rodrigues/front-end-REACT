'use client'
import React, {useEffect, useState} from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, useFormContext } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import * as yup from 'yup'
import instance from "@/services/api";
import Link from "next/link";
// importar animação spinner para carregando
import LoadingSpinner from "../../components/LoadingSpinner";
//importar o componente para apresentar os alertas
import AlertMessage from "../../components/AlertMessage";


//schema de validação com yup 
const schema = yup.object().shape({
    password:yup.string().required("o campo senha é obrigatorio!")
})

export default function updatePassword () {
    //instanciar o objeto router
    const router = useRouter()
    //instanciar o objeto para capturar os parametros da URL
    const searchParams = useSearchParams()
    //instancia para controle de loading
    const [loading,setLoading] = useState <boolean> (false)
    //instancia para controle de erro
    const [error, setError] = useState <string | null> (null)
    // instancia para controle de acerto
    const [success, setSuccess] = useState <string | null> (null)
    
    //iniciar formulario com validações
    const {register, handleSubmit, formState: {errors}, reset} = useForm ({
        resolver: yupResolver(schema)
    })

    //função para enviar dados para a api
    const onSubmit = async (data: {password:string, recoverPassword?: string, email?: string}) => {
        //chave recuperar senha
        data.recoverPassword = searchParams.get("key") || ""
        //email do usuario 
        data.email = searchParams.get("email") || ""

        // iniciar carregamento 
        setLoading(true)
        //limpar o erro anterior
        setError(null)
        //limpar acerto anterior 
        setSuccess(null)

        try {
            //fazer requisição para a API envair os dados
            const response = await instance.put("/update-password",data)
            //limpar campo do formulario 
            reset()
            //salver a mesnagem no sessionStorage antes de direcionar
            sessionStorage.setItem("successMenssage", response.data.menssage || "senha atualizada com sucesso")
            //redirecionar usuario para pagina de login
            router.push("/login")
        }
        catch (error: any){
            //verificar de o erro contem menssagem de validação 
            if(error.response && error.response.data && error.response.data.menssage){
                
                //exibe menssagem caso seja um array de mensagens
                if(Array.isArray(error.response.data.menssgae)) {
                    setError(error.response.data.menssage.join("-"))
                }else {
                    //salva a menssagem no sessionStorage antes de redirecionar 
                    setError(error.response.data.menssage)
                }
            } else{
                //mensagem generica de error
                setError("erro ao atualizar a senha")
            }
        }finally{
            setLoading(false)       
        }
    }
    //hook para verificar se o token existe 
    useEffect(() => {
        //iniciar o carregamento 
        setLoading(true)

        //recuperar o email e key da URL 
        const email = searchParams.get("email") || ""
        const recoverPassword = searchParams.get("key") || ""

        //verificar se o token existe 
        if(!email || !recoverPassword) {
            //salvar a menssagem no sessionStorage antes de redirecionar 
            sessionStorage.setItem("errorMenssage","dados invalidos para recuperar a senha")

            //redirecionar para o login se nao tiver email e key
            router.push("/login")
        }

        //verificar a validade da chave na api
        const validatekey = async () => {
            try{
                //fazer a requisição à API 
                await instance.post("/validate-recover-password", {email,recoverPassword})
            }
            catch (error:any){
                //verificar de o erro contem menssagem de validação 
                if(error.response && error.response.data && error.response.data.menssage){
                
                //exibe menssagem caso seja um array de mensagens
                if(Array.isArray(error.response.data.menssgae)) {
                    sessionStorage.setItem("errorMenssage",error.response.data.menssage.join("-"))
                }
                else {
                    //salva a menssagem no sessionStorage antes de redirecionar 
                    sessionStorage.setItem("errorMenssage",error.response.data.menssage)
                }

            } else{
                //salvar a menssagem no sessionStorage antes de redirecionar 
                sessionStorage.setItem("errorMenssage", "dados invalidos para recuperar a senha") 
            }
            //redirecionar para o login se nao tiver email e key 
            router.push("/login")
            } 
            
            finally{
            setLoading(false)
            }
        }
        //chama a função para validar token 
        validatekey()
    },[])

    return (
        <div className="bg-login">

            {/* div geral */}
            <div className="card-login">

                {/* div com a imagem */}
                <div className="logo-wrapper-login">
                    <img src="/image/curso_ia_unimontes-500x500.png" alt="logo" className="logo-login"/>
                </div>

                <h1 className="title-login">Recuperar senha</h1>
                
                {/* Exibir o carregando */}
                {loading && <LoadingSpinner/>}
                {/* Exibe mensagem de erro */}
                <AlertMessage type="error" message={error}/>
                {/* Exibe mensagem de sucesso */}
                <AlertMessage type="success" message={success}/>

                <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
                    <div>
                        <label htmlFor="password" className="form-label-login" >Senha: </label>
                        <input
                            type="password"
                            id="password"
                            placeholder="Senha com mínimo 6 caracteres"
                            {...register('password')}
                            className="form-input-login"
                        /><br />
                        {/* Exibe o erro de validação do campo */}
                        {errors.password && <AlertMessage type="error" message={errors.password.message ?? null}/>}
                    </div>
                    <div className="btn-group-login">
                        <Link href={'/login'} className="link-login">Login</Link>

                        <button type="submit" disabled={loading} className="btn-primary-md items-center">
                            {loading ? "Enviando..." : "Atualizar"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
   
}
