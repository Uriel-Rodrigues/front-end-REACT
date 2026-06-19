'use client'

import Menu from "@/app/components/Menu";
//adaptador para conectar o resolver a validações como yup
import { yupResolver } from "@hookform/resolvers/yup";
//biblioteca para gerenciar formulario
import { useForm } from "react-hook-form"; 
//importar yup, dependencias para validação do formulario 
import * as yup from 'yup'
import instance from "@/services/api";
import Link from "next/link";
import {useState} from "react";
//importa componente para proteção de rotas
import ProtectedRoute from "@/app/components/ProtectedRoute";
//importar o componente sid bar
import SideBar from "@/app/components/SideBar";
//importar o componente nav bar
import NavBar from "@/app/components/NavBar";

const schema = yup.object().shape({
    name: yup.string().required("o nome da situação do produto é obrigatoria")
    .min(3, "o campo deve ter pelo menos 3 caracteres")
})

export default function Situation () {
    //estado para armazenar dados de cada situação
    //const [nameSituation,setNameSituation] = useState <string> ("") 
    
    //estado para controle de loadind
    const [loading, setloading] = useState <boolean> (false)
    //estado para controle de erro
    const [error, setError] = useState <string | null> (null) 
    //estado para acerto 
    const [success, setSuccess] = useState <string | null> (null)

    const {register, handleSubmit, formState: {errors}, reset} = useForm({
        resolver:yupResolver(schema)
    })

    //função para encaminhar os dados para API
    const onSubmit = async (data: {name:string}) => {
        //evitar que a pagina re-carregue apos envia o formulario
        //event.preventDefault()
        
        //iniciar o carregando 
        setloading(true)
        //limpar erro anterior
        setError(null)
        //limpar sucesso anterior
        setSuccess(null)

        try {
            //fazer requisição para a API
            const response = await instance.post(`/product-situations`, data)
            //mostrar mensagem de sucesso
            setSuccess(response.data.menssage || "situação de produto cadastrada com sucesso")
            //limpar o pormulario
            reset()

        }
        catch(error:any){
            //verificar se o erro contem menssagem e validação
            if (error.response && error.response.data && error.response.data.menssage){
            
                //exibir as mensagens de erro se forem um array de mensagens
                if (Array.isArray(error.response.data.menssage)){
                    setError(error.response.data.menssage.join(" - "))
                }
                else{
                    //exibir menssagem se for somente uma mensagem 
                    setError(error.response.data.menssage)
                }
            }
            else{
                //verificar mensagem generica de error
                setError("erro ao cadastrar situação de produto tente novamente!")
            }
        }
        finally{
            //terminar o carregamento em caso de erro
            setloading(false)
        }

    } 

    return(
        <ProtectedRoute>
            <div className="bg-dashboard">
                <NavBar/>
                <div className="flex">
                    <SideBar/>

                    {/* exivir carregando  */}
                    {loading && <p>Carregando...</p>}
                    {/* exibir erro se ouver */}
                    {error && <p style={{color: "#AB080B"}}>{error}</p>}
                    {/* exibir sucesso se ouver  */}
                    {success && <p style= {{color: "#3CB648"}}>{success}</p>}
                    
                    {/* <!-- conteudo principal --> */}
                    <main className="main-content">
                        {/* <!-- titulo a trilha de navegação --> */}
                        <div className="content-wrapper">
                            <div className="content-header">
                                <h2 className="content-title">Produto-Situação</h2>
                                <nav className="breadcrumb">
                                    <a href="/deshboard" className="breadcrumb-link">Dashboard</a>
                                    <span>/</span>
                                    <a href={`/product-situations/list`} className="breadcrumb-link">Produto-Situação</a>
                                    <span>/</span>
                                    <span>Cadastrar</span>
                                </nav>
                            </div>
                        </div>

                        <div className="content-box">
                            <div className="content-box-header">
                                <h3 className="content-box-title">Cadastrar Situação-Produto</h3>
                                <div className="content-box-btn">
                                    <a href={`/product-situations/list`} className="btn-info aling-icon-btn">
                                        {/* <!-- svg list-bullet (Heroicons) --> */}
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4">

                                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                                        </svg>
                                        <span>Listar</span>
                                    </a>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div className="mb-4">
                                    <label htmlFor="nameSituation" className="form-label">Nome da Situação: </label>
                                    <input
                                        //value={nameSituation}
                                        type="text"
                                        id="nameSituation"
                                        placeholder="Nome da Situação"
                                        //onChange={(e) => setNameSituation(e.target.value)} 
                                        {...register('name')}
                                        className="form-input"
                                    />
                                    {errors.name && <p style={{color:"#AB080B"}}>{errors.name.message}</p>}
                                </div>

                                <button type="submit" disabled = {loading} className="btn-success">
                                    {loading ? "Cadastrando...": "Cadastrar"}
                                </button>
                            </form>
                        </div>
                    </main>
                </div>
            </div>

        </ProtectedRoute>
    )
}
