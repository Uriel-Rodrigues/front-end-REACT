'use client'
//importa componente menu
import Menu from "@/app/components/Menu"
//importa componente instance
import instance from "@/services/api"
//importar o componente para deletar
import DeleteButton from "@/app/components/DeleteButton"
//importa biblioteca para links
import Link from "next/link"
//importa hooks do react para usar o estado e os efeitos colaterais 
import { useEffect, useState } from "react"
//importa hook para capturar elementos da URL
import { useParams } from "next/navigation"
//hook pra manipular navegação com usuario 
import { useRouter } from "next/navigation"
//impotar componente para proteger rotas
import ProtectedRoute from "@/app/components/ProtectedRoute";
//importa o componente para a navbar
import NavBar from "@/app/components/NavBar";
//importa o componente para a SidBar
import SideBar from "@/app/components/SideBar";
// importar animação spinner para carregando
import LoadingSpinner from "../../components/LoadingSpinner";
//importar o componente para apresentar os alertas
import AlertMessage from "../../components/AlertMessage";

interface situation {
    id: number,
    name: string,
    createdAt: string,
    updatedAt: string
}

const situationDetails = ()=> {
    //usar params para poder acessar parametros da URL
    const {id} = useParams()
    //instanciar o router para poder usar
    const router = useRouter()
    //estado para armazenar situação
    const [situation, setSituation] = useState <situation | null> (null)  
    //estado para controle de carregamento 
    const [loading,setLoading] = useState <boolean> (true) 
    //estado para controle de erro
    const [error, setError] = useState <string | null> (null) 
    //estado para controle de sucesso
    const [success, setSuccess] = useState <string | null> (null)  

    //função para buscar situação da API
    const fetchSituationDetails = async (id:string) =>{
        try{
            //inicia o carregamento 
            setLoading(true)
            //fazer a requisição da API
            const response = await instance.get(`/product-situations/${id}`)
            //atualiza o estado com o dados da api
            setSituation(response.data)
            //termina o carregamento
            setLoading(false)
        }
        catch (error: any){
            //verificar se o erro contem mensagens de validação
            if (error.response && error.response.data) {
                
                //retornar mensagem de erro retornada da API
                setError(error.response.data.menssage)
            }
            else{
                //cria mensagem generica de erro
                setError("erro ao carregar os detalhes da situação")
            }
            //termina o carregamento
            setLoading(false)

        }
    }
    //funcção para menssagem de sucesso e controlar fruxo so usuario 
    const handleSuccess = () => {
        sessionStorage.setItem("successMenssage", "situação de produto deletada com sucesso")
        //redirecionar o usuario para pagina list
        router.push(`/product-situations/list`)

    }
    //hook para buscar os dados quando o id estiver disponivel
    useEffect(() =>{
        if(id) {
            const situationId = Array.isArray(id) ? id[0]: id  
            //buscar dados da situação se o id estiver disponivel
            fetchSituationDetails(situationId)
        }
    }, [id]) //recarrega sempre que situação mudar

    return (
        <ProtectedRoute>
            <div className="bg-dashboard">
                <NavBar/>
                <div className="flex">
                    <SideBar/>

                    <Link href={`/product-situations/list`} >List</Link>



                    {/* exibir o carregando */}
                    {loading && <LoadingSpinner/>}
                    {/* exibir erro se houver */}
                    <AlertMessage type="error" message={error}/>
                    {/* exibir sucesso se houver */}
                    <AlertMessage type="success" message={success}/>
                    {/* imprimir os detalhes do produto */}
                    {situation && !loading && !error && (

                        // <!-- conteudo principal -->
                        <main className="main-content">
                            {/* <!-- titulo a trilha de navegação --> */}
                            <div className="content-wrapper">
                                <div className="content-header">
                                    <h2 className="content-title">Situação do Produto</h2>
                                    <nav className="breadcrumb">
                                        <a href="/src/adm/dashboard.html" className=" breadcrumb-link">Dashboard</a>
                                        <span>/</span>
                                        <a href={`/product-situations/list`} className=" breadcrumb-link">situação do produto </a>
                                        <span>/</span>
                                        <span>Visualizar</span>
                                    </nav>
                                </div>
                            </div>

                            <div className="content-box">
                                <div className="content-box-header">
                                    <h3 className="content-box-title">Visualizar situação do produto</h3>
                                    <div className="content-box-btn">
                                        <a href={`/product-situations/list`} className="btn-info aling-icon-btn">
                                            {/* <!-- svg list-bullet (Heroicons) --> */}
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4">

                                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                                            </svg>
                                            <span>Listar</span>
                                        </a>
                                        <a href={`/product-situations/edit`} className="btn-warning aling-icon-btn ">
                                            {/* <!-- svg pencil-square (Heroicons) --> */}
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                            </svg>
                                            <span>Editar</span>
                                        </a>
                                        < DeleteButton
                                            id= {String(situation.id)}
                                            route="product-situations"
                                            onSuccess={handleSuccess}
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
                                        <span className="detail-content">nome situação-produto:{situation.name}</span>
                                    </div>
                                    <div className="mb-1">
                                        <span className="detail-content">createdAt:{new Date(situation.createdAt).toLocaleString()}</span>
                                    </div>
                                    <div className="mb-1">
                                        <span className="detail-content">updatedAt:{new Date(situation.updatedAt).toLocaleString()}</span>
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
export default situationDetails