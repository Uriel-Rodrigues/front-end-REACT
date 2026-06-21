'use client';

import instance from "@/services/api";
import Menu from "@/app/components/Menu";
import Link from "next/link";
import * as yup from "yup"
import { resolve } from "path";
import { yupResolver} from "@hookform/resolvers/yup";
import { useState } from "react";
import { useForm } from "react-hook-form";
//importar componente para proteção de rotas
import ProtectedRoute from "@/app/components/ProtectedRoute";
//importar o componente sid bar
import SideBar from "@/app/components/SideBar";
//importar o componente nav bar
import NavBar from "@/app/components/NavBar";
// importar animação spinner para carregando
import LoadingSpinner from "../../components/LoadingSpinner";
//importar o componente para apresentar os alertas
import AlertMessage from "../../components/AlertMessage";

//schema de alidação com yup
const schema = yup.object().shape({
    name: yup.string().required("o campo nome do produto é obrigatorio!").min(3,"o campo nome deve conter no minimo 3 caracteres"),
    description: yup.string().required("é necessario atribuir alguma descrição ao produto!").min(20, "a descrição deve ter no minimo 20 caracteres"),
    price: yup.number().transform((convertedValue, receivedValue) => receivedValue==="" ? undefined : convertedValue).required("o campo de preço é obrigatorio!"),
    category: yup.number().transform((convertedValue, receivedValue) => receivedValue==="" ? undefined : convertedValue).required("obrigatorio indicar a categoria do produto!"),
    situation: yup.number().transform((convertedValue, receivedValue) => receivedValue==="" ? undefined : convertedValue).required("é obrigatorio indicar a situação do produto!")  
})

export default function Product () {
    //criar estado para producto
    const [nameProduct, setNameProduct] = useState <string> ("");
    //estado para armazenar descrição
    const [description, setDescription] = useState <string> ("")
    //estado para armazenar preço do produto 
    const [price, setPrice]= useState <string> ("")
    // estado para armazenar categoria do produto
    const [category, setCategory] = useState <string> ("")
    //estado para armazenar a situação do produto
    const [situation, setSituation] = useState <string> ("") 
    // criar estado para controle de carregamento 
    const [loading, setloading] = useState <boolean> (false)
    // criar estado para controle de erro
    const [error, setError] = useState <string | null> (null)
    // criar estado para controle de sucesso
    const [success, setSuccess] = useState <string | null> (null)

    //iniciar o formulario com validações
        const {register, handleSubmit, formState :{errors}, reset} = useForm({
            resolver: yupResolver(schema)
        })

    //função para encaminar os dados para a API
    const onSubmit = async (data: {name:string ; description: string ; price:number ; category:number ; situation:number}) => {
        //iniciar carregamento
        setloading(true) 
        //limpar erro se tiver
        setError(null) 
        //limpar acerto se tiver
        setSuccess(null)  
        
        //fazer requisição para a API
        try {
        //requisição
            const response = await instance.post ("/product", data)
            //exibir mensafgem de sucesso 
            setSuccess(response.data.menssage || "Produto cadastrado com sucesso!")
            //limpar o campo do formulario
            setNameProduct("")

        }
        catch(error: any){
            //verificar se o erro contem menssagem de validação
            if (error.response && error.response.data && error.response.data.menssage){
                //mostrar menssagem caso seja um array
                if(Array.isArray(error.response.data.menssage)){
                    setError(error.response.data.menssage.join(" - "))
                }
                else{
                    //exibir unica menssagem de erro caso n seja array
                    setError(error.response.data.menssage)
                }
            }

        } 
        finally{
            //terminar o carregamento
            setloading(false) 
        }

    }
    
    return(
        <ProtectedRoute>
            <div className="bg-dashboard">
                <NavBar/>
                <div className="flex">
                    <SideBar/>

                    {/* mostrar carregando */}
                    {loading && <LoadingSpinner/>}
                    {/* mostrar menssagem de erro se ouver */}
                    <AlertMessage type="error" message={error}/>
                    {/* mostrar menssagem de sucesso se ouver */}
                    <AlertMessage type="success" message={success}/>

                    {/* <!-- conteudo principal --> */}
                    <main className="main-content">
                        {/* <!-- titulo a trilha de navegação --> */}
                        <div className="content-wrapper">
                            <div className="content-header">
                                <h2 className="content-title">Produto</h2>
                                <nav className="breadcrumb">
                                    <a href="/deshboard" className="breadcrumb-link">Dashboard</a>
                                    <span>/</span>
                                    <a href={`/product/list`} className="breadcrumb-link">Produto</a>
                                    <span>/</span>
                                    <span>Cadastrar</span>
                                </nav>
                            </div>
                        </div>

                        <div className="content-box">
                            <div className="content-box-header">
                                <h3 className="content-box-title">Cadastrar Produto</h3>
                                <div className="content-box-btn">
                                    <a href={`/product/list`} className="btn-info aling-icon-btn">
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
                                    <label htmlFor="nameProduct" className="form-label">Nome do Produto: </label>
                                    <input 
                                        type="text"
                                        id = "nameProduct"
                                        value={nameProduct}
                                        placeholder="Nome do Produto"
                                        {...register('name')}
                                        className="form-input"
                                    />
                                    {/* exibir erros de validação de campo  */}
                                    {errors.name && <AlertMessage type="error" message={errors.name.message ?? null}/>}
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="description" className="form-label">Descrição do produto: </label>
                                    <input 
                                        type="text"
                                        id="description"
                                        value={description}
                                        placeholder="descrição do produto" 
                                        {...register('description')}
                                        className="form-input"
                                    />
                                    {/* exibir erros de validação de campo  */}
                                    {errors.description && <AlertMessage type="error" message={errors.description.message ?? null}/>}
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="price" className="form-label">preço do produto: </label>
                                    <input 
                                        type="number"
                                        id="price"
                                        value={price}
                                        placeholder="Preço do Produto"
                                        min={0.00}
                                        step={0.01}
                                        {...register('price')}
                                        className="form-input"
                                    />
                                    {/* exibir erros de validação de campo  */}
                                    {errors.price && <AlertMessage type="error" message={errors.price.message ?? null}/>}
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="situation" className="form-label">Situação do Produto: </label>
                                    <input 
                                        type="number"  
                                        id="situation"
                                        value={situation}
                                        placeholder="situação do produto"
                                        {...register('situation')}
                                        className="form-input" 
                                    />
                                    {/* exibir erros de validação de campo  */}
                                    {errors.situation && <AlertMessage type="error" message={errors.situation.message ?? null}/>}
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="category" className="form-label">Categoria do Produto: </label>
                                    <input 
                                        type="text" 
                                        id="category"
                                        value={category}
                                        placeholder="Categoria do Produto"
                                        {...register('category')}
                                        className="form-input"
                                    />
                                    {/* exibir erros de validação de campo  */}
                                    {errors.category && <AlertMessage type="error" message={errors.category.message ?? null}/>}
                                </div>
                                <button type="submit" disabled = {loading} className="btn-success">
                                        {loading ? "Cadastrando...": "CADASTRAR"}
                                </button>
                            </form>
                        </div>
                    </main>
                </div>
            </div>
        </ProtectedRoute>
    )
} 