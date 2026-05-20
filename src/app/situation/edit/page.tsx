'use client'

//importando componente e usabilidades
import Menu from "@/app/components/Menu"
import instance from "@/services/api"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
//importar componente para tornar rota protegida (precisa estar logado)
import ProtectedRoute from "@/app/components/ProtectedRoute";

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
            <Menu /><br />
            <Link href = {`/situation/list`}>List</Link>

            <h1>Editar situalção </h1>
            {/* exibir carregamento */}
            {loading && <p>Carregando...</p>}
            {/* exibir erros caso tenha */}
            {error && <p style={{color:"#AB080B"}}>{error}</p>}
            {/* exibir mensagem de sucesso se ouver */}
            {success && <p style = {{color:"#3CB648"}}>{success}</p>} 

            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="nameSituation">Nome da Situação: </label>
                    <input 
                        type="text"
                        id="nameSituation"
                        value={nameSituation}
                        placeholder="Nome da Situação"
                        onChange={(e) => setNameSituation(e.target.value)}
                         
                    />
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? "Enviado..." : "Salvar"}
                </button>
            </form>

        </ProtectedRoute>
    )
}  