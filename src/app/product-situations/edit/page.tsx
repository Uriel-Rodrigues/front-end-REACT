'use client'
import Menu from "@/app/components/Menu";
import instance from "@/services/api";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
//importar componente para tornar rota protegida
import ProtectedRoute from "@/app/components/ProtectedRoute";
//importar o componente sid bar
import SideBar from "@/app/components/SideBar";
//importar o componente nav bar
import NavBar from "@/app/components/NavBar";
// importar animação spinner para carregando
import LoadingSpinner from "../../components/LoadingSpinner";
//importar o componente para apresentar os alertas
import AlertMessage from "../../components/AlertMessage";

export default function situation(){
    //capturar o id encaminhado pela URL
    const id = Number(useSearchParams().get("id"))
    //estado para guarda situação
    const [nameSituation, setNameSituation] = useState <string> ("") 
    //estado para controle de carregamento 
    const [loading, setLoading] = useState <boolean> (false)
    //estado para controle de erro
    const [error, setError] = useState <string | null> (null)
    //estado para controle de sucesso
    const [success, setSuccess] = useState <string | null> (null)

    // função que vai fazer a requisição e salvar os dados retornados
    const fetchSituationDetails = async () => {
        try {
            //iniciar o carregamento 
            setLoading (true)
            //fazer a requisição para a API
            const response = await instance.get(`/product-situations/${id}`)
            //atualiar os dados com o valor retornado 
            setNameSituation(response.data.name)
        }
        catch (error: any) {
            //verificar se existe erro de validação 
            if (error.response && error.response.data && error.response.data.menssage){
                //verificar e retornar mensagem caso seja um array
                if(Array.isArray(error.response.data.menssage)){
                    setError(error.response.data.menssage.join(" - "))

                }
                else{
                    setError(error.response.data.menssage)
                }
            }
            else{
                //menssagem generica de erro
                setError("erro ao editar situação de produto")
            }
        }
        finally {
            //parar o carregamento
            setLoading(false)
        }
    }
    //fução para encaminhar os dados alterados para a API
    const handleSubmit = async (event: React.FormEvent) => {
        //evitar que a pagina recarregue apos eviar o formulario
        event.preventDefault()
        //iniciar o carregar 
        setLoading(true)
        //limpar o erro anterior
        setError(null)
        //limpar o acerto anterior
        setSuccess(null) 

        try {
            // fazer a requisição para a API e enviar os dados
            const response = await instance.put(`/product-situations/${id}`,{
                name: nameSituation
            })

            //mostrar mensagem de sucesso
            setSuccess (response.data.menssage || "situação de produto alterado com sucesso")

            //limpar o campo do formulario
            setNameSituation("")
        }
        catch(error: any){
            //verificar se existe erro de validação
            if(error.response && error.response.data && error.response.data.menssage) {
                //verificar se o erro é um array de mensagens
                if(Array.isArray(error.response.data.menssage)){
                    setError(error.response.data.menssage.join(" - "))
                }
                else {
                    //menssagem generica de erro caso seja somente 1 menssagem
                    setError(error.response.data.menssage)
                }
            }
            else{
                //mansagem generica de erro
                setError ("erro ao editar a situação")
            }
        }
        finally {
            //parar o carregamento 
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

    return (
        <ProtectedRoute>
            <div className="bg-dashboard">
                <NavBar/>
                <div className="flex">
                    <SideBar/>

                    {/* verificar carregamento */}
                    {loading && <LoadingSpinner/>}
                    {/* verificar mensagem de erro caso tenha */}
                    <AlertMessage type="error" message={error}/>
                    {/* verificarmenssagem de sucesso */}
                    <AlertMessage type="success" message={success}/>

                    {/* conteudo principal */}
                    <main className="main-content">
                        {/* <!-- titulo a trilha de navegação --> */}
                        <div className="content-wrapper">
                            <div className="content-header">
                                <h2 className="content-title">Situação do Produto</h2>
                                <nav className="breadcrumb">
                                    <a href="/deshboard" className="breadcrumb-link">Dashboard</a>
                                    <span>/</span>
                                    <a href={`/product-situations/list`} className="breadcrumb-link">Situação-Produto</a>
                                    <span>/</span>
                                    <span>Editar</span>
                                </nav>
                            </div>
                        </div>

                        <div className="content-box">
                            <div className="content-box-header">
                                <h3 className="content-box-title">Editar situação de produto</h3>
                                <div className="content-box-btn">
                                    <a href={`/product-situations/list`} className="btn-info aling-icon-btn">
                                        {/* <!-- svg list-bullet (Heroicons) --> */}
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4">

                                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                                        </svg>
                                        <span>Listar</span>
                                    </a>

                                    <a href={`/product-situations/${id}`} className="btn-primary aling-icon-btn">
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
                                    <label htmlFor="productSituation" className="form-label">situação do produto: </label>
                                    <input 
                                        type="text"
                                        id="productSituation"
                                        value={nameSituation}
                                        placeholder="situação de produto"
                                        onChange={(e) => setNameSituation(e.target.value)}
                                        className="form-input"
                                    />
                                </div>
                                <button type="submit" disabled ={loading} className="btn-success">
                                    {loading ? "enviando..." : "Salvar" }
                                </button>
                            </form>
                        </div>
                    </main>
                </div>
            </div>
        </ProtectedRoute>
    )
}