'use client'

import instance from "@/services/api"
import Menu from "@/app/components/Menu"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
//importa o componente para deletar os registros
import DeleteButton from "@/app/components/DeleteButton"
//hook para manipular a navegação do usuario 
import { useRouter } from "next/navigation"
//importar componente para tornar rota protegida (precisa estar logado)
import ProtectedRoute from "@/app/components/ProtectedRoute";
//importar componente de NavBar
import NavBar from "@/app/components/NavBar"
//imprtar componente de SidBar
import SideBar from "@/app/components/SideBar"
// importar animação spinner para carregando
import LoadingSpinner from "../../components/LoadingSpinner";
//importar o componente para apresentar os alertas
import AlertMessage from "../../components/AlertMessage";

interface Situation {
    id: number
    nameSituation: string
    createdAt: string
    updatedAt: string 

}

const situationDetails = () => {
    //useParams para podermos acessar os parametro id da URL
    const {id} = useParams()
    //intanciar o objeto router
    const router =useRouter()

    //estado para armazenar a situação 
    const [situation, setSituation] = useState < Situation | null> (null)
    //estado para controle de carregamento
    const [loading, setLoading] = useState <boolean> (true)
    //estado para controle de erro
    const [error, setError] = useState <string | null> (null)
    //estado para controle de sucesso
    const [success, setSuccess] = useState <string | null> (null)

    //função para buscar a situação da API
    const fetchSituationDetails = async (id: string) => {
        try{
            //inicia o carregando
            setLoading(true)
            //fazer a requisição da API
            const response = await instance.get(`/situation/${id}`)
            console.log(response.data)
            //Atualizar o estado com os dados da API
            setSituation(response.data);
            //terminar o carregamento 
            setLoading(false)
        }
        catch (error:any){
            //verificar se o erro contem mensagens de validação 
            if(error.response && error.response.data){
                
                //se for uma única mensagem atribuir a 
                // mensagem de erro retornada da API
                setError(error.response.data.menssage)
                
            }else{
                //criar a mensagem generica de erro 
                setError("erro ao carregar os detalhes da situação")
            }

            //termina o carregamento em caso de erro
            setLoading(false)
        }
    }
    //redirecionar para a pagina listar apos apagar o registro
    const hendleSuccess = () =>{
        //salvar a menssagem no sessionStorange antes de redirecionar
        sessionStorage.setItem("successMenssage", "Registro apagado com sucesso.")

        //redireciona para a pagina de listar 
        router.push(`/situation/list`)
    }

    //hook para buscar os dados quando o id estiver disponivel
    useEffect (() => {
        if(id){
            //garantir que id seja uma string
            const situationId = Array.isArray(id) ? id[0]: id;
            //buscar os dados da situação se o id estiver disponivel
            fetchSituationDetails(situationId);
        }

    }, [id]); //reccarregar os daos quando o id mudar
    return (
        <ProtectedRoute>
            <div className="bg-dashboard">
                <NavBar/>
                <div className="flex">
                    <SideBar/>


                    {/* exibir o carregando */}
                    {loading && <LoadingSpinner/>}
                    {/* exibnir erro se ouver */}
                    <AlertMessage type="error" message={error}/>
                    {/* exibir mensagem de sucesso se ouver */}
                    <AlertMessage type="success" message={success}/>
                    {/* imprimir os detalhes do registro */}
                    {situation && !loading && !error && (

                        // conteudo principal
                        <main className="main-content">

                            {/* <!-- titulo a trilha de navegação --> */}
                            <div className="content-wrapper">
                                <div className="content-header">
                                    <h2 className="content-title">Situações</h2>
                                    <nav className="breadcrumb">
                                        <a href="/deshboard" className=" breadcrumb-link">Dashboard</a>
                                        <span>/</span>
                                        <a href={`/situation/list`} className=" breadcrumb-link">Situações </a>
                                        <span>/</span>
                                        <span>Visualizar</span>
                                    </nav>
                                </div>
                            </div>

                            <div className="content-box">
                                <div className="content-box-header">
                                    <h3 className="content-box-title">Visualizar Situação</h3>
                                    <div className="content-box-btn">
                                        <a href="/src/adm/users/list.html" className="btn-info aling-icon-btn">
                                            {/* <!-- svg list-bullet (Heroicons) --> */}
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4">

                                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                                            </svg>
                                            <span>Listar</span>
                                        </a>
                                        <a href="/src/adm/users/edit.html" className="btn-warning aling-icon-btn ">
                                            {/* <!-- svg pencil-square (Heroicons) --> */}
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                            </svg>
                                            <span>Editar</span>
                                        </a>
                                        <DeleteButton 
                                            id ={String(situation.id)}
                                            route="situation"
                                            onSuccess={hendleSuccess}
                                            setError={setError}
                                            setSuccess={setSuccess}
                                        />
                                    </div>
                                </div>
                                <div className="detail-box">
                                    <div className="mb-1">
                                        <span className="detail-content">ID:{situation.id}</span>
                                    </div>
                                    <div className="mb-1">
                                        <span className="detail-content">Nome da situação:{situation.nameSituation}</span>
                                    </div>
                                    <div className="mb-1">
                                        <span className="detail-content">Criado em :{new Date(situation.createdAt).toLocaleString()}</span>
                                    </div>
                                    <div className="mb-1">
                                        <span className="detail-content">Editado em :{new Date(situation.updatedAt).toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                        </main>
                    )}
                </div>
            </div>
        </ProtectedRoute>
    )
};
export default situationDetails;