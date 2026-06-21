'use client'
import Menu from "@/app/components/Menu";
import instance from "@/services/api";
import Link from "next/link";
import DeleteButton from "@/app/components/DeleteButton";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
//importa hooks para manipular a navegação do usuario
import { useRouter } from "next/navigation";
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

interface User {
    id: number
    name:string
    email: string
    situation: { nameSituation: string }
    createdAt: string
    updatedAt: string 
}

export default function UserDetails () {
    //estado para armazenar o dados quem vem pela URL
    const {id} = useParams()
    //istanciar router para poder usar
    const router = useRouter()

    //estado para quardar dados do usuario 
    const [user, setUser] = useState <User | null> (null)
    //estado para controle de carregamento 
    const [loading, setLoading] = useState <boolean> (false)
    //estado para controle de erro
    const [error,setError] = useState <string | null> (null)
    //estado para controle de sucesso 
    const [success, setSuccess] = useState <string | null> (null)

    //função para fazer a requisição para a API
    const fetchUser = async (id: string) => {
        try{
            //começar o carregamento 
            setLoading(true)
            //fazer a requizição 
            const response = await instance.get(`/user/${id}`)
            //atualizar os dados usuario com as respostas da requisição
            setUser(response.data)
            //termina carregamento
            setLoading(false) 
        }
        catch (error: any){
            //verificar se existe erro de requisição
            if (error.respose && error.response.data && error. response.data.menssage){
                //atualizarmenssgem de erro 
                setError(error.response.data.menssage)
            }
        }
        finally{
            //termina o carregamento 
            setLoading(false)
        }
    }

    //hook para ecaminhar o usuario para outra pagina caso deletar usuario 
    const handleSuccess = () => {
        //armazenar mensagem de sucesso apos deletar
        sessionStorage.setItem ("successMenssage", "Usuario Deletado com Sucesso!")
        //encaminhar usuario para outra pagina apos delerar usuario
        router.push(`/user/list`)
    }

    //hook para buscar os dados quato o id mudar 
    useEffect (()=> {
        if(id){
            //garantir que o id seja uma istring
            const userId = Array.isArray(id) ? id[0] : id 

            fetchUser(userId)
        }
    }, [id])// recarregar quando o id mudar

    return(
        <ProtectedRoute>
            <div className="bg-dashboard">
                <NavBar/>
                <div className="flex">
                    <SideBar/>

                    {/* mostrar estatos de carregando */}
                    {loading && <LoadingSpinner/>}
                    {/* mostrar errro caso tenha */}
                    <AlertMessage type="error" message={error}/>
                    {/* mostrar menssagem de sucessso caso tenha */}
                    <AlertMessage type="success" message={success}/>
                    {/* mostrar detalhes do usuario caso tudo correto */}
                    {!error && !loading && (

                        // <!-- conteudo principal -->
                        <main className="main-content">
                            {/* <!-- titulo a trilha de navegação --> */}
                            <div className="content-wrapper">
                                <div className="content-header">
                                    <h2 className="content-title">Usuários</h2>
                                    <nav className="breadcrumb">
                                        <a href="/deshboard" className=" breadcrumb-link">Dashboard</a>
                                        <span>/</span>
                                        <a href="/src/adm/users/list.html" className=" breadcrumb-link">Usuários </a>
                                        <span>/</span>
                                        <span>Visualizar</span>
                                    </nav>
                                </div>
                            </div>
                            
                            {/* inicio conteudo princpal + botoes + titulo */}
                            <div className="content-box">
                                <div className="content-box-header">
                                    <h3 className="content-box-title">Visualizar Usuários</h3>
                                    <div className="content-box-btn">
                                        <a href={`/user/list`} className="btn-info aling-icon-btn">
                                            {/* <!-- svg list-bullet (Heroicons) --> */}
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4">

                                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                                            </svg>
                                            <span>Listar</span>
                                        </a>
                                        <a href={`/user/edit`} className="btn-warning aling-icon-btn ">
                                            {/* <!-- svg pencil-square (Heroicons) --> */}
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                            </svg>
                                            <span>Editar</span>
                                        </a>
                                        {/* aplicando botão "deletar" */}
                                        <DeleteButton
                                            id = {String(user?.id)}
                                            route = "user"
                                            onSuccess={handleSuccess}
                                            setError={setError}
                                            setSuccess={setSuccess}
                                        />
                                    </div>
                                </div>

                                {/* "detalhes do usuarios" */}
                                <div className="detail-box">

                                    <div className="mb-1">
                                        <span className="detail-content">ID: {user?.id}</span>
                                    </div>

                                    <div className="mb-1">
                                        <span className="detail-content">Nome: {user?.name}</span>
                                    </div>

                                    <div className="mb-1">
                                        <span className="detail-content">Email: {user?.email}</span>
                                    </div>

                                    <div className="mb-1">
                                        <span className="detail-content">Situação: {user?.situation?.nameSituation} </span>
                                    </div>

                                    <div className="mb-1">
                                        <span className="detail-content">Criado em: {user?.createdAt ? new Date(user.createdAt).toLocaleString() : "Data não disponível"}</span>
                                    </div>

                                    <div className="mb-1">
                                        <span className="detail-content">Editado em: {user?.updatedAt ? new Date(user.updatedAt).toLocaleString() : "Data não disponível"}</span>
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