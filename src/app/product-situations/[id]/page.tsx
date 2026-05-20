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
import ProtectedRoute from "@/app/components/ProtectedRoute";

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
            <Menu /> <br />

            <Link href={`/product-situations/list`} >List</Link>
            <h1>detalhes da situação do produto</h1>
            {situation && !loading && !error && (
                < DeleteButton
                    id= {String(situation.id)}
                    route="product-situations"
                    onSuccess={handleSuccess}
                    setError={setError}
                    setSuccess={setSuccess} 
                />
            )}

            {/* exibir o carregando */}
            {loading && <p>carregando...</p>}
            {/* exibir erro se houver */}
            {error && <p style={{color:"#AB080B"}}>{error}</p>}

            {/* imprimir os detalhes do produto */}
            {situation && !loading && !error && (
                <div>
                    <p>ID:{situation.id}</p>
                    <p>nome situação-produto:{situation.name}</p>
                    <p>createdAt:{new Date(situation.createdAt).toLocaleString()}</p>
                    <p>updatedAt:{new Date(situation.updatedAt).toLocaleString()}</p>
                </div>
            )}
        </ProtectedRoute>
    )
}
export default situationDetails