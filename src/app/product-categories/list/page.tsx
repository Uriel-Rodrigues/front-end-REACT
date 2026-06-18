'use client'
import { useEffect, useState } from "react";
import Link from "next/link";

import instance from "@/services/api";
//importando componente de paginação
import Pagination from "@/app/components/Pagination";
//importa o componente menu
import Menu from "@/app/components/Menu";
import DeleteButton from "@/app/components/DeleteButton";
import ProtectedRoute from "@/app/components/ProtectedRoute";
//importar componente de navbar
import NavBar from "@/app/components/NavBar";
//importar componente de sidbar
import SideBar from "@/app/components/SideBar";

//definir tipos para a resposta da API
interface Categories {
    id: number,
    name: string,
    createdAt: string,
    updatedAt: string
}

export default function ProductCategoriesList() {
    //estado para armazenar Categorias
    const [categories, setCategories] = useState<Categories[]>([]);
    //estado para controle de carregamento 
    const [loading,setLoading] = useState<boolean>(true);
    //estado para controle de erros
    const [error, setError] = useState<string | null>(null);
    // estado para controle de sucesso
    const [success ,setSuccess] = useState <string | null> (null)
    //pagina atual
    const [currentPage, setCurrentPage] = useState<number>(1) 
    //pagina final
    const [lastPage, setLastPage] = useState<number>(4)

    //função para buscar as Categorias da API
    const fetchCategories = async (page:number) => {
        try{
            //inicia o carregamento
            setLoading(true)
            //faz a solicitação para a API
            const response = await instance.get(`/product-categories?page=${page}&limit=6`)
            //atualiza o estado com os dados da API
            setCategories(response.data.data)
            //atualiza a pagina atual
            setCurrentPage(response.data.currentPage)
            //terminar o carregamento
            setLoading(false) 

        }
        catch(error) {
            setError("erro ao carregar as categorias")
            //termina o carregamento em caso de erro
            setLoading(false)

        }
    }
    //atualizar a pagina apos deletar
    const hendleSuccess = () => {
        fetchCategories(currentPage)
    }
    //hook para buscar os dados na primeira renderização
    useEffect (() => {
        //capturar mensagem caso tenha
        const menssage =sessionStorage.getItem("successMenssage")
        if(menssage) {
            //atribui a messagem capturada
            setSuccess(menssage)
            //remove a mensagem para n aparecer mais de uma vez
            sessionStorage.removeItem("successMenssage")

        }
        //buscar os dados
        fetchCategories (currentPage)
    },[currentPage])//recarrega os dados sempre que a pagina muda
    
    return(
        <ProtectedRoute>
            <div className="bg-dashboard">
                {/* <!-- Navbar --> */}
                <NavBar/>
                <div className="flex">
                    {/* <!-- sidBar --> */}
                    <SideBar/>
                                    
                    {/* exibir o carregando... */}
                    {loading && <p>carregando....</p>}
                    {/* exibe erros se ouver */}
                    {error && <p style={{color:"#AB080B"}}>{error}</p>}
                    {/* exibe mensagem de sucesso */}
                    {success && <p style={{color:"#3CB648"}}>{success}</p>}

                    {!loading && !error && (
                        <main className="main-content">
                            {/* <!-- titulo a trilha de navegação --> */}
                            <div className="content-wrapper">
                                <div className="content-header">
                                    <h2 className="content-title">Produtos-Categorias</h2>
                                    <nav className="breadcrumb">
                                        <a href="/deshboard" className=" breadcrumb-link">Dashboard</a>
                                        <span>/</span>
                                        <span>Produtos-Categorias</span>
                                    </nav>
                                </div>
                            </div>

                            <div className="content-box">
                                <div className="content-box-header">
                                    <h3 className="content-box-title">Produtos-Categorias</h3>
                                    <div className="content-box-btn">
                                        <a href={`/product-categories/create`} className="btn-success aling-icon-btn">
                                            {/* <!-- svg user-plus (Heroicons) --> */}
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4">

                                                <path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
                                            </svg>
                                            <span>Cadastrar</span>
                                        </a>
                                    </div>
                                </div>

                                {/* <!-- Criação da tabela com Usuarios (ações) --> */}
                                <div className="table-container">
                                    <table className="table">
                                        <thead>
                                            <tr className="table-row-header">
                                                <th className="table-header">ID</th> 
                                                <th className="table-header">Nome Categoria</th>
                                                <th className="table-header center">Ações</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {categories.map((categories) => (
                                                <tr key={categories.id} className="table-row-body">
                                                    <td className="table-body">{categories.id}</td> 
                                                    <td className="table-body">{categories.name}</td>
                                                    <td className="table-body table-actions">
                                                        <Link href = {`/product-categories/${categories.id}`} className="btn-primary">Visualizar</Link> 
                                                        <Link href={`/product-categories/edit?id=${categories.id}`} className="btn-warning hidden md:inline-block">Editar</Link>
                                                    < DeleteButton
                                                        id={String(categories.id)}
                                                        route="product-categories"
                                                        onSuccess={hendleSuccess}
                                                        setError={setError}
                                                        setSuccess={setSuccess}
                                                    />
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                {/* paginação */}
                                <Pagination
                                    currentPage={currentPage}
                                    lastPage={lastPage}
                                    onPageChange={setCurrentPage}
                                />
                            </div>
                        </main>
                    )}
                    
                </div>
            </div>    
        </ProtectedRoute>
    )

}