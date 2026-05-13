'use client';

import Menu from "@/app/components/Menu";
import instance from "@/services/api";
//adaptador para conectaro resolver ao yup
import { yupResolver } from "@hookform/resolvers/yup";
//função para gerenciar o formulario 
import { useForm } from "react-hook-form";
//biblioteca de validação de formulario
import * as yup from 'yup'
import Link from "next/link";
import { useState } from "react";

const schema = yup.object().shape({
    name: yup.string().required("o nome da categoria do produto é um campo obrigatorio")
    .min(3, "o campo deve ter no minimo 3 caracteres para ser considerado valido")
}) 

export default function Categories() {
    //estado para armazenar as categorias
    //const [nameCategory, setNameCategory] = useState <string> (""); 
    
    //estado para controle de carregamento 
    const [loading, setLoadig] = useState <boolean> (false);
    //estado para controle de erros
    const [error, setError] = useState <string | null> (null);
    //estado para controle de sucesso
    const [success, setSuccess] = useState <string | null> (null);

    //importamos atraves de desestruturação os componentes que interessão de useForme
    //fazemos a ligação do resolver com o yup atraves do yupResolver 
    //resolver usara yupResolver para ler o que tem em schema
    const {register,handleSubmit, formState: {errors}, reset} =useForm({
        resolver: yupResolver(schema)
    })

    //função para fazer requisição para a API
    const onSubmit = async (data: {name: string}) => {
        //evitar carregamento da pagina apos enviar o formulario 
        //event.preventDefault()
        
        //iniciar carregamento 
        setLoadig(true)
        //limpar erro anterior se tiver
        setError(null)
        //limpar acerto anterior se tiver
        setSuccess(null)

        try {
            //fazer requisição para a API
            const response = await instance.post(`/product-categories`,data)
            
            //exibir mensgame de sucesso
            setSuccess(response.data.menssage || "categoria cadastrada com sucesso!")
            //limpar o campo do formulario
            reset()

        }
        catch(error:any){
            //verificar se o formulario contem erros de validação 
            if(error.response && error.response.data && error.response.data.menssage){
                //mostrar mensagem de erro em caso de ser um array
                if(Array.isArray(error.response.data.menssage)){
                    setError(error.response.data.menssage.join(" - "));
                }
                else{
                    //mostrar mensagem de erro no caso de so uma mensagem
                    setError(error.response.data.menssage);
                };
            }
            else{
                //menssagem generica de erro
                setError("erro ao cadastrar a nova categoria de produto, tente novamente!")
            };
        }
        finally{
            //termina o carregamento
            setLoadig(false)
        }

    } 

    return(
        <div>
            <Menu /> <br />
            <Link href={`/product-categories/list`}>List</Link>

            <h1>Cadastrar Categoria de produto</h1>
            {/* exibir carregando */}
            {loading && <p>carregando...</p>}
            {/* exibir erro se ouver  */}
            {error && <p style={{color: "#AB080B"}}>{error}</p>}
            {/* exibir sucesso se ouver */}
            {success && <p style={{color:"#3CB648"}}>{success}</p>}

            <form onSubmit={handleSubmit(onSubmit)}>
                <div>   
                    <label htmlFor="nameCategory">Nome da Categoria: </label>
                    <input 
                        type="text" 
                        id="nameCategory"
                        //value={nameCategory}
                        placeholder="Nome da Categoria"
                        //onChange={(e) => setNameCategory(e.target.value)}
                        {...register('name')} 
                    />
                    {/* exibe a mensagem de erro caso exista*/}
                    {errors.name && <p style={{color: "#AB080B"}}>{errors.name.message}</p> }
                </div>
                <button type="submit" disabled = {loading}>
                    {loading ? "Enviando..." : "Cadastrar"}
                </button>
            </form>
        </div>
    )
};