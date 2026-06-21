'use client'

import Menu from "@/app/components/Menu";
import instance from "@/services/api";
import Link from "next/link";
import * as yup from "yup"
import { useState } from "react";
//importar componente para tornar rota protegida (precisa estar logado)
import ProtectedRoute from "@/app/components/ProtectedRoute";
import { useRouter } from "next/navigation";
//importar o componente sid bar
import SideBar from "@/app/components/SideBar";
//importar o componente nav bar
import NavBar from "@/app/components/NavBar";
// importar animação spinner para carregando
import LoadingSpinner from "../../components/LoadingSpinner";
//importar o componente para apresentar os alertas
import AlertMessage from "../../components/AlertMessage";

//montar schema de validação com yup
const schema = yup.object().shape({
    name: yup.string().required("o nome do usuario é obrigatorio").min(2,"o campo precisa de no minimo 3 caracteres"),
    email: yup.string().email().required("o campo de email do usuario é obrigatorio"),
    situation: yup.number().required("o campo de situação do usuario é necessario")
})

//estados para controle e armazenamento de dados 
export default function UserCreate () {
    //instanciar o router 
    const router = useRouter
    //estado para guardar nome do usuario
    const [name, setName] = useState <string> ("") 
    //estado para guardar email do usuario 
    const [email, setEmail] = useState <string> ("")
    //estada para armazenar a senha
    const [userPassword,setUserPassword] = useState <string> ("")
    //estado para armazenar a situação
    const [situation, setSituation] = useState <string> ("")
    //estado para controle de loading
    const [loading, setLoading] = useState <boolean> (false)
    //estado para controle de erro 
    const [error, setError] = useState <string | null> (null)
    //estado para controle de sucesso
    const [success, setSuccess] = useState <string | null> (null)

    //fazer para enviar dados para a API
    const handleSubmit = async (event:React.FormEvent) => {
        //impedir o formulario de recarregar
        event.preventDefault()
        //iniciar o carregamento 
        setLoading(true)
        //limpar possivel erro anterior
        setError(null)
        //limpar possivel sucesso anterior
        setSuccess(null)
        try {
            //enviar dados para a api
            const response = await instance.post(`/user/create`, {
                name: name,
                email:email,
                password: userPassword,
                situation: situation
            })

            //mostrar menssagem de sucesso 
            setSuccess(response.data.menssage || "novo usuario cadastrado com sucesso")

            //limpar o campo do formulario 
            setName("")
            setEmail("")
            setUserPassword("")
        }
        catch (error: any) {
            //verificar se existe erro de requisição
            if(error.response & error.response.data && error.response.data.menssage) {
                //retornar menssagem de erro em caso de ser um array
                if(Array.isArray(error.response.data.menssage)){
                    setError(error.response.data.menssage.join(" - "))
                }
                else{
                    //mostrar menssagem caso não seja um array
                    setError(error.response.data.menssage)
                }
            }
        }
        finally{
            //terminar carregamento 
            setLoading(false)
        }
    } 

    return (
        <ProtectedRoute>
            <div className="bg-dashboard">
                <NavBar/>
                <div className="flex">
                    <SideBar/>
                    {/* mostrar carregando  */}
                    {loading && <LoadingSpinner/>}
                    {/* mostrar erro caso tenha  */}
                    <AlertMessage type="error" message={error}/>
                    {/* mostrar sucesso caso ocorra */}
                    <AlertMessage type="success" message={success}/>

                    {/* mostrar formulario de cadastro caso tudo ok */}
                    {!loading && !error && (

                        // consteudo principal
                        <main className="main-content">
                            {/* <!-- titulo a trilha de navegação --> */}
                            <div className="content-wrapper">
                                <div className="content-header">
                                    <h2 className="content-title">Usuarios</h2>
                                    <nav className="breadcrumb">
                                        <a href="/deshboard" className="breadcrumb-link">Dashboard</a>
                                        <span>/</span>
                                        <a href={`/user/list`} className="breadcrumb-link">Usuários</a>
                                        <span>/</span>
                                        <span>Cadastrar</span>
                                    </nav>
                                </div>
                            </div>

                            <div className="content-box">
                                <div className="content-box-header">
                                    <h3 className="content-box-title">Cadastrar Usuários</h3>
                                    <div className="content-box-btn">
                                        <a href={`/user/list`} className="btn-info aling-icon-btn">
                                            {/* <!-- svg list-bullet (Heroicons) --> */}
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4">

                                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                                            </svg>
                                            <span>Listar</span>
                                        </a>
                                    </div>
                                </div>

                                <form onSubmit={handleSubmit}>
                                 
                                    <div className="mb-4">
                                        <label htmlFor="userName" className="form-label">Nome do Usuario: </label>
                                        <input 
                                            id="userName"
                                            type="text"
                                            value={name}
                                            placeholder="nome do usuario"
                                            onChange={(e) => setName(e.target.value)}
                                            className="form-input"
                                        />
                                    </div> 

                                    <div className="mb-4">
                                        <label htmlFor="userEmail" className="form-label">Email do usuario: </label>
                                        <input 
                                            id="userEmail"
                                            type="email" 
                                            value={email}
                                            placeholder="email do usuario" 
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="form-input" 
                                        /> 
                                    </div>

                                    <div className="mb-4">
                                        <label htmlFor="userPassword" className="form-label">Senha: </label>
                                        <input
                                            id="userPassword" 
                                            type="string" 
                                            value={userPassword}
                                            placeholder="senha"
                                            onChange={(e) => setUserPassword(e.target.value)}
                                            className="form-input"

                                        /> 
                                    </div>

                                    <div className="mb-4">
                                        <label htmlFor="userSituation" className="form-label">Situação do Usuario: </label>
                                        <input
                                            id="userSituation" 
                                            type="number"
                                            value={situation}
                                            placeholder="situação do cliente"
                                            onChange={(e) => setSituation(e.target.value)}
                                            className="form-input"
                                        />
                                    </div>

                                    <button type="submit" disabled ={loading} className="btn-success">
                                        {loading ? "Cadastrando..." : "Cadastrar" }
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