'use client'

import Menu from "@/app/components/Menu";
//adaptador para conectar o resolver a validações como yup
import { yupResolver } from "@hookform/resolvers/yup";
//biblioteca para gerenciar formulario
import { useForm } from "react-hook-form"; 
//importar yup, dependencias para validação do formulario 
import * as yup from 'yup'

import instance from "@/services/api";
import Link from "next/link";
import {useState} from "react";
const schema = yup.object().shape({
    name: yup.string().required("o nome da situação do produto é obrigatoria")
    .min(3, "o campo deve ter pelo menos 3 caracteres")
})

export default function Situation () {
    //estado para armazenar dados de cada situação
    //const [nameSituation,setNameSituation] = useState <string> ("") 
    
    //estado para controle de loadind
    const [loading, setloading] = useState <boolean> (false)
    //estado para controle de erro
    const [error, setError] = useState <string | null> (null) 
    //estado para acerto 
    const [success, setSuccess] = useState <string | null> (null)

    const {register, handleSubmit, formState: {errors}, reset} = useForm({
        resolver:yupResolver(schema)
    })

    //função para encaminhar os dados para API
    const onSubmit = async (data: {name:string}) => {
        //evitar que a pagina re-carregue apos envia o formulario
        //event.preventDefault()
        
        //iniciar o carregando 
        setloading(true)
        //limpar erro anterior
        setError(null)
        //limpar sucesso anterior
        setSuccess(null)

        try {
            //fazer requisição para a API
            const response = await instance.post(`/product-situations`, data)
            //mostrar mensagem de sucesso
            setSuccess(response.data.menssage || "situação de produto cadastrada com sucesso")
            //limpar o pormulario
            reset()

        }
        catch(error:any){
            //verificar se o erro contem menssagem e validação
            if (error.response && error.response.data && error.response.data.menssage){
            
                //exibir as mensagens de erro se forem um array de mensagens
                if (Array.isArray(error.response.data.menssage)){
                    setError(error.response.data.menssage.join(" - "))
                }
                else{
                    //exibir menssagem se for somente uma mensagem 
                    setError(error.response.data.menssage)
                }
            }
            else{
                //verificar mensagem generica de error
                setError("erro ao cadastrar situação de produto tente novamente!")
            }
        }
        finally{
            //terminar o carregamento em caso de erro
            setloading(false)
        }

    } 

    return(
        <div>
            <Menu /> <br />
            <Link href={`/product-situations/list`}>List</Link>

            <h1>Cadastrar Situação de Produto</h1>
            {/* exivir carregando  */}
            {loading && <p>Carregando...</p>}
            {/* exibir erro se ouver */}
            {error && <p style={{color: "#AB080B"}}>{error}</p>}
            {/* exibir sucesso se ouver  */}
            {success && <p style= {{color: "#3CB648"}}>{success}</p>}

            <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <label htmlFor="nameSituation">Nome da Situação: </label>
                    <input
                        //value={nameSituation}
                        type="text"
                        id="nameSituation"
                        placeholder="Nome da Situação"
                        //onChange={(e) => setNameSituation(e.target.value)} 
                        {...register('name')}
                    />
                    {errors.name && <p style={{color:"#AB080B"}}>{errors.name.message}</p>}
                </div>
                <button type="submit" disabled = {loading} >
                    {loading ? "Enviando": "Cadastrar"}
                </button>

            </form>

        </div>
    )
}
