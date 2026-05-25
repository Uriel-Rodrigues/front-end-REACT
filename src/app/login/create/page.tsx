'use client'

import Menu from "@/app/components/Menu";
// Importa a instância do axios configurada para fazer requisições para a API
import instance from "@/services/api";
// Importar o componente para criar link
import Link from "next/link";
// Importar a dependência para validar o formulário.
import * as yup from "yup"
// Importa hooks do React para usar o estado "useState"
import { useState } from "react";
//importar componente para tornar rota protegida (precisa estar logado)
import ProtectedRoute from "@/app/components/ProtectedRoute";
// importar hook para manipulação da navegação do usuario
import { useRouter } from "next/navigation";
// Importar o adaptador para conectar react-hook-form com bibliotecas de validação como Yup
import { yupResolver } from '@hookform/resolvers/yup';
// Importar a função para gerenciar o formulário
import { useForm } from "react-hook-form";

//montar schema de validação com yup
const schema = yup.object().shape({
    name: yup.string().required("o nome do usuario é obrigatorio").min(2,"o campo precisa de no minimo 3 caracteres"),
    email: yup.string().email().required("o campo de email do usuario é obrigatorio"),
    password: yup.string().required("o campo de senha é obrigatorio!"),
    situation: yup.string().required("o campo de situação do usuario é necessario")
})

//estados para controle e armazenamento de dados 
export default function UserCreate () {
    //instanciar o router 
    const router = useRouter()
    //estado para controle de loading
    const [loading, setLoading] = useState <boolean> (false)
    //estado para controle de erro 
    const [error, setError] = useState <string | null> (null)
    //estado para controle de sucesso
    const [success, setSuccess] = useState <string | null> (null)

    //iniciar o formulario com validações
    const {register, handleSubmit, formState: {errors}, reset} = useForm({
        resolver: yupResolver(schema)})

    //fazer para enviar dados para a API
    const onSubmit = async (data: {name:string, email:string, password:string, situation?:string}) => {
        //senao for encaminhado situação vai definir como "1"
        data.situation = data.situation ?? "1"

        //iniciar o carregamento 
        setLoading(true)
        //limpar possivel erro anterior
        setError(null)
        //limpar possivel sucesso anterior
        setSuccess(null)
        try {
            //fazer requisição para api e enviar os dados
            const response = await instance.post(`/user/create`, data)

            //mostrar menssagem de sucesso 
            setSuccess(response.data.menssage || "novo usuario cadastrado com sucesso")

            //limpar o campo do formulario 
            reset()

            //salvar mensagem no sessionStarage antes de redirecionar para login
            sessionStorage.setItem("succcessMenssage", response.data.menssage || "Novo usuario cadastrado com sucesso" )

            //redirecionar usuario 
            router.push("/login")
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
        <div>
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
                
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div>
                        <label htmlFor="name">Nome do Usuario: </label>
                        <input 
                            id="name"
                            type="text"
                            placeholder="nome do usuario"
                            {...register('name')}
                            /> <br />
                        <label htmlFor="userEmail">Email do usuario: </label>
                        <input 
                            id="userEmail"
                            type="email" 
                            placeholder="email do usuario" 
                            {...register('email')} 
                        /> <br />
                        <label htmlFor="password">Senha: </label>
                        <input
                            id="password" 
                            type="password" 
                            placeholder="senha"
                            {...register('password')}
                        /> <br />
                        <label htmlFor="situation">Situação do Usuario: </label>
                        <input
                            id="situation" 
                            type="string"
                            placeholder="situação do cliente"
                            {...register('situation')}
                        />
                    </div> <br />
                    <button type="submit" disabled ={loading}>
                        {loading ? "enviando" : "Cadastrar" }
                    </button>      
                </form>
            )}
        </div>
    )
}