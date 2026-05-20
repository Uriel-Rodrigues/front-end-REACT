'use client'
import Menu from "@/app/components/Menu";
import instance from "@/services/api";
import Link from "next/link";
import DeleteButton from "@/app/components/DeleteButton";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
//importar componente para tornar rota protegida (precisa estar logado)
import ProtectedRoute from "@/app/components/ProtectedRoute";

interface User {
    id: number
    name:string
    email: string
    createdAt: string
    updatedAt: string 
}

export default function UserDetails () {
    //estado para armazenar o dados quem vem pela URL
    const {id} = useParams()
    //istanciar router para poder usar
    const router = useRouter()

    //estado para quardar dados do usuario 
    const [user, setUser] = useState <User | null> (null)
    //estado para controle de carregamento 
    const [loading, setLoading] = useState <boolean> (false)
    //estado para controle de erro
    const [error,setError] = useState <string | null> (null)
    //estado para controle de sucesso 
    const [success, setSuccess] = useState <string | null> (null)

    //função para fazer a requisição para a API
    const fetchUser = async (id: string) => {
        try{
            //começar o carregamento 
            setLoading(true)
            //fazer a requizição 
            const response = await instance.get(`/user/${id}`)
            //atualizar os dados usuario com as respostas da requisição
            setUser(response.data)
            //termina carregamento
            setLoading(false) 
        }
        catch (error: any){
            //verificar se existe erro de requisição
            if (error.respose && error.response.data && error. response.data.menssage){
                //atualizarmenssgem de erro 
                setError(error.response.data.menssage)
            }
        }
        finally{
            //termina o carregamento 
            setLoading(false)
        }
    }

    //hook para ecaminhar o usuario para outra pagina caso deletar usuario 
    const handleSuccess = () => {
        //armazenar mensagem de sucesso apos deletar
        sessionStorage.setItem ("successMenssage", "Usuario Deletado com Sucesso!")
        //encaminhar usuario para outra pagina apos delerar usuario
        router.push(`/user/list`)
    }

    //hook para buscar os dados quato o id mudar 
    useEffect (()=> {
        if(id){
            //garantir que o id seja uma istring
            const userId = Array.isArray(id) ? id[0] : id 

            fetchUser(userId)
        }
    }, [id])// recarregar quando o id mudar

    return(
        <ProtectedRoute>
            <Menu /> <br />

            <Link href={`/user/list`}> Listar</Link> <br />
            {/* aplicando botão "deletar" */}
            <DeleteButton
                id = {String(user?.id)}
                route = "user"
                onSuccess={handleSuccess}
                setError={setError}
                setSuccess={setSuccess}
            />

            <br />
            <h1>Detalhes do usuario</h1> <br />
            {/* mostrar estatos de carregando */}
            {loading && <p>carregado...</p>}
            {/* mostrar errro caso tenha */}
            {error && <p>{error}</p>}
            {/* mostrar menssagem de sucessso caso tenha */}
            {success && <p>{success}</p>}
            {/* mostrar detalhes do usuario caso tudo correto */}
            {!error && !loading && (
                <div>
                    <p>ID: {user?.id}</p>
                    <p>Nome: {user?.name}</p>
                    <p>Email: {user?.email}</p>
                </div>
            )}
        </ProtectedRoute>
    )

}