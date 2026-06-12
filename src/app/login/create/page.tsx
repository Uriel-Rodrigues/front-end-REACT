'use client'

import Menu from "@/app/components/Menu";
// Importa a instância do axios configurada para fazer requisições para a API
import instance from "@/services/api";
// Importar o componente para criar link
import Link from "next/link";
// Importar a dependência para validar o formulário.
import * as yup from "yup"
// Importa hooks do React para usar o estado "useState"
import { useState } from "react";
//importar componente para tornar rota protegida (precisa estar logado)
import ProtectedRoute from "@/app/components/ProtectedRoute";
// importar hook para manipulação da navegação do usuario
import { useRouter } from "next/navigation";
// Importar o adaptador para conectar react-hook-form com bibliotecas de validação como Yup
import { yupResolver } from '@hookform/resolvers/yup';
// Importar a função para gerenciar o formulário
import { useForm } from "react-hook-form";

//montar schema de validação com yup
const schema = yup.object().shape({
    name: yup.string().required("o nome do usuario é obrigatorio").min(2,"o campo precisa de no minimo 3 caracteres"),
    email: yup.string().email().required("o campo de email do usuario é obrigatorio"),
    password: yup.string().required("o campo de senha é obrigatorio!"),
    situation: yup.string().required("o campo de situação do usuario é necessario")
})

//estados para controle e armazenamento de dados 
export default function UserCreate () {
    //instanciar o router 
    const router = useRouter()
    //estado para controle de loading
    const [loading, setLoading] = useState <boolean> (false)
    //estado para controle de erro 
    const [error, setError] = useState <string | null> (null)
    //estado para controle de sucesso
    const [success, setSuccess] = useState <string | null> (null)

    //iniciar o formulario com validações
    const {register, handleSubmit, formState: {errors}, reset} = useForm({
        resolver: yupResolver(schema)})

    //fazer para enviar dados para a API
    const onSubmit = async (data: {name:string, email:string, password:string, situation?:string}) => {
        //senao for encaminhado situação vai definir como "1"
        data.situation = data.situation ?? "1"

        //iniciar o carregamento 
        setLoading(true)
        //limpar possivel erro anterior
        setError(null)
        //limpar possivel sucesso anterior
        setSuccess(null)
        try {
            //fazer requisição para api e enviar os dados
            const response = await instance.post(`/user/create`, data)

            //mostrar menssagem de sucesso 
            setSuccess(response.data.menssage || "novo usuario cadastrado com sucesso")

            //limpar o campo do formulario 
            reset()

            //salvar mensagem no sessionStarage antes de redirecionar para login
            sessionStorage.setItem("succcessMenssage", response.data.menssage || "Novo usuario cadastrado com sucesso" )

            //redirecionar usuario 
            router.push("/login")
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
        <div className="bg-dashboard">
            {/* <!-- Navbar --> */}
            <nav className="navbar">
                <div className="navbar-container">
                    <button id="toggleSidebar" className="menu-button">
                        <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
                        </svg>
                    </button>
                    <div className="user-container">
                        <div className="relative">
                            {/* <!-- Dropdown --> */}
                            <button id="userDropdowButton" className="dropdown-button">
                                Usuario
                                <svg className="ml-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fill-rule="evenodd"
                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                        clip-rule="evenodd" />
                                </svg>
                            </button>
                            {/* <!-- conteudo do dropdown --> */}
                            <div id="dropdownContent" className="dropdown-content hidden">
                                <a href="#" className="dropdown-item ">Perfil</a>
                                <a href="#" className="dropdown-item ">Sair</a>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="flex">
                {/* <!-- sidBar --> */}
                <aside id="sidebar" className="sidebar">
                    <div className="sidebar-container">
                        <button id="closeSidebar" className="sidebar-close-button">
                            <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        <div className="sidebar-header">
                            <span className="sidebar-title"> Uriel</span>
                        </div>
                        <nav className="sidebar-nav">
                            <a href="/src/adm/dashboard.html" className="sidebar-link">
                                {/* <!-- svg home (Heroicons) --> */}
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-4">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                                </svg>
                                <span>Dashboard</span>
                            </a>
                            
                            <a href="/src/adm/users/list.html" className="sidebar-link active">
                                {/* <!-- svg user-group (Heroicons) --> */}
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-4">

                                    <path stroke-linecap="round" stroke-linejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
                                </svg>
                                <span>Usuarios</span>
                            </a>

                            <a href="/src/adm/alert/alert.html" className="sidebar-link">
                                {/* <!-- svg exclamation-triangle (Heroicons) --> */}
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-4">

                                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                                </svg>
                                <span>Alertas</span>
                            </a>

                            <a href="/src/adm/button/button.html" className="sidebar-link ">
                                {/* <!-- svg cursor-arrow-ripple (Heroicons) --> */}
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-4">

                                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.042 21.672 13.684 16.6m0 0-2.51 2.225.569-9.47 5.227 7.917-3.286-.672Zm-7.518-.267A8.25 8.25 0 1 1 20.25 10.5M8.288 14.212A5.25 5.25 0 1 1 17.25 10.5" />
                                </svg>
                                <span>Botões</span>
                            </a>

                            <a href="/src/index.html" className="sidebar-link">
                                {/* <!-- svg arrow-left-start-on-rectangle (Heroicons) --> */}
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-4">

                                    <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15" />
                                </svg>
                                <span>Sair</span>
                            </a>
                        </nav>
                    </div>
                </aside>

                {/* conteudo principal */}
                <main className="main-content">
                    {/* <!-- titulo a trilha de navegação --> */}
                    <div className="content-wrapper">
                        <div className="content-header">
                            <h2 className="content-title">Usuarios</h2>
                            <nav className="breadcrumb">
                                <a href="/src/adm/dashboard.html" className="breadcrumb-link">Dashboard</a>
                                <span>/</span>
                                <a href="/src/adm/users/list.html" className="breadcrumb-link">Usuários</a>
                                <span>/</span>
                                <span>Cadastrar</span>
                            </nav>
                        </div>
                    </div>

                    <div className="content-box">
                        <div className="content-box-header">
                            <h3 className="content-box-title">Cadastrar Usuários</h3>
                            <div className="content-box-btn">
                                <a href="/src/adm/users/list.html" className="btn-info aling-icon-btn">
                                    {/* <!-- svg list-bullet (Heroicons) --> */}
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-4">

                                        <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                                    </svg>
                                    <span>Listar</span>
                                </a>
                            </div>
                        </div>
                        {/* mostrar carregando  */}
                        {loading && <p>carregando...</p>}
                        {/* mostrar erro caso tenha  */}
                        {error && <p>{error}</p>}
                        {/* mostrar sucesso caso ocorra */}
                        {success && <p>{success}</p>}

                        {/* mostrar formulario de cadastro caso tudo ok */}
                        {!loading && !error && (
                            
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div className="mb-4">
                                    <label htmlFor="name" className="form-label">Nome: </label>
                                    <input 
                                        id="name"
                                        type="text"
                                        placeholder="Nome completo do usúario"
                                        {...register('name')}
                                        className="form-input"
                                    /> <br />
                                </div>
                                <div>
                                    <label htmlFor="userEmail" className="form-label">E-mail: </label>
                                    <input 
                                        id="userEmail"
                                        type="email" 
                                        placeholder="E-mail do usúario" 
                                        {...register('email')} 
                                        className="form-input"
                                    /> <br />
                                    <label htmlFor="password" className="form-label">Senha: </label>
                                    <input
                                        id="password" 
                                        type="password" 
                                        placeholder="Senha - minimo 6 caracteres"
                                        {...register('password')}
                                        className="form-input"
                                    /> <br />
                                </div>
                                <div>
                                    <label htmlFor="situation" className="form-label">Situação do Usuario: </label>
                                    <input
                                        id="situation" 
                                        type="string"
                                        placeholder="situação do Usuario"
                                        {...register('situation')}
                                        className="form-input"
                                    />
                                </div> <br />
                                <button type="submit" disabled ={loading} className="btn-success">
                                    {loading ? "enviando" : "Cadastrar" }
                                </button>      
                            </form>
                        )}
                    </div>
                </main>
            </div>
        </div>
    )
}