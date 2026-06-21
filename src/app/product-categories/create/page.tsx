'use client';

import Menu from "@/app/components/Menu";
import instance from "@/services/api";
//adaptador para conectaro resolver ao yup
import { yupResolver } from "@hookform/resolvers/yup";
//função para gerenciar o formulario 
import { useForm } from "react-hook-form";
//biblioteca de validação de formulario
import * as yup from 'yup'
import Link from "next/link";
import { useState } from "react";
//importa componente para proteção de rotas
import ProtectedRoute from "@/app/components/ProtectedRoute";
//importar o componente sid bar
import SideBar from "@/app/components/SideBar";
//importar o componente nav bar
import NavBar from "@/app/components/NavBar";
// importar animação spinner para carregando
import LoadingSpinner from "../../components/LoadingSpinner";
//importar o componente para apresentar os alertas
import AlertMessage from "../../components/AlertMessage";

const schema = yup.object().shape({
    name: yup.string().required("o nome da categoria do produto é um campo obrigatorio")
    .min(3, "o campo deve ter no minimo 3 caracteres para ser considerado valido")
}) 

export default function Categories() {
    //estado para armazenar as categorias
    //const [nameCategory, setNameCategory] = useState <string> (""); 
    
    //estado para controle de carregamento 
    const [loading, setLoadig] = useState <boolean> (false);
    //estado para controle de erros
    const [error, setError] = useState <string | null> (null);
    //estado para controle de sucesso
    const [success, setSuccess] = useState <string | null> (null);

    //importamos atraves de desestruturação os componentes que interessão de useForme
    //fazemos a ligação do resolver com o yup atraves do yupResolver 
    //resolver usara yupResolver para ler o que tem em schema
    const {register,handleSubmit, formState: {errors}, reset} =useForm({
        resolver: yupResolver(schema)
    })

    //função para fazer requisição para a API
    const onSubmit = async (data: {name: string}) => {
        //evitar carregamento da pagina apos enviar o formulario 
        //event.preventDefault()
        
        //iniciar carregamento 
        setLoadig(true)
        //limpar erro anterior se tiver
        setError(null)
        //limpar acerto anterior se tiver
        setSuccess(null)

        try {
            //fazer requisição para a API
            const response = await instance.post(`/product-categories`,data)
            
            //exibir mensgame de sucesso
            setSuccess(response.data.menssage || "categoria cadastrada com sucesso!")
            //limpar o campo do formulario
            reset()

        }
        catch(error:any){
            //verificar se o formulario contem erros de validação 
            if(error.response && error.response.data && error.response.data.menssage){
                //mostrar mensagem de erro em caso de ser um array
                if(Array.isArray(error.response.data.menssage)){
                    setError(error.response.data.menssage.join(" - "));
                }
                else{
                    //mostrar mensagem de erro no caso de so uma mensagem
                    setError(error.response.data.menssage);
                };
            }
            else{
                //menssagem generica de erro
                setError("erro ao cadastrar a nova categoria de produto, tente novamente!")
            };
        }
        finally{
            //termina o carregamento
            setLoadig(false)
        }

    } 

    return(
        <ProtectedRoute>
            <div className="bg-dashboard">
                <NavBar/>
                <div className="flex">
                    <SideBar/>

                    {/* exibir carregando */}
                    {loading && <LoadingSpinner/>}
                    {/* exibir erro se ouver  */}
                    <AlertMessage type="error" message={error}/>
                    {/* exibir sucesso se ouver */}
                    <AlertMessage type="success" message={success}/>
                    {/* conteudo principal */}
                    <main className="main-content">
                        {/* <!-- titulo a trilha de navegação --> */}
                        <div className="content-wrapper">
                            <div className="content-header">
                                <h2 className="content-title">Produto-Categoria</h2>
                                <nav className="breadcrumb">
                                    <a href="/deshboard" className="breadcrumb-link">Dashboard</a>
                                    <span>/</span>
                                    <a href={`/product-categories/list`} className="breadcrumb-link">Produto-categoria</a>
                                    <span>/</span>
                                    <span>Cadastrar</span>
                                </nav>
                            </div>
                        </div>

                        <div className="content-box">
                            <div className="content-box-header">
                                <h3 className="content-box-title">Cadastrar categoria-produto</h3>
                                <div className="content-box-btn">
                                    <a href={`/product-categories/list`}  className="btn-info aling-icon-btn">
                                        {/* <!-- svg list-bullet (Heroicons) --> */}
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4">

                                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                                        </svg>
                                        <span>Listar</span>
                                    </a>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit(onSubmit)} >
                                <div className="mb-4">   
                                    <label htmlFor="nameCategory" className="form-label">Nome da Categoria: </label>
                                    <input 
                                        type="text" 
                                        id="nameCategory"
                                        //value={nameCategory}
                                        placeholder="Nome da Categoria"
                                        //onChange={(e) => setNameCategory(e.target.value)}
                                        {...register('name')} 
                                        className="form-input"
                                    />
                                    {/* exibe a mensagem de erro caso exista*/}
                                    {errors.name && < AlertMessage  type="error" message={errors.name.message ?? null}/> }
                                </div>
                                <button type="submit" disabled = {loading} className="btn-success">
                                    {loading ? "Enviando..." : "Cadastrar"}
                                </button>
                            </form>
                        </div>
                    </main>
                </div>
            </div>
        </ProtectedRoute>
    )
};