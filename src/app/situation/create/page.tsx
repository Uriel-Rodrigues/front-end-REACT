'use client'

import instance from "@/services/api"
import Menu from "@/app/components/Menu"

//importar o adaptador para conectar react-hook-form com bibliotecas de validação como yup
import { yupResolver } from "@hookform/resolvers/yup"
//imporar função para gerenciar o formulario
import {useForm} from "react-hook-form"
//importar a dependencia para validação de formulario
import * as yup from "yup"

import Link from "next/link"
import { useState } from "react"
//importar componente para tornar rota protegida (precisa estar logado)
import ProtectedRoute from "@/app/components/ProtectedRoute";

//esquema de validação com yup
const schema = yup.object().shape({
    nameSituation: yup.string().required("o nome da situação é obrigatorio")
    .min(3, "o nome da situação deve ter pelo menos 3 caracteres!"),
})

export default function Situation () {
    //estado para armazenar dados da situação
    //const [nameSituation, setNameSituation] = useState <string> ("");
    
    //estado para carregamento
    const [loading, setLoading] = useState <boolean> (false) 
    //estado para controle de erro 
    const [error, setError] = useState <string | null> (null)
    //estado para controle de sucesso 
    const [success, setSuccess] = useState <string | null> (null)

    const {register, handleSubmit,formState: {errors}, reset} = useForm({
        resolver: yupResolver(schema)
    })

    //função para encaminhar dados para a API
    const onsubmit = async (data: {nameSituation:string}) => {
        //Evitar o carregamento da pagina ao enviar o formulario
        //event.preventDefault();
        
        //iniciar o carregamento
        setLoading(true)
        //limpar o erro anteriro
        setError(null)
        //limpar o sucesso anterior
        setSuccess(null)

        try{
            //fazer a requisição para a API
            const response = await instance.post("/situation", data)

            //exibir menssagem de sucesso 
            setSuccess(response.data.menssage || "situação cadastrada com sucesso!")

            //limpar o campo do formulario
            reset()

        }
        catch(error:any){
            //verificar se o erro contem mensagem e validação
            if (error.response && error.response.data && error.response.data.menssage){
                //exibir as mensagens de erro se for um array de mensagens
                if(Array.isArray(error.response.data.menssage)){
                    setError(error.response.data.menssage.join(" - "));
                }
                else{
                    //exibe a mensagem de error se for uma mensgem 
                    setError(error.response.data.menssage)
                }
            }
            else {
                //veficar a mensagem generica de erro
                setError("erro ao cadastrar situação, tente novamente")
            }
        }finally{
            //temina o carregamento em caso de error
            setLoading(false)
        }

    } 

    return (
        <ProtectedRoute>
            <Menu /><br />
            <Link href={`/situation/list`}> List</Link>
            <h1>Cadastrar Situação</h1>
            {/* exibir carregando */}
            {loading && <p>Carregando...</p>}
            {/* exibir error se houver */}
            {error && <p style={{color:"#AB080B"}}>{error}</p>}
            {/* exibir mensagem de sucesso */}
            {success && <p style={{color:"#3CB648"}}>{success}</p>}

            <form onSubmit={handleSubmit(onsubmit)}>
                <div>
                    <label htmlFor="nomeSituation">Nome da Situação: </label>
                    <input 
                        type="text" 
                        id ="nomeSituation"
                       //value={nameSituation}
                        placeholder="Nome da Situação"
                        //onChange={(e)=> setNameSituation(e.target.value)}
                        {...register('nameSituation')}         
                    />
                    {/* exibe o erro de validação do campo */}
                    {errors.nameSituation && <p style={{color:"#AB080B"}}>{errors.nameSituation.message}</p>}
                </div>
                <button type="submit" disabled = {loading}>
                    {loading ? "Enviado...":"Cadastrar"}
                </button>
            </form>
        </ProtectedRoute>
    )
}