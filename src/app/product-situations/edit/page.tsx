'use client'
import Menu from "@/app/components/Menu";
import instance from "@/services/api";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

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
        <div>
            <Menu /> <br />
            <Link href={`/product-situations/list`}>List</Link>

            <h1>Editar Situação de Produto</h1>
            {/* verificar carregamento */}
            {loading && <p>carregando...</p>}
            {/* verificar mensagem de erro caso tenha */}
            {error && <p>{error}</p>}
            {/* verificarmenssagem de sucesso */}
            {success && <p>{success}</p>}

           <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="productSituation">situação do produto: </label>
                    <input 
                        type="text"
                        id="productSituation"
                        value={nameSituation}
                        placeholder="situação de produto"
                        onChange={(e) => setNameSituation(e.target.value)}
                    />
                </div>
                <button type="submit" disabled ={loading}>
                    {loading ? "enviando..." : "Salvar" }
                </button>
           </form>

        </div>
    )
}