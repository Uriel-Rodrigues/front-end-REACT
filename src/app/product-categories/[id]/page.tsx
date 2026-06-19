'use client'
import Menu from "@/app/components/Menu";
import instance from "@/services/api";
//importar componente para deletar 
import DeleteButton from "@/app/components/DeleteButton";
//hook para controle de navegação do usuario
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import ProtectedRoute from "@/app/components/ProtectedRoute";
//importa o componente para a navbar
import NavBar from "@/app/components/NavBar";
//importa o componente para a SidBar
import SideBar from "@/app/components/SideBar";


interface Categories {
    id: number,
    name: string,
    createdAt: string,
    updatedAt: string
}

const categoriesDetails = ()=>{
    //useParams para pegar o id da URL 
    const {id} = useParams()
    //instanciar router para poder usar
    const router = useRouter()
    //estado para atualizar a categoria
    const [categories, setCategories] = useState <Categories | null> (null)
    //estado para carregamento 
    const [loading, setLoading] = useState <boolean> (true)
    //estado para tratar erro
    const [error, setError] = useState <string | null> (null)
    //estado para controle de acerto 
    const [success, setSuccess] = useState <string | null> (null)

    //funão para buscar as categorias da API
    const fetchCategoriesDetail = async (id: string) => {
        try{
            //iniciar carregamento
            setLoading(true)
            //realizar a solicitação para a API
            const response = await instance.get(`/product-categories/${id}`)
            //atuar alizar os dados de acordo com a resposta da api
            setCategories(response.data)
            //parar carregamento 
            setLoading(false)
        }
        catch(error:any){
            //verificar se erro é da mensagem e validação
            if (error.response && error.response.data){
                //retornar a mensagem de error da API
                setError(error.response.data.menssage)
            }
            else{
                //criar mensagem generica de erro
                setError("erro ao carregar os detalhes da categoria de poduto")
            }
            //parar o carregamento
            setLoading(false)

        }
    }
    //controlar navegação do usuario e criar mensagem de sucesso 
    const hendleSuccess = () => {
        // criar mensagem de sucesso apos deletar 
        sessionStorage.setItem("successMenssage","categoria de produto deletada com sucesso. ")
        //redirecionar o usuario para list
        router.push(`/product-categories/list`)
    }

    useEffect (() => {
        if (id){
            //garantir que o id seja uma string
            const categoriesId = Array.isArray(id) ? id[0] : id   
            //buscar os dados da situação se estiver disponivel
            fetchCategoriesDetail(categoriesId)
        }
    },[id])// recarrega a pagina sempre que o id mudar 

    return (
        <ProtectedRoute> 
            <div className="bg-dashboard">
                <NavBar/>
                <div className="flex">
                    <SideBar/>

                    {/* exibir o carregando */}
                    {loading && <p>carregando...</p>}
                    {/* exibnir erro se ouver */}
                    {error && <p style={{color:"#AB080B"}}>{error}</p>}

                    {/* imprimir detalhes do registro */}
                    {categories && !loading && !error &&(
                        // <!-- conteudo principal -->
                        <main className="main-content">
                            <div className="content-wrapper">
                                <div className="content-header">
                                    <h2 className="content-title">Produto-Categorias</h2>
                                    <nav className="breadcrumb">
                                        <a href="/deshboard" className=" breadcrumb-link">Dashboard</a>
                                        <span>/</span>
                                        <a href={`/product-categories/list`} className=" breadcrumb-link">categoria do produto </a>
                                        <span>/</span>
                                        <span>Visualizar</span>
                                    </nav>
                                </div>
                            </div>

                            <div className="content-box">
                                <div  className="content-box-header">
                                    <h3 className="content-box-title">Visualizar Usuários</h3>
                                    <div className="content-box-btn">
                                        <a href={`/product-categories/list`} className="btn-info aling-icon-btn">
                                            {/* <!-- svg list-bullet (Heroicons) --> */}
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4">

                                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                                            </svg>
                                            <span>Listar</span>
                                        </a>
                                        <a href={`/product-categories/edit`} className="btn-warning aling-icon-btn ">
                                            {/* <!-- svg pencil-square (Heroicons) --> */}
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                            </svg>
                                            <span>Editar</span>
                                        </a>
                                        < DeleteButton
                                            id = {String(categories.id)}
                                            route="product-categories"
                                            onSuccess={hendleSuccess}
                                            setError={setError}
                                            setSuccess={setSuccess}
                                        />
                                    </div>
                                </div>
                                <div className="detail-box">
                                    <div className="mb-1">
                                        <span className="detail-content">ID: {categories.id}</span>
                                    </div>

                                    <div className="mb-1">
                                        <span className="detail-content">Nome categoria-produto: {categories.name}</span>
                                    </div>

                                    <div className="mb-1">
                                        <span className="detail-content">createdAt: {new Date(categories.createdAt).toLocaleString()}</span>
                                    </div>

                                    <div className="mb-1">
                                        <span className="detail-content">updatedAt: {new Date(categories.updatedAt).toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                        </main>
                    )}
                </div>
            </div>
        </ProtectedRoute>        
    )
}
export default categoriesDetails