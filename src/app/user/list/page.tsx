'use client'

import instance from "@/services/api";
import Menu from "@/app/components/Menu";
import Pagination from "@/app/components/Pagination";
import DeleteButton from "@/app/components/DeleteButton";
import { useEffect, useState } from "react";
//importar hook usado para meniulçar a navegação do usuario 
import { useRouter } from "next/navigation"
import Link from "next/link";
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

//interface para a entidade usur
interface User {
    id: number,
    name: string,
    email: string,
    createdAt: string,
    updatedAt:string
}

export default function UserList () {
    //istanciar o objeto router 
    const router= useRouter()
    //estado para armazenar dados do usuario
    const [user, setUser] = useState <User[]> ([]) 
    //estado para controle de carregamento 
    const [loading, setLoading] = useState <boolean> (false) 
    //estado para controle de erro 
    const [error, setError] = useState <string | null> (null)
    //estado para controle de sucesso 
    const [success, setSuccess] = useState <string | null> (null)
    //estado para paginaçãopagina atual
    const [currentPage, setCurrentPage] = useState <number> (1)
    //estado para paginação ultima pagina
    const [lastPage, setLastPage] = useState <number> (10)   

    //função para captar dados da API
    const fetchUser = async (page:number) => {
        try{
            //iniciar carregamento 
            setLoading(true)
            //fazer requisição
            const response = await instance.get(`/user?page=${page}&limit=6`)
            //atualizar o estado de dados do usuario
            setUser(response.data.data)
            //atualizar o estado da pagina atual
            setCurrentPage(response.data.currentPage)
            //terminar o carregamento 
            setLoading(false)
        }
        catch(error) {
            //exibir menssagem de erro 
            setError("erro ao listar cadastros de usuarios")
            //terminar carregamento 
            setLoading(false)

        }
        finally{
            //terminar carregamento 
            setLoading(false)
        }
    } 
    //atualiza alista de registros da pagina apos apagar unm registro 
    const handleSuccess = () => {
        fetchUser(currentPage)
    }
    //hook para buscar dados da primeira renderizção 
    useEffect( () =>{
        //recuperar mensagem de deletado com sucesso 
        const menssage = sessionStorage.getItem("successMenssage")
            if (menssage){
                setSuccess(menssage)
                sessionStorage.removeItem("successMenssage")
            }
        //recarregar a pagina
        fetchUser(currentPage)
    },[currentPage])//stualiza sempre que mudar de pagina

    const handleLogaut = () => {
        //remover o token do local storage
        localStorage.removeItem("token")
        //redireciona para a pagina login
        router.push("/login")
    }

    return (
        <ProtectedRoute>
            <div className="bg-dashboard">
                {/* <!-- Navbar --> */}
                <NavBar/>
                <div className="flex">
                    {/* <!-- sidBar --> */}
                    <SideBar/>
                
                    {/* mostrar carregamento */}
                    {loading && <LoadingSpinner/>}
                    {/* mostrar erro caso tenha */}
                    <AlertMessage type="error" message={error}/>
                    {/* mostrar sucesso caso tenha */}
                    <AlertMessage type="success" message={success}/>

                    {/* mostrar tabela com registros */}
                    {!loading && !error && (
                    // <!-- conteudo principal -->
                        <div className="main-content">
                            {/* <!-- titulo a trilha de navegação --> */}
                            <div className="content-wrapper">
                                <div className="content-header">
                                    <h2 className="content-title">Usuarios</h2>
                                    <nav className="breadcrumb">
                                        <a href="/deshboard" className=" breadcrumb-link">Dashboard</a>
                                        <span>/</span>
                                        <span>Usuarios</span>
                                    </nav>
                                </div>
                            </div>
                            {/* inicio do conteudo da tabela + titulo + navegação */}
                            <div className="content-box">
                                <div className="content-box-header">
                                    <h3 className="content-box-title">Listar Usuários</h3> 
                                    <div className="content-box-btn">
                                        <a href={`/user/create`} className="btn-success aling-icon-btn">
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
                                                <th className="table-header">Id </th>
                                                <th className="table-header">Nome </th>
                                                <th className="table-header hidden lg:table-cell">email</th>
                                                <th className="table-header center">Ações</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {user.map((user) => (
                                                <tr key = {user.id} className="table-row-body">
                                                    <td className="table-body">{user.id}</td>
                                                    <td className="table-body">{user.name}</td>
                                                    <td className="table-body hidden lg:table-cell">{user.email} </td>
                                                    <td className="table-body table-actions">
                                                        <Link href={`/user/${user.id}`} className="btn-primary">Visualizar</Link> 
                                                        <Link href={`/user/edit?id=${user.id}`}className="btn-warning hidden md:inline-block">editar</Link> 
                                                        <DeleteButton  
                                                            id={String(user.id)}
                                                            route="user"
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
                        </div>  
                    )}
                </div>  
            </div>
        </ProtectedRoute>

    )
}