'use client'
import instance from "@/services/api";
import Menu from "@/app/components/Menu";
import Link from "next/link";
import { useEffect, useState } from "react";
import {useSearchParams } from "next/navigation"
//importar componente para tornar rota protegida
import ProtectedRoute from "@/app/components/ProtectedRoute";
//importar o componente sid bar
import SideBar from "@/app/components/SideBar";
//importar o componente nav bar
import NavBar from "@/app/components/NavBar";
// importar animação spinner para carregando
import LoadingSpinner from "../../components/LoadingSpinner";
//importar o componente para apresentar os alertas
import AlertMessage from "../../components/AlertMessage";

export default function Product() {
    //capturar id pela url
    const id = Number(useSearchParams().get("id"))
    //estado para guardar o nome do produdo
    const [nameProduct, setNameProduct] = useState <string> ("") 
    //estado para guardar a descrição do produto 
    const [description, setdescription] = useState <string> ("") 
    //estado para guardar o preço do produto
    const [price, setPrice] = useState <string> ("")
    //estado para categoria do produto
    const [category, setCategory] = useState <string> ("") 
    //estado para guardar situação 
    const [situation,setSiuation] =useState <string> ("")
    //estado para controle de carregamendo
    const [loading, setLoading] = useState <boolean> (false)
    //estado para controle de erro
    const [error , setError] = useState <string | null> (null) 
    //estado para controle de sucesso 
    const [success, setSuccess] = useState <string | null> (null)


    //função para capturar os dados ja existente dentro da API
    const fetchProduct = async () =>{
        try{
            //iniciar carrgamento 
            setLoading(true)
            //fazer requisição para API
            const response = await instance.get(`/product/${id}`)
            //salvar dados encontrado 
            setNameProduct(response.data.name)
            setdescription(response.data.description)
            setPrice (response.data.price)
            setCategory(response.data.category)
            setSiuation(response.data.situation)
        }
        catch (error: any){
            //verificar se existe erro na requisição
            if (error.response && error.response.data && error.response.data.menssage){
                //verificar se o erro é um array
                if(Array.isArray(error.response.data.menssage)) {
                    setError(error.response.data.menssage.join(" - "))
                }
                else{
                    //menssagem caso n seja array
                    setError(error.response.data.menssage)
                }
            }
        }
        finally{
            //terminar carregamento 
            setLoading(false)
        }
    }

    //função para atualizar os dados alterados 
    const handleSubmit = async (event: React.FormEvent) => {
        //parar carregamento da pagina
        event.preventDefault()
        //iniciar o carregamento 
        setLoading(true)
        //limpar erro anteriro
        setError(null)
        //limpar acerto anterior
        setSuccess(null)
        
        try{
            //realizar requisição para a API
            const response = await instance.put(`/product/${id}`, {
                name: nameProduct,
                description: description,
                price: price,
                category: category,
                situation: situation
            })
            //exibir menssagem de sucesso 
            setSuccess(response.data.menssage || "Dados do produto atualizados com sucesso")

            //limpar o campo do formulario 
            setNameProduct("")
            setdescription("")
            setPrice("")
            setCategory("")
            setSiuation("")
        }
        catch(error: any){
            //verificar que existe erro na requisição
            if(error.response && error.response.data && error.response.data.menssage){
                if(Array.isArray(error.response.data.menssage)){
                    setError(error.response.data.menssage.join(" - "))
                }
                else{
                    //retornar menssagem no caso de ser somente uma 
                    setError(error.response.data.menssage)
                }
            }
        }
        finally{
            //terminar o carregamento
            setLoading(false)
        }
    }

    //hook para atualizar a pagina quando mudar o componente
    useEffect(() =>{
        if(id) {
            fetchProduct()
        }
    },[id]) //recarrega a pagina quando mudar o id

    return(
        <ProtectedRoute>
            <div className="bg-dashboard">
                <NavBar/>
                <div className="flex">
                    <SideBar/>
                    
                    {/* mostar carregando */}
                    {loading && <LoadingSpinner/>}
                    {/* mostrar erro caso tenha */}
                    <AlertMessage type="error" message={error}/>
                    {/* mostrar sucesso caso tenha */}
                    <AlertMessage type="success" message={success}/>
                    
                    {/* mostrar formulario */}
                    {!loading && !error && (

                        // <!-- conteudo principal -->
                        <main className="main-content">
                            {/* <!-- titulo a trilha de navegação --> */}
                            <div className="content-wrapper">
                                <div className="content-header">
                                    <h2 className="content-title">Produtos</h2>
                                    <nav className="breadcrumb">
                                        <a href="/deshboard" className="breadcrumb-link">Dashboard</a>
                                        <span>/</span>
                                        <a href={"/product/list"} className="breadcrumb-link">Produtos</a>
                                        <span>/</span>
                                        <span>Editar</span>
                                    </nav>
                                </div>
                            </div>

                            <div className="content-box">
                                <div className="content-box-header">
                                    <h3 className="content-box-title">Editar Usuários</h3>
                                    <div className="content-box-btn">
                                        <a href={"/product/list"} className="btn-info aling-icon-btn">
                                            {/* <!-- svg list-bullet (Heroicons) --> */}
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4">

                                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                                            </svg>
                                            <span>Listar</span>
                                        </a>

                                        <a href={`/product/${id}`} className="btn-primary aling-icon-btn">
                                            {/* <!-- svg eye (Heroicons) --> */}
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4">

                                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />

                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                            </svg>
                                            <span>Vizualizar</span>
                                        </a>
                                    </div>
                                </div>

                                <form onSubmit={handleSubmit}>
                                    <div>
                                        <div className="mb-4">
                                            <label htmlFor="nameProduct" className="form-label">Novo nome: </label>
                                            <input 
                                                id="nameProduct"
                                                type="text" 
                                                value= {nameProduct}
                                                placeholder="Novo Nome do produto"
                                                onChange={(e) => setNameProduct(e.target.value)}
                                                className="form-input"
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <label htmlFor="description" className="form-label">Nova descrição: </label>
                                            <input 
                                                id="description"
                                                type="text"
                                                value={description}
                                                placeholder="Nova Descrição"
                                                onChange={(e) => setdescription(e.target.value)}
                                                className="form-input"  
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <label htmlFor="pice" className="form-label">Novo preço: </label>
                                            <input
                                                id="price" 
                                                type="number"
                                                value={price}
                                                min={0.00}
                                                step={0.01}
                                                placeholder="Novo Preço do produto "
                                                onChange={(e) => setPrice(e.target.value)}
                                                className="form-input"
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <label htmlFor="category" className="form-label">Nova categoria: </label>
                                            <input 
                                                id="category"
                                                type="text"
                                                value={category}
                                                placeholder="Nova categoria"
                                                onChange={(e) => setCategory(e.target.value)}
                                                className="form-input"
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <label htmlFor="situation" className="form-label">Nova Stuação: </label>
                                            <input 
                                                id="situation"
                                                type="text"
                                                value={situation}
                                                placeholder="Nova Situação"
                                                onChange={(e) => setSiuation(e.target.value)}
                                                className="form-input" 
                                            />
                                        </div>
                                    </div>

                                    <button type="submit" disabled={loading} className="btn-success">
                                        {loading ? "Atualizando" : "Salvar"}
                                    </button>
                                </form>
                            </div>
                        </main>
                    )}
                </div>
            </div>
        </ProtectedRoute>
    )

}