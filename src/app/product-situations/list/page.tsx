'use client'

import { useEffect, useState } from "react"
import Link from "next/link"
//imorta o componente services
import instance from "@/services/api"
//importação componente de aginação
import Pagination from "@/app/components/Pagination"
//importa o componente menu
import Menu from "@/app/components/Menu"
//importar componente para deletar
import DeleteButton from "@/app/components/DeleteButton"

//definir INTERFACE para resposta da API
interface Situation {
    id: number,
    name: string,
    createdAt: string,
    updateAt: string
}

export default function SituationList (){
    //estado para armazenar as situações de produto
    const[situation, setSituations] = useState <Situation[]>([])
    //estado para controle de carregamento
    const[loading, setLoading] = useState <boolean>(true)
    //estado para controle de erros
    const[error, setError] = useState <string | null> (null)
    //estado para controle de sucesso 
    const [success,setSuccess] = useState <string | null> (null)
    //pagina atual 
    const[currentPage, setCurrentPage] = useState<number>(1)
    //pagina final
    const[lastPage, setLastPage] = useState<number>(10) 


    //função para buscar as situações de produto da API
    const fatchSituation = async (page:number) =>{
        try{
            //inicia o carregamento
            setLoading(true)
            //solicitação para a API
            const response = await instance.get(`/product-situations?page=${page}&limit=1`)
            //atualiza o estado com os dados para da API
            setSituations(response.data.data)
            //atualiza a pagina atual
            setCurrentPage(response.data.currentPage)
            //termina o carregamento
            setLoading(false)
        }
        catch(error) {
            setError ("error ao carregar as situações de produto")
            //termina o carregamento em caso de erro
            setLoading(false)
        }
    }

    //atualizar os dados apos deletar
    const handleSuccess = () => {
        fatchSituation(currentPage)
    }

    //Hook para buscar os dados na primeira renderização 
    useEffect (() => {
        //uscar dados da primeira renderização pagina [id]
        const menssage = sessionStorage.getItem("successMenssage")
        //atribui os dados a menssagem e sucesso 
        if(menssage){
            setSuccess(menssage)
            //remove os dados para não aparecer mais de uma vez
            sessionStorage.removeItem("successMenssage")
        }
        //buscar os dados
        fatchSituation(currentPage)
    },[currentPage]) //recarreca os dados sempre que a pagina muda 

    return (
        <div>
            <Menu/>
            <br/>
            <Link href={`/product-situations/create`}>Cadastrar</Link>
            
            <h1>Listar as Situações de produto</h1>
            {/* exibir o carregando...*/}
            {loading && <p>Carregando...</p>}
            {/* exibir mensagem de sucesso caso tenha */}
            {success && <p style={{color:"#3CB648"}}>{success}</p>}
            {/* exibe erros se ouver*/}
            {error && <p style={{color:"#AB080B"}}>{error}</p>}
            {!loading && !error && (
                <table> 
                    <thead>
                        <tr>
                            <th>ID </th>
                            <th>Nome da Situação</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {situation.map((situation) => (
                            <tr key = {situation.id}>
                                <th>{situation.id}</th>
                                <th>{situation.name}</th>
                                <td>
                                    <Link href= {`/product-situations/${situation.id}`}>Visualizar</Link> 
                                    - <Link href={`/product-situations/edit?id=${situation.id}`}>Editar</Link>
                                    - 
                                    <DeleteButton 
                                        id= {String(situation.id)}
                                        route="product-situations"
                                        onSuccess={handleSuccess}
                                        setError={setError}
                                        setSuccess={setSuccess}
                                    /></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            {/* usar componentes de paginação */}
            <br />
            <Pagination 
                currentPage={currentPage}
                lastPage={ lastPage}
                onPageChange={setCurrentPage}
            />
        </div>
    )
}