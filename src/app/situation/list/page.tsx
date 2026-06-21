'use client'
//importar o componente para criar LINK
import Link from "next/link";

//importa componente menu
import Menu from "@/app/components/Menu";

import Pagination from "@/app/components/Pagination";
//importa a instancia do axios configurada para fazer requisições para a API
import instance from "@/services/api";

//importa hooks do react para usar o estado e os efeitos colaterais
import { useEffect, useState } from "react";
//importa o componente de delete 
import DeleteButton from "@/app/components/DeleteButton";
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

//definir tipos para a resposta da API (interface)
interface Situation {
    id:number,
    nameSituation:string,
    createdAt: string,
    updatedAt:string
}

export default function SituationList(){
    //estado para armazenar as situações
    const [situations,setSituations] = useState<Situation[]>([]);
    //estado para controle de carregamento 
    const [loading, setLoading] = useState<boolean>(true);
    //estado para controle de erros 
    const[error,setError] = useState<string | null> (null); 
    //estado para controle de sucesso
    const[success, setSuccess] = useState <string | null> (null)
    // pagina atual
    const [currentPage, setCurrentPage] = useState <number> (1);
    //pagina final
    const [lastPage, setLastPage] = useState <number> (10);

    //função para buscar as situações da API 
    const fetchSituations = async (page:number) => {
        try {
            //inicia o carregamento
            setLoading(true)
            //fazer a solicitação para a API
            const response = await instance.get(`/situation?page=${page}&limit=6`)
            console.log(response);
            //atualizar o estado com os dados da API 
            setSituations(response.data.data)
            //atualizar a pagina atual
            setCurrentPage(response.data.currentPage)
            //terminar o carrgamento 
            setLoading(false)

        }catch(error){
            setError("erro ao carregar as situações")
            //Termina o carregamento em caso de erro
            setLoading(false);
        }
    } 
    //atualizar a lista de registros apos apagar o registro
    const handleSuccess = () => {
        fetchSituations(currentPage)
    }
    //Hooh para buscar os dados na primeira renderização
    useEffect(() => {
        //recuperar a mensagem salva no sessionStorange
        const menssage = sessionStorage.getItem("successMenssage")
            if (menssage){
                //atribui a mensagem 
                setSuccess(menssage)
                sessionStorage.removeItem("successMenssage")
            }
        //buscar os dados ao carregar a página
        fetchSituations (currentPage)

    }, [currentPage])// recarregar os dados sempre que a pagina for alterada

    return(
        <ProtectedRoute>
            <div className="bg-dashboard">
                <NavBar/>
                <div className="flex">
                    <SideBar/>
                           
                    {/*exibir o carregando*/}
                    {loading && <LoadingSpinner/>}
                    {/*exibe erro, se houver*/}
                    <AlertMessage type="error" message={error}/>
                    {/* exibir mensagem de sucesso */}
                    <AlertMessage type="success" message={success}/>

                    {!loading && !error && (
                        // <!-- conteudo principal -->
                        <main className="main-content">
                            {/* <!-- titulo a trilha de navegação --> */}
                            <div className="content-wrapper">
                                <div className="content-header">
                                    <h2 className="content-title">Situações</h2>
                                    <nav className="breadcrumb">
                                        <a href="/deshboard" className=" breadcrumb-link">Dashboard</a>
                                        <span>/</span>
                                        <span>Situações</span>
                                    </nav>
                                </div>
                            </div>

                            {/* inicio do conteudo da tabela + titulo + navegação */}
                            <div className="content-box">
                                <div className="content-box-header">
                                    <h3 className="content-box-title">Listar Situações</h3>
                                    <div className="content-box-btn">
                                        <a href={`/situation/create`}className="btn-success aling-icon-btn">
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
                                                <th className="table-header">Nome Situation</th>
                                                <th className="table-header center">Ações</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {situations.map((situation) => (
                                                <tr key ={situation.id} className="table-row-body"> 
                                                    <td className="table-body">{situation.id}</td>
                                                    <td className="table-body">{situation.nameSituation}</td>
                                                    <td className="table-body table-actions">
                                                        <Link href={`/situation/${situation.id}`} className="btn-primary">Visualizar</Link>
                                                        <Link href={`/situation/edit?id=${situation.id}`} className="btn-warning hidden md:inline-block">
                                                        Editar</Link>
                                                        <DeleteButton 
                                                            id={String(situation.id)}
                                                            route="situation"
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