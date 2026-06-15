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
        <div className="bg-login">
            {/* div geral */}
            <div className="mt-6 w-full overflow-hidden bg-white px-8 py-4 shadow-md sm:max-w-md sm:rounded-lg">
                {/* div da imagem */}
                <div className="flex justify-center mb-4">
                    <img src="/image/curso_ia_unimontes-500x500.png" alt="logo" className="h-20 w-20"/>
                </div>

                <h1 className="title-login">Criar nova conta</h1>
                <br />

                {/* mostrar carregando  */}
                {loading && <p>carregando...</p>}
                {/* mostrar erro caso tenha  */}
                {error && <p>{error}</p>}
                {/* mostrar sucesso caso ocorra */}
                {success && <p>{success}</p>}

                {/* mostrar formulario de cadastro caso tudo ok */}
                {!loading && !error && (
                    <div>
                        <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
                            <div className="form-group-login">
                                <label htmlFor="name" className="form-label-login" >Nome do Usuario: </label>
                                <input 
                                    id="name"
                                    type="text"
                                    placeholder="Nome completo do usúario"
                                    {...register('name')}
                                    className="form-input-login"
                                /> <br />
                            </div>

                            <div className="form-group-login">
                                <label htmlFor="userEmail" className="form-label-login">Email do usuario: </label>
                                <input 
                                    id="userEmail"
                                    type="email" 
                                    placeholder="email do usuario" 
                                    {...register('email')} 
                                    className="form-input-login"
                                /> <br />
                            </div>

                            <div className="form-group-login">
                                <label htmlFor="password" className="form-label-login">Senha: </label>
                                <input
                                    id="password" 
                                    type="password" 
                                    placeholder="senha"
                                    {...register('password')}
                                    className="form-input-login"
                                /> <br />
                            </div>

                            <div className="btn-group-login">
                                <Link href={'../login'}>Login</Link>

                                <button type="submit" disabled ={loading} className="btn-primary-md">
                                    {loading ? "enviando" : "Cadastrar" }
                                </button>
                            </div>      
                        </form>
                    </div>
                )}
            </div>
        </div>
    )
}