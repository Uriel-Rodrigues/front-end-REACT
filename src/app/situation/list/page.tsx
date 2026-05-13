'use client'
//importar o componente para criar LINK
import Link from "next/link";

//importa componente menu
import Menu from "@/app/components/Menu";

import Pagination from "@/app/components/Pagination";
//importa a instancia do axios configurada para fazer requisições para a API
import instance from "@/services/api";

//importa hooks do react para usar o estado e os efeitos colaterais
import { useEffect, useState } from "react";
//importa o componente de delete 
import DeleteButton from "@/app/components/DeleteButton";

//definir tipos para a resposta da API (interface)
interface Situation {
    id:number,
    nameSituation:string,
    createdAt: string,
    updatedAt:string
}

export default function SituationList(){
    //estado para armazenar as situações
    const [situations,setSituations] = useState<Situation[]>([]);
    //estado para controle de carregamento 
    const [loading, setLoading] = useState<boolean>(true);
    //estado para controle de erros 
    const[error,setError] = useState<string | null> (null); 
    //estado para controle de sucesso
    const[success, setSuccess] = useState <string | null> (null)
    // pagina atual
    const [currentPage, setCurrentPage] = useState <number> (1);
    //pagina final
    const [lastPage, setLastPage] = useState <number> (10);

    //função para buscar as situações da API 
    const fetchSituations = async (page:number) => {
        try {
            //inicia o carregamento
            setLoading(true)
            //fazer a solicitação para a API
            const response = await instance.get(`/situation?page=${page}&limit=1`)
            console.log(response);
            //atualizar o estado com os dados da API 
            setSituations(response.data.data)
            //atualizar a pagina atual
            setCurrentPage(response.data.currentPage)
            //terminar o carrgamento 
            setLoading(false)

        }catch(error){
            setError("erro ao carregar as situações")
            //Termina o carregamento em caso de erro
            setLoading(false);
        }
    } 
    //atualizar a lista de registros apos apagar o registro
    const handleSuccess = () => {
        fetchSituations(currentPage)
    }
    //Hooh para buscar os dados na primeira renderização
    useEffect(() => {
        //recuperar a mensagem salva no sessionStorange
        const menssage = sessionStorage.getItem("successMenssage")
            if (menssage){
                //atribui a mensagem 
                setSuccess(menssage)
                sessionStorage.removeItem("successMenssage")
            }
        //buscar os dados ao carregar a página
        fetchSituations (currentPage)

    }, [currentPage])// recarregar os dados sempre que a pagina for alterada

    return(
        <div>
            <Menu /><br />
            <Link href={`/situation/create`}>Cadastrar</Link> <br />
        
            <h1>Listar as Situações</h1> <br>
            </br>
            {/*exibir o carregando*/}
            {loading && <p>Carregando...</p>}
            {/*exibe erro, se houver*/}
            {error && <p>{error}</p>}
            {/* exibir mensagem de sucesso */}
            {success && <p style={{color:"#3CB648"}}>{success}</p>}

            {!loading && !error && (
                <table>
                    <thead>
                        <tr>
                            <th>ID--------</th>
                            <th>Nome Situation</th>
                            <th>--------------------------Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {situations.map((situation) => (
                            <tr key ={situation.id}> 
                                <td>{situation.id}</td>
                                <td>{situation.nameSituation}</td>
                                <td>
                                    <Link href={`/situation/${situation.id}`} >Visualizar</Link>{` `}
                                     - <Link href={`/situation/edit?id=${situation.id}`}>
                                     Editar</Link> {` `} 
                                    <DeleteButton 
                                        id={String(situation.id)}
                                        route="situation"
                                        onSuccess={handleSuccess}
                                        setError={setError}
                                        setSuccess={setSuccess} 
                                    />
                                    </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            {/* paginação */}
            <Pagination
                currentPage={currentPage}
                lastPage={lastPage}
                onPageChange={setCurrentPage}
            />
        </div>
    )
}