'use client';

import instance from "@/services/api";
import Menu from "@/app/components/Menu";
import Link from "next/link";
import * as yup from "yup"
import { yupResolver} from "@hookform/resolvers/yup";
import { useState } from "react";
import { UseForm } from "react-hook-form";

//schema de alidação com yup
const schema = yup.object().shape({
    name: yup.string().required("o campo nome do produto é obrigatorio!").min(3,"o campo nome deve conter no minimo 3 caracteres"),
    description: yup.string().required("é necessario atribuir alguma descrição ao produto!").min(20, "a descrição deve ter no minimo 20 caracteres"),
    price: yup.number().required("o campo de preço é obrigatorio!"),
    category: yup.number().required("obrigatorio indicar a categoria do produto"),
    situation: yup.number().required("é obrigatorio indicar a situação do produto")  
})

export default function Product () {
    //criar estado para producto
    const [nameProduct, setNameProduct] = useState <string> ("");
    //estado para armazenar descrição
    const [description, setDescription] = useState <string> ("")
    //estado para armazenar preço do produto 
    const [price, setPrice]= useState <string> ("")
    // estado para armazenar categoria do produto
    const [category, setCategory] = useState <string> ("")
    //estado para armazenar a situação do produto
    const [situation, setSituation] = useState <string> ("") 
    // criar estado para controle de carregamento 
    const [loading, setloading] = useState <boolean> (false)
    // criar estado para controle de erro
    const [error, setError] = useState <string | null> (null)
    // criar estado para controle de sucesso
    const [success, setSuccess] = useState <string | null> (null)

    //função para encaminar os dados para a API
    const handleSubmit = async (event: React.FormEvent) => {
        //evitar o carregamento da pagina ao enviar o formulario 
        event. preventDefault()
        //iniciar carregamento
        setloading(true) 
        //limpar erro se tiver
        setError(null) 
        //limpar acerto se tiver
        setSuccess(null)  
        
        //fazer requisição para a API
        try {
        //requisição
            const response = await instance.post ("/product", {
                name: nameProduct,
                description: description,
                price: price,
                category: category,
                situation: situation
            })
            //exibir mensafgem de sucesso 
            setSuccess(response.data.menssage || "Produto cadastrado com sucesso!")
            //limpar o campo do formulario
            setNameProduct("")

        }
        catch(error: any){
            //verificar se o erro contem menssagem de validação
            if (error.response && error.response.data && error.response.data.menssage){
                //mostrar menssagem caso seja um array
                if(Array.isArray(error.response.data.menssage)){
                    setError(error.response.data.menssage.join(" - "))
                }
                else{
                    //exibir unica menssagem de erro caso n seja array
                    setError(error.response.data.menssage)
                }
            }

        } 
        finally{
            //terminar o carregamento
            setloading(false) 
        }

    }
    
    return(
        <div>
            < Menu /> <br />

            <Link href={`/product/list`}>Listar</Link> <br /> 
            <br />  <h1>Cadastro de produtos</h1> <br />
            {/* mostrar carregando */}
            {loading && <p>carregando...</p>}
            {/* mostrar menssagem de erro se ouver */}
            {error && <p>{error}</p> }
            {/* mostrar menssagem de sucesso se ouver */}
            {success && <p>{success}</p>}

            {/* campos de cadastro para produto */}
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="nameProduct">Nome do Produto: </label>
                    <input 
                        type="text"
                        id = "nameProduct"
                        value={nameProduct}
                        placeholder="Nome do Produto"
                        onChange={(e) => setNameProduct(e.target.value)}
                    /> <br />
                    <label htmlFor="description">Descrição do produto: </label>
                    <input 
                        type="text"
                        id="description"
                        value={description}
                        placeholder="descrição do produto" 
                        onChange={(e) => setDescription(e.target.value)}
                    /> <br />
                    <label htmlFor="price">preço do produto: </label>
                    <input 
                        type="number"
                        id="price"
                        value={price}
                        placeholder="Preço do Produto"
                        min={0.00}
                        step={0.01}
                        onChange={(e) => setPrice(e.target.value)}
                    /> <br/>
                    <label htmlFor="situation">Situação do Produto: </label>
                    <input 
                        type="number"  
                        id="situation"
                        value={situation}
                        placeholder="situação do produto"
                        onChange={(e) => setSituation(e.target.value) } 
                    /><br />
                    <label htmlFor="category">Categoria do Produto: </label>
                    <input 
                        type="text" 
                        id="category"
                        value={category}
                        placeholder="Categoria do Produto"
                        onChange={(e) => setCategory(e.target.value)}
                    /> <br />
                </div>
                <button type="submit" disabled = {loading}>
                    {loading ? "enviando...": "CADASTRAR"}
                </button>
            </form>
           

        </div>
    )
} 