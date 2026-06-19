'use client'
import instance from "@/services/api";
import Menu from "@/app/components/Menu";
import {useEffect ,useState } from "react";
import { useSearchParams } from "next/navigation";
import * as yup from "yup"
import Link from "next/link";
//importar componente para tornar rota protegida (precisa estar logado)
import ProtectedRoute from "@/app/components/ProtectedRoute";
//importar o componente sid bar
import SideBar from "@/app/components/SideBar";
//importar o componente nav bar
import NavBar from "@/app/components/NavBar";

//cria esquema de validação com yup
const schema = yup.object().shape({
    name: yup.string().required("o campo com o nome do usuario é obrigatorio").min(3,"o nome do usuario deve ter no minimo 3 caracteres"),
    email: yup.string().email().required("o campo com email do usuario é obrigatorio"),
    situation: yup.number().required("o campo de situação do usuatio é obrigatorio ")
})

export default function User () {
    //estado para capturar o id que vem pela URL
    const id = Number(useSearchParams().get("id"))
    //estado para guardar o nome do usuario 
    const [userName, setUserName] = useState <string> ("")
    //estado para guardar o email do usuario 
    const [userEmail, setUserEmail] = useState <string> ("")
    //estado para guardar a situação do usuario 
    const [situationUser, setSituationUser] = useState <string> ("")
    //estado para controle de carregamento 
    const [loading, setLoading] = useState <boolean> (false)
    //estado para controle de erro 
    const [error, setError] = useState <string | null> (null)
    //estado para controle de sucesso 
    const [success, setSuccess] = useState <string | null> (null)

    //função para capturar os dados presentes no bando 
    const fetchUser = async () => {
        try {
            //iniciar o carregamento 
            setLoading(true)
            //fazer a requizição
            const response = await instance.get(`/user/${id}`)
            //salvar os dados retornados pela requisição 
            setUserName(response.data.name)
            setUserEmail(response.data.email)
            setSituationUser(response.data.situation) 
        }
        catch(error: any) {
            //verificar se existe erro de requisição
            if(error.response && error.response.data && error.response.data.menssage){
                //retornar menssagem caso seja um array de menssagens 
                if(Array.isArray(error.response.data.menssage)) {
                    setError(error.response.data.menssage.join(" - "))
                }
                else{
                    setError(error.response.data.menssage)
                }
            }
        }
        finally{
            //terminar carregamento 
            setLoading(false)
        }
    }
    //função para atualçizar os dados do usuario 
    const handleSubmit = async (event:React.FormEvent) => {
        //impedir de atualizar a pagina
        event.preventDefault()
        //iniciar o carregamento
        setLoading(true)
        //limpar erro anterior
        setError(null)
        //limpar sucesso anterior
        setSuccess(null) 

        try {
            //encaminhar dados para a api
            const response = await instance.put(`/user/${id}`, {
                name: userName,
                email: userEmail,
                situation: situationUser
            })
            //encaminar menssagem de sucesso 
            setSuccess(response.data.menssage || "Dados do Usuario Atualizados com Sucesso")
            //limpar campos do formulario
            setUserName("")
            setUserEmail("")
            setSituationUser("")

        }
        catch(error:any){
            //verificar se existe erro na requisição
            if(error.response && error.response.data && error.response.data.menssage) {
                //verificar se é uma array de menssagens
                if(Array.isArray(error.response.data.menssage)){
                    setError(error.response.data.menssage.join(" - "))
                }
                else{
                    //mostrar menssagem de erro caso seja somente uma menssagem 
                    setError(error.response.data.menssage)
                }
            }
        }
        finally{
            //terminar o carregamento
            setLoading(false)
        }
    }
    //hook ára tualizar a pagina quando o id mudar
    useEffect (()=> {
        if(id){
            fetchUser()
        }
    }, [id]) //atualçizar quando o id mudar 

    return (
        <ProtectedRoute>
            <div className="bg-dashboard">
                <NavBar/>
                <div className="flex">
                    <SideBar/>
      
                    {/* mostrar carregando */}
                    {loading && <p>carregando...</p>}
                    {/* mostrar menssagem de erro caso tenha */}
                    {error && <p>{error}</p>}
                    {/* mostrar menssagem de sucesso caso tenha */}
                    {success && <p>{success}</p>}
                    {/* mostrar dados do formulario caso tudo bem  */}
                    {!loading && !error && (
                        <main className="main-content">
                            {/* <!-- titulo a trilha de navegação --> */}
                            <div className="content-wrapper">
                                <div className="content-header">
                                    <h2 className="content-title">Usuários</h2>
                                    <nav className="breadcrumb">
                                        <a href="/deshboard" className="breadcrumb-link">Dashboard</a>
                                        <span>/</span>
                                        <a href={`/user/list`} className="breadcrumb-link">Usuários</a>
                                        <span>/</span>
                                        <span>Editar</span>
                                    </nav>
                                </div>
                            </div>

                            <div className="content-box">
                                <div className="content-box-header">
                                    <h3 className="content-box-title">Editar Usuários</h3>
                                    <div className="content-box-btn">
                                        <a href={`/user/list`} className="btn-info aling-icon-btn">
                                            {/* <!-- svg list-bullet (Heroicons) --> */}
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4">

                                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                                            </svg>
                                            <span>Listar</span>
                                        </a>

                                        <a href={`/user/${id}`} className="btn-primary aling-icon-btn">
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
                                    <div className="mb-4">
                                        <label htmlFor="userName" className="form-label">Nome: </label>
                                        <input
                                            id="userName" 
                                            type="text" 
                                            value={userName}
                                            placeholder="Novo Nome de Usuario"
                                            onChange={(e) => setUserName(e.target.value)}
                                            className="form-input"
                                        /> 
                                    </div>
                                    <div className="mb-4">
                                        <label htmlFor="userEmail" className="form-label">Email: </label>
                                        <input
                                            id="userEmail" 
                                            type="text" 
                                            value={userEmail}
                                            placeholder="Novo Email de Usuario"
                                            onChange={(e) => setUserEmail(e.target.value)}
                                            className="form-input"
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label htmlFor="situationUser" className="form-label">situação do usuario: </label>
                                        <input 
                                            id="situationUser" 
                                            type="number"
                                            value={situationUser}
                                            placeholder="Situação do Usuario"
                                            onChange={(e) => setSituationUser(e.target.value)} 
                                            className="form-input"
                                        />
                                    </div>

                                    <button type="submit" disabled = {loading} className="btn-success">
                                        {loading ? "Editando..." : "Salvar"}
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
