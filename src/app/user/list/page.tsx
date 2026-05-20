'use client'

import instance from "@/services/api";
import Menu from "@/app/components/Menu";
import Pagination from "@/app/components/Pagination";
import DeleteButton from "@/app/components/DeleteButton";
import { useEffect, useState } from "react";
import Link from "next/link";
//importar componente para tornar rota protegida (precisa estar logado)
import ProtectedRoute from "@/app/components/ProtectedRoute";

//interface para a entidade usur
interface User {
    id: number,
    name: string,
    email: string,
    createdAt: string,
    updatedAt:string
}

export default function UserList () {
    //estado para armazenar dados do usuario
    const [user, setUser] = useState <User[]> ([]) 
    //estado para controle de carregamento 
    const [loading, setLoading] = useState <boolean> (false) 
    //estado para controle de erro 
    const [error, setError] = useState <string | null> (null)
    //estado para controle de sucesso 
    const [success, setSuccess] = useState <string | null> (null)
    //estado para paginaçãopagina atual
    const [currentPage, setCurrentPage] = useState <number> (1)
    //estado para paginação ultima pagina
    const [lastPage, setLastPage] = useState <number> (10)   

    //função para captar dados da API

    const fetchUser = async (page:number) => {
        try{
            //iniciar carregamento 
            setLoading(true)
            //fazer requisição
            const response = await instance.get(`/user?page=${page}&limit=1`)
            //atualizar o estado de dados do usuario
            setUser(response.data.data)
            //atualizar o estado da pagina atual
            setCurrentPage(response.data.currentPage)
            //terminar o carregamento 
            setLoading(false)
        }
        catch(error) {
            //exibir menssagem de erro 
            setError("erro ao listar cadastros de usuarios")
            //terminar carregamento 
            setLoading(false)

        }
        finally{
            //terminar carregamento 
            setLoading(false)
        }
    } 
    //atualiza alista de registros da pagina apos apagar unm registro 
    const handleSuccess = () => {
        fetchUser(currentPage)
    }
    //hook para buscar dados da primeira renderizção 
    useEffect( () =>{
        //recuperar mensagem de deletado com sucesso 
        const menssage = sessionStorage.getItem("successMenssage")
            if (menssage){
                setSuccess(menssage)
                sessionStorage.removeItem("successMenssage")
            }
        //recarregar a pagina
        fetchUser(currentPage)
    },[currentPage])//stualiza sempre que mudar de pagina

    return (
        <ProtectedRoute>
            <Menu /> <br />

            <Link href={`/user/create`}>Cadastrar</Link>< br/>

            < br/><h1>Lista de usuarios </h1> <br />

            {/* mostrar carregamento */}
            {loading && <p>carregando...</p>}
            {/* mostrar erro caso tenha */}
            {error && <p>{error}</p>}
            {/* mostrar sucesso caso tenha */}
            {success && <p>{success}</p>}

            {/* mostrar tabela com registros */}
            {!loading && !error && (
                <table>
                    <thead>
                        <tr>
                            <th>Id -</th>
                            <th>- Nome -</th>
                            <th>- email</th>
                        </tr>
                    </thead>
                    <tbody>
                        {user.map((user) => (
                            <tr key = {user.id}>
                                <td>{user.id} -</td>
                                <td>- {user.name} -</td>
                                <td>- {user.email} -</td>
                                <td>- 
                                    <Link href={`/user/${user.id}`}>Visualizar</Link> 
                                    <Link href={`/user/edit?id=${user.id}`}>- editar -</Link> 
                                    <DeleteButton
                                        id={String(user.id)}
                                        route="user"
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
        </ProtectedRoute>

    )
}