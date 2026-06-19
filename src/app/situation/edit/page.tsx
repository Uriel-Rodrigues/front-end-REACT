'use client'

//importando componente e usabilidades
import Menu from "@/app/components/Menu"
import instance from "@/services/api"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
//importar componente para tornar rota protegida (precisa estar logado)
import ProtectedRoute from "@/app/components/ProtectedRoute";
//importar o componente sid bar
import SideBar from "@/app/components/SideBar";
//importar o componente nav bar
import NavBar from "@/app/components/NavBar";

export default function Situation() {
    //capturar parametro ID encaminhado na URL
    const id = Number(useSearchParams().get("id"))    
    //estado prar armazenar situação
    const [nameSituation, setNameSituation] = useState <string> ("")
    //estado para controle de carregamento 
    const [loading, setLoading] = useState <boolean> (false)
    //estado para controle de erro
    const [error, setError] = useState <string | null> (null)
    //estado para controle de acerto
    const [success, setSuccess] = useState <string | null> (null)

    //função para capiturar os dados ja existentes na API
    const fetchSituationDetails = async () => {
        try {
            //inicia o carregamento
            setLoading(true)
            //faz uma requisição para a API
            const response = await instance.get(`/situation/${id}`)
            //atualiza o campo com os dados retornados
            setNameSituation(response.data.nameSituation)
        }
        catch (error: any) {
            //verificar se existe algum erro de requisição
            if(error.response && error.response.data && error.response.data.menssage){
                //mostrar erro caso seja um array
                if (Array.isArray(error.response.data.menssage)){
                    setError(error.response.data.menssage.join(" - "))
                }
                else{
                    //mostrar mensagem de erro no caso de ser somente uma
                    setError(error.response.data.menssage)
                }
            }
            else{
                //exibir menssagem generica de erro
                setError("erro ao editar situação tente novamente")
            }     
        }
        finally{
            //parar o carregamento
            setLoading(false)
        }
    }
    //função para encaminhar os dados atualizados para a API
    const handleSubmit = async (event:React.FormEvent) =>{
        //evitar carregameno da pagina
        event.preventDefault()
        //iniciar carregamento 
        setLoading(true)
        //limpar erro anterior
        setError(null)
        //limpar acerto anterior
        setSuccess(null)

        try {
            //fazer a requisição para a api e enviar os dados
            const response = await instance.put(`/situation/${id}`, {
                nameSituation: nameSituation
            })
            //exibir mensagem de sucesso 
            setSuccess(response.data.menssage || "situação atualizada com sucesso")
            
            //limpar o campo do formulario
            setNameSituation("")
        }
        catch(error: any){
            //verificar se existe erro de validação
            if (error.response && error.response.data && error.response.data.menssage){
                //retornar se o erro e um array de mensagens 
                if(Array.isArray(error.response.data.menssage)){
                    setError(error.response.data.menssage.join(" - "))
                }
                else{
                    //exibir error coso seja somente uma menssagem
                    setError(error.response.data.menssage)
                }
            }
            else{
                //exibir menssagem generica de erro
                setError("erro ao ediar a situação, tentar novamente")
            }
        }
        finally{
            //parar carregamento 
            setLoading(false)
        }

    } 
    //hook para atualizar a pagina quando mudar o componente
    useEffect(() => {
        if(id){
            //buscar dados da situação quando o id estiver disponivel
            fetchSituationDetails()
        }
    },[id])//recarrega a pagina quando o id mudar 

    return(
        <ProtectedRoute>
            <div className="bg-dashboard">
                <NavBar/>
                <div className="flex">
                    <SideBar/>

                    {/* exibir carregamento */}
                    {loading && <p>Carregando...</p>}
                    {/* exibir erros caso tenha */}
                    {error && <p style={{color:"#AB080B"}}>{error}</p>}
                    {/* exibir mensagem de sucesso se ouver */}
                    {success && <p style = {{color:"#3CB648"}}>{success}</p>} 

                    {/* conteudo principal */}
                    <main className="main-content">
                        {/* <!-- titulo a trilha de navegação --> */}
                        <div className="content-wrapper">
                            <div className="content-header">
                                <h2 className="content-title">Situação</h2>
                                <nav className="breadcrumb">
                                    <a href="/deshboard" className="breadcrumb-link">Dashboard</a>
                                    <span>/</span>
                                    <a href={`/situation/list`} className="breadcrumb-link">Situação</a>
                                    <span>/</span>
                                    <span>Editar</span>
                                </nav>
                            </div>
                        </div>

                        <div className="content-box">
                            <div className="content-box-header">
                                <h3 className="content-box-title">Editar Situação</h3>
                                <div className="content-box-btn">
                                    <a href={`/situation/list`} className="btn-info aling-icon-btn">
                                        {/* <!-- svg list-bullet (Heroicons) --> */}
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4">

                                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                                        </svg>
                                        <span>Listar</span>
                                    </a>

                                    <a href={`/situation/${id}`} className="btn-primary aling-icon-btn">
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
                                    <label htmlFor="nameSituation" className="form-label">Nome da Situação: </label>
                                    <input 
                                        type="text"
                                        id="nameSituation"
                                        value={nameSituation}
                                        placeholder="Nome da Situação"
                                        onChange={(e) => setNameSituation(e.target.value)}
                                        className="form-input"
                                    />
                                </div>
                                <button type="submit" disabled={loading} className="btn-success">
                                    {loading ? "Editando..." : "Salvar"}
                                </button>
                            </form>
                        </div>
                    </main>
                </div>
            </div>
        </ProtectedRoute>
    )
}  