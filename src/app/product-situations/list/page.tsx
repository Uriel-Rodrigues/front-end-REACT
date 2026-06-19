'use client'

import { useEffect, useState } from "react"
import Link from "next/link"
//imorta o componente services
import instance from "@/services/api"
//importação componente de aginação
import Pagination from "@/app/components/Pagination"
//importa o componente menu
import Menu from "@/app/components/Menu"
//importar componente para deletar
import DeleteButton from "@/app/components/DeleteButton"
import ProtectedRoute from "@/app/components/ProtectedRoute";
//importar componente de navbar
import NavBar from "@/app/components/NavBar";
//importar componente de sidbar
import SideBar from "@/app/components/SideBar";

//definir INTERFACE para resposta da API
interface Situation {
    id: number,
    name: string,
    createdAt: string,
    updateAt: string
}

export default function SituationList (){
    //estado para armazenar as situações de produto
    const[situation, setSituations] = useState <Situation[]>([])
    //estado para controle de carregamento
    const[loading, setLoading] = useState <boolean>(true)
    //estado para controle de erros
    const[error, setError] = useState <string | null> (null)
    //estado para controle de sucesso 
    const [success,setSuccess] = useState <string | null> (null)
    //pagina atual 
    const[currentPage, setCurrentPage] = useState<number>(1)
    //pagina final
    const[lastPage, setLastPage] = useState<number>(10) 


    //função para buscar as situações de produto da API
    const fatchSituation = async (page:number) =>{
        try{
            //inicia o carregamento
            setLoading(true)
            //solicitação para a API
            const response = await instance.get(`/product-situations?page=${page}&limit=6`)
            //atualiza o estado com os dados para da API
            setSituations(response.data.data)
            //atualiza a pagina atual
            setCurrentPage(response.data.currentPage)
            //termina o carregamento
            setLoading(false)
        }
        catch(error) {
            setError ("error ao carregar as situações de produto")
            //termina o carregamento em caso de erro
            setLoading(false)
        }
    }

    //atualizar os dados apos deletar
    const handleSuccess = () => {
        fatchSituation(currentPage)
    }

    //Hook para buscar os dados na primeira renderização 
    useEffect (() => {
        //uscar dados da primeira renderização pagina [id]
        const menssage = sessionStorage.getItem("successMenssage")
        //atribui os dados a menssagem e sucesso 
        if(menssage){
            setSuccess(menssage)
            //remove os dados para não aparecer mais de uma vez
            sessionStorage.removeItem("successMenssage")
        }
        //buscar os dados
        fatchSituation(currentPage)
    },[currentPage]) //recarreca os dados sempre que a pagina muda 

    return (
        <ProtectedRoute>
            <div className="bg-dashboard">
                <NavBar/>
                <div className="flex">
                    <SideBar/>
                    
                    {/* exibir o carregando...*/}
                    {loading && <p>Carregando...</p>}
                    {/* exibir mensagem de sucesso caso tenha */}
                    {success && <p style={{color:"#3CB648"}}>{success}</p>}
                    {/* exibe erros se ouver*/}
                    {error && <p style={{color:"#AB080B"}}>{error}</p>}
                    {!loading && !error && (

                        // <!-- conteudo principal -->
                        <main className="main-content">
                            {/* <!-- titulo a trilha de navegação --> */}
                            <div className="content-wrapper">
                                <div className="content-header">
                                    <h2 className="content-title">Situações de produto</h2>
                                    <nav className="breadcrumb">
                                        <a href="/deshboard" className=" breadcrumb-link">Dashboard</a>
                                        <span>/</span>
                                        <span>Situações de produto</span>
                                    </nav>
                                </div>
                            </div>

                            <div className="content-box">
                                <div className="content-box-header">
                                    <h3 className="content-box-title">Situações de produto</h3>
                                    <div className="content-box-btn">
                                        <a href={`/product-situations/create`} className="btn-success aling-icon-btn">
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
                                                <th className="table-header">ID </th>
                                                <th className="table-header">Nome da Situação</th>
                                                <th className="table-header center">Ações</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {situation.map((situation) => (
                                                <tr key = {situation.id} className="table-row-body">
                                                    <td className="table-body">{situation.id}</td>
                                                    <td className="table-body">{situation.name}</td>
                                                    <td className="table-body table-actions">
                                                        <Link href= {`/product-situations/${situation.id}`} className="btn-primary">Visualizar</Link> 
                                                        <Link href={`/product-situations/edit?id=${situation.id}`} className="btn-warning hidden md:inline-block">Editar</Link>
                                                        
                                                        <DeleteButton 
                                                            id= {String(situation.id)}
                                                            route="product-situations"
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
                                {/* usar componentes de paginação */}
                                <Pagination 
                                    currentPage={currentPage}
                                    lastPage={ lastPage}
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