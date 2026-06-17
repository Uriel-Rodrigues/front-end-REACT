'use client';
//importar hook usado para meniulçar a navegação do usuario 
import { useRouter } from "next/navigation"

import Pagination from "@/app/components/Pagination";
import Menu from "@/app/components/Menu";
import instance from "@/services/api";
import { useEffect, useState } from "react";
import DeleteButton from "@/app/components/DeleteButton";
import Link from "next/link";
import ProtectedRoute from "@/app/components/ProtectedRoute";
//importa o componente para a navbar
import NavBar from "@/app/components/NavBar";
import SideBar from "@/app/components/SideBar";



//interface com os tipos de resposta da api
interface Product {
    id: number,
    name: string,
    slug: string,
    description: string,
    price: number
    situation: number,
    category: number,
    createdAt: string,
    updatedAt: string
};

export default function productList(){
    //istanciar o objeto router 
    const router= useRouter()
    //estado para armazenar os dados dos produtos
    const [product, setProduct] = useState <Product[]> ([]);
    //estado para controle de carregamento 
    const [loading, setLoading] = useState <boolean> (false);
    //estado para controle de erro
    const [error, setError] = useState <string | null> (null);
    //estado para controle de sucesso 
    const [success, setSuccess] = useState <string | null> (null);
    //pagina atual
    const [currentPage, setCurrentPage] = useState <number> (1)
    //pagina final
    const [lastPage, setLastPage] = useState <number> (10)

    //função para buscar os produtos na API
    const fetchProducts = async (page: number) => {
        try{
        //iniciar o carregamento 
        setLoading(true)
        //fazer a solicitação para a api
        const response = await instance.get(`/product?page=${page}&limit=6`)
        //atualizar os dados com o que foi retornado
        setProduct(response.data.data)
        //atualizar a pagina atual
        setCurrentPage(response.data.currentPage)
        //parar carregamento
        setLoading(false)

        }
        catch(error) {
            //retorna menssagem em caso de erro
            setError ("não foi possivel carregar os Produtos")
            console.log(error)
            //para o carregamento 
            setLoading(false)
        }
    }
    //atuarlizar a pagina apos deletar registro
    const handleSuccess = () => {
        fetchProducts(currentPage)
    }

    //hook para atualizar os registros quando mudar de pagina
    useEffect(() => {
        //buscar dados ao mudar a pagina
        fetchProducts(currentPage)
    },[currentPage])// atualiza os dados quando a pagina mudar
    
    
    //f unção para redirecionar o usuario quado sair    
    const handleLogaut = () => {
        //remover o token do local storage
        localStorage.removeItem("token")
        //redireciona para a pagina login
        router.push("/login")
    }
    
    return(
        <ProtectedRoute>
            <div className="bg-dashboard">
                <NavBar/>

                <div className="flex">
                {/* <!-- sidBar --> */}
                   <SideBar/>

                    {/* exibir carregando */}
                    {loading && <p>Carregando...</p>}
                    {/* exibir mensage de erro se tiver */}
                    {error && <p>{error}</p>}
                    {/* exibir mensagem de sucesso se tiver  */}
                    {success && <p style={{color:"#3CB648" }}>{success}</p>}

                    {/* exibir o conteudo da tabela caso nao tenha erro e nao esteja carregando  */}
                    {!loading && !error && (
                        
                        // conteudo principal
                        <main className="main-content">
                            {/* <!-- titulo a trilha de navegação --> */}
                            <div className="content-wrapper">
                                <div className="content-header">
                                    <h2 className="content-title">Produtos</h2>
                                    <nav className="breadcrumb">
                                        <a href="/src/adm/dashboard.html" className=" breadcrumb-link">Dashboard</a>
                                        <span>/</span>
                                        <span>Produtos</span>
                                    </nav>
                                </div>
                            </div>

                            {/* inicio tabela + titulo + botão */}
                            <div className="content-box">
                                <div className="content-box-header">
                                    <h3 className="content-box-title">Listar Produtos</h3>
                                    <div className="content-box-btn">
                                        <a href={"/product/create"} className="btn-success aling-icon-btn">
                                            {/* <!-- svg user-plus (Heroicons) --> */}
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4">

                                                <path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
                                            </svg>
                                            <span>Cadastrar</span>
                                        </a>
                                    </div>
                                </div>
                                <div className="table-container"> 
                                    <table className="table">
                                        <thead>
                                            <tr className="table-row-header">
                                                <th className="table-header">ID</th>
                                                <th className="table-header">Nome do Produto</th>
                                                <th className="table-header center">Ações</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {product.map((product) =>(
                                                <tr key={product.id} className="table-row-body">
                                                    <td className="table-body">{product.id}</td>
                                                    <td className="table-body">{product.name}</td>
                                                    <td className="table-body table-actions"> 
                                                        <Link href = {`/product/${product.slug}`} className="btn-primary"> Viasualizar</Link> 
                                                        <Link href={`/product/edit?id=${product.slug}`} className="btn-warning hidden md:inline-block">Editar</Link>  
                                                        <DeleteButton 
                                                            id = {String(product.slug)}
                                                            route = "product"
                                                            onSuccess={handleSuccess}
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
