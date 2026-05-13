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
        <div>
            <Menu/><br />
            <Link href={`/situation/list`}>Listar</Link>
            {situation && !loading && !error &&(
                <DeleteButton 
                    id ={String(situation.id)}
                    route="situation"
                    onSuccess={hendleSuccess}
                    setError={setError}
                    setSuccess={setSuccess}
                />
            )}

            <h1>detalhes da situação</h1>

            {/* exibir o carregando */}
            {loading && <p>carregando...</p>}
            {/* exibnir erro se ouver */}
            {error && <p style={{color:"#AB080B"}}>{error}</p> }
            {/* exibir mensagem de sucesso se ouver */}
            {success && <p style={{color:"#3CB648"}}>{success}</p>}
            {/* imprimir os detalhes do registro */}
            {situation && !loading && !error && (
                <div>
                    <p>ID:{situation.id}</p>
                    <p>Nome da situação:{situation.nameSituation}</p>
                    <p>Criado em :{new Date(situation.createdAt).toLocaleString()}</p>
                    <p>Editado em :{new Date(situation.updatedAt).toLocaleString()}</p>
                </div>
            )}
        </div>
    )
};
export default situationDetails;