'use client'

import instance from "@/services/api"
import Menu from "@/app/components/Menu"

//importar o adaptador para conectar react-hook-form com bibliotecas de validação como yup
import { yupResolver } from "@hookform/resolvers/yup"
//imporar função para gerenciar o formulario
import {useForm} from "react-hook-form"
//importar a dependencia para validação de formulario
import * as yup from "yup"

import Link from "next/link"
import { useState } from "react"
//importar componente para tornar rota protegida (precisa estar logado)
import ProtectedRoute from "@/app/components/ProtectedRoute";
//importar o componente sid bar
import SideBar from "@/app/components/SideBar";
//importar o componente nav bar
import NavBar from "@/app/components/NavBar";
// importar animação spinner para carregando
import LoadingSpinner from "../../components/LoadingSpinner";
//importar o componente para apresentar os alertas
import AlertMessage from "../../components/AlertMessage";


//esquema de validação com yup
const schema = yup.object().shape({
    nameSituation: yup.string().required("o nome da situação é obrigatorio")
    .min(3, "o nome da situação deve ter pelo menos 3 caracteres!"),
})

export default function Situation () {
    //estado para armazenar dados da situação
    //const [nameSituation, setNameSituation] = useState <string> ("");
    
    //estado para carregamento
    const [loading, setLoading] = useState <boolean> (false) 
    //estado para controle de erro 
    const [error, setError] = useState <string | null> (null)
    //estado para controle de sucesso 
    const [success, setSuccess] = useState <string | null> (null)

    const {register, handleSubmit,formState: {errors}, reset} = useForm({
        resolver: yupResolver(schema)
    })

    //função para encaminhar dados para a API
    const onsubmit = async (data: {nameSituation:string}) => {
        //Evitar o carregamento da pagina ao enviar o formulario
        //event.preventDefault();
        
        //iniciar o carregamento
        setLoading(true)
        //limpar o erro anteriro
        setError(null)
        //limpar o sucesso anterior
        setSuccess(null)

        try{
            //fazer a requisição para a API
            const response = await instance.post("/situation", data)

            //exibir menssagem de sucesso 
            setSuccess(response.data.menssage || "situação cadastrada com sucesso!")

            //limpar o campo do formulario
            reset()

        }
        catch(error:any){
            //verificar se o erro contem mensagem e validação
            if (error.response && error.response.data && error.response.data.menssage){
                //exibir as mensagens de erro se for um array de mensagens
                if(Array.isArray(error.response.data.menssage)){
                    setError(error.response.data.menssage.join(" - "));
                }
                else{
                    //exibe a mensagem de error se for uma mensgem 
                    setError(error.response.data.menssage)
                }
            }
            else {
                //veficar a mensagem generica de erro
                setError("erro ao cadastrar situação, tente novamente")
            }
        }finally{
            //temina o carregamento em caso de error
            setLoading(false)
        }

    } 

    return (
        <ProtectedRoute>
            <div className="bg-dashboard">
                <NavBar/>
                <div className="flex">
                    <SideBar/>

                    {/* exibir carregando */}
                    {loading && <LoadingSpinner/>}
                    {/* exibir error se houver */}
                    <AlertMessage type="error" message={error}/>
                    {/* exibir mensagem de sucesso */}
                    <AlertMessage type="success" message={success}/>
                    
                    {/* <!-- conteudo principal --> */}
                    <main className="main-content">
                        {/* <!-- titulo a trilha de navegação --> */}
                        <div className="content-wrapper">
                            <div className="content-header">
                                <h2 className="content-title">Situações</h2>
                                <nav className="breadcrumb">
                                    <a href="/deshboard" className="breadcrumb-link">Dashboard</a>
                                    <span>/</span>
                                    <a href={`/situation/list`} className="breadcrumb-link">Situação</a>
                                    <span>/</span>
                                    <span>Cadastrar</span>
                                </nav>
                            </div>
                        </div>

                        {/* inicio do formulario */}
                        <div className="content-box">
                            <div className="content-box-header">
                                <h3 className="content-box-title">Cadastrar Situação</h3>
                                <div className="content-box-btn">
                                    <a href={`/situation/list`} className="btn-info aling-icon-btn">

                                        {/* <!-- svg list-bullet (Heroicons) --> */}
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4">

                                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                                        </svg>
                                        <span>Listar</span>
                                    </a>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit(onsubmit)}>
                                <div className="mb-4">
                                    <label htmlFor="nomeSituation" className="form-label">Nome da Situação: </label>
                                    <input 
                                        type="text" 
                                        id ="nomeSituation"
                                        placeholder="Nome da Situação"
                                        {...register('nameSituation')}
                                        className="form-input"   
                                    />
                                    {/* exibe o erro de validação do campo */}
                                    {errors.nameSituation && <AlertMessage type="error" message={errors.nameSituation.message ?? null}/>}
                                </div>

                                <button type="submit" disabled = {loading} className="btn-success">
                                    {loading ? "Enviado...":"Cadastrar"}
                                </button>
                            </form>
                        </div>
                    </main>
                </div>
            </div>
        </ProtectedRoute>
    )
}