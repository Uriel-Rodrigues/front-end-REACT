'use client'
import instance from "@/services/api";
import Menu from "@/app/components/Menu";
import {useEffect ,useState } from "react";
import { useSearchParams } from "next/navigation";
import * as yup from "yup"
import Link from "next/link";
//importar componente para tornar rota protegida (precisa estar logado)
import ProtectedRoute from "@/app/components/ProtectedRoute";

//cria esquema de validação com yup
const schema = yup.object().shape({
    name: yup.string().required("o campo com o nome do usuario é obrigatorio").min(3,"o nome do usuario deve ter no minimo 3 caracteres"),
    email: yup.string().email().required("o campo com email do usuario é obrigatorio"),
    situation: yup.number().required("o campo de situação do usuatio é obrigatorio ")
})

export default function User () {
    //estado para capturar o id que vem pela URL
    const id = Number(useSearchParams().get("id"))
    //estado para guardar o nome do usuario 
    const [userName, setUserName] = useState <string> ("")
    //estado para guardar o email do usuario 
    const [userEmail, setUserEmail] = useState <string> ("")
    //estado para guardar a situação do usuario 
    const [situationUser, setSituationUser] = useState <string> ("")
    //estado para controle de carregamento 
    const [loading, setLoading] = useState <boolean> (false)
    //estado para controle de erro 
    const [error, setError] = useState <string | null> (null)
    //estado para controle de sucesso 
    const [success, setSuccess] = useState <string | null> (null)

    //função para capturar os dados presentes no bando 
    const fetchUser = async () => {
        try {
            //iniciar o carregamento 
            setLoading(true)
            //fazer a requizição
            const response = await instance.get(`/user/${id}`)
            //salvar os dados retornados pela requisição 
            setUserName(response.data.name)
            setUserEmail(response.data.email)
            setSituationUser(response.data.situation) 
        }
        catch(error: any) {
            //verificar se existe erro de requisição
            if(error.response && error.response.data && error.response.data.menssage){
                //retornar menssagem caso seja um array de menssagens 
                if(Array.isArray(error.response.data.menssage)) {
                    setError(error.response.data.menssage.join(" - "))
                }
                else{
                    setError(error.response.data.menssage)
                }
            }
        }
        finally{
            //terminar carregamento 
            setLoading(false)
        }
    }
    //função para atualçizar os dados do usuario 
    const handleSubmit = async (event:React.FormEvent) => {
        //impedir de atualizar a pagina
        event.preventDefault()
        //iniciar o carregamento
        setLoading(true)
        //limpar erro anterior
        setError(null)
        //limpar sucesso anterior
        setSuccess(null) 

        try {
            //encaminhar dados para a api
            const response = await instance.put(`/user/${id}`, {
                name: userName,
                email: userEmail,
                situation: situationUser
            })
            //encaminar menssagem de sucesso 
            setSuccess(response.data.menssage || "Dados do Usuario Atualizados com Sucesso")
            //limpar campos do formulario
            setUserName("")
            setUserEmail("")
            setSituationUser("")

        }
        catch(error:any){
            //verificar se existe erro na requisição
            if(error.response && error.response.data && error.response.data.menssage) {
                //verificar se é uma array de menssagens
                if(Array.isArray(error.response.data.menssage)){
                    setError(error.response.data.menssage.join(" - "))
                }
                else{
                    //mostrar menssagem de erro caso seja somente uma menssagem 
                    setError(error.response.data.menssage)
                }
            }
        }
        finally{
            //terminar o carregamento
            setLoading(false)
        }
    }
    //hook ára tualizar a pagina quando o id mudar
    useEffect (()=> {
        if(id){
            fetchUser()
        }
    }, [id]) //atualçizar quando o id mudar 

    return (
        <ProtectedRoute>
            <Menu /><br />
            <Link href={`/user/list`}>Listar</Link>

            <h1>Editar dados do Usuario</h1>
            <br />

            {/* mostrar carregando */}
            {loading && <p>carregando...</p>}
            {/* mostrar menssagem de erro caso tenha */}
            {error && <p>{error}</p>}
            {/* mostrar menssagem de sucesso caso tenha */}
            {success && <p>{success}</p>}
            {/* mostrar dados do formulario caso tudo bem  */}
            {!loading && !error && (
                <div>
                    <form onSubmit={handleSubmit}>
                        <label htmlFor="userName">Nome: </label>
                        <input
                            id="userName" 
                            type="text" 
                            value={userName}
                            placeholder="Novo Nome de Usuario"
                            onChange={(e) => setUserName(e.target.value)}
                        /> <br />
                        <label htmlFor="userEmail">Email: </label>
                        <input
                            id="userEmail" 
                            type="text" 
                            value={userEmail}
                            placeholder="Novo Email de Usuario"
                            onChange={(e) => setUserEmail(e.target.value)}
                        /> <br />
                        <label htmlFor="situationUser">situação do usuario: </label>
                        <input 
                            id="situationUser" 
                            type="number"
                            value={situationUser}
                            placeholder="Situação do Usuario"
                            onChange={(e) => setSituationUser(e.target.value)} 
                        /><br />
                        <button type="submit" disabled = {loading}>
                            {loading ? "Enviando..." : "Salvar"}
                        </button>
                    </form>
                </div>
            )}
        </ProtectedRoute>
    )
}
