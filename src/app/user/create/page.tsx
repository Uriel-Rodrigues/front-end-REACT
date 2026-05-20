'use client'

import Menu from "@/app/components/Menu";
import instance from "@/services/api";
import Link from "next/link";
import * as yup from "yup"
import { useState } from "react";
//importar componente para tornar rota protegida (precisa estar logado)
import ProtectedRoute from "@/app/components/ProtectedRoute";

//montar schema de validação com yup
const schema = yup.object().shape({
    name: yup.string().required("o nome do usuario é obrigatorio").min(2,"o campo precisa de no minimo 3 caracteres"),
    email: yup.string().email().required("o campo de email do usuario é obrigatorio"),
    situation: yup.number().required("o campo de situação do usuario é necessario")
})

//estados para controle e armazenamento de dados 
export default function UserCreate () {
    //estado para guardar nome do usuario
    const [name, setName] = useState <string> ("") 
    //estado para guardar email do usuario 
    const [email, setEmail] = useState <string> ("")
    //estada para armazenar a senha
    const [userPassword,setUserPassword] = useState <string> ("")
    //estado para armazenar a situação
    const [situation, setSituation] = useState <string> ("")
    //estado para controle de loading
    const [loading, setLoading] = useState <boolean> (false)
    //estado para controle de erro 
    const [error, setError] = useState <string | null> (null)
    //estado para controle de sucesso
    const [success, setSuccess] = useState <string | null> (null)

    //fazer para enviar dados para a API
    const handleSubmit = async (event:React.FormEvent) => {
        //impedir o formulario de recarregar
        event.preventDefault()
        //iniciar o carregamento 
        setLoading(true)
        //limpar possivel erro anterior
        setError(null)
        //limpar possivel sucesso anterior
        setSuccess(null)
        try {
            //enviar dados para a api
            const response = await instance.post(`/user`, {
                name: name,
                email:email,
                password: userPassword,
                situation: situation
            })
            //mostrar menssagem de sucesso 
            setSuccess(response.data.menssage || "novo usuario cadastrado com sucesso")
            //limpar o campo do formulario 
            setName("")
            setEmail("")
            setUserPassword("")
        }
        catch (error: any) {
            //verificar se existe erro de requisição
            if(error.response & error.response.data && error.response.data.menssage) {
                //retornar menssagem de erro em caso de ser um array
                if(Array.isArray(error.response.data.menssage)){
                    setError(error.response.data.menssage.join(" - "))
                }
                else{
                    //mostrar menssagem caso não seja um array
                    setError(error.response.data.menssage)
                }
            }
        }
        finally{
            //terminar carregamento 
            setLoading(false)
        }
    } 

    return (
        <ProtectedRoute>
            <Menu /> < br/>

            <Link href={`/user/list`}>Listar</Link> <br />
            <br />
            <h1> Cadastro de Usuario </h1> <br />

            {/* mostrar carregando  */}
            {loading && <p>carregando...</p>}
            {/* mostrar erro caso tenha  */}
            {error && <p>{error}</p>}
            {/* mostrar sucesso caso ocorra */}
            {success && <p>{success}</p>}

            {/* mostrar formulario de cadastro caso tudo ok */}
            {!loading && !error && (
                
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="userName">Nome do Usuario: </label>
                        <input 
                            id="userName"
                            type="text"
                            value={name}
                            placeholder="nome do usuario"
                            onChange={(e) => setName(e.target.value)}
                        /> <br />
                        <label htmlFor="userEmail">Email do usuario: </label>
                        <input 
                            id="userEmail"
                            type="email" 
                            value={email}
                            placeholder="email do usuario" 
                            onChange={(e) => setEmail(e.target.value)} 
                        /> <br />
                        <label htmlFor="userPassword">Senha: </label>
                        <input
                            id="userPassword" 
                            type="string" 
                            value={userPassword}
                            placeholder="senha"
                            onChange={(e) => setUserPassword(e.target.value)}
                        /> <br />
                        <label htmlFor="userSituation">Situação do Usuario: </label>
                        <input
                            id="userSituation" 
                            type="number"
                            value={situation}
                            placeholder="situação do cliente"
                            onChange={(e) => setSituation(e.target.value)}
                        />
                    </div> <br />
                    <button type="submit" disabled ={loading}>
                        {loading ? "enviando" : "Cadastrar" }
                    </button>      
                </form>
            )}
        </ProtectedRoute>
    )
}