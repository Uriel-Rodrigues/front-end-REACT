'use client'
import instance from "@/services/api";
import Menu from "@/app/components/Menu";
import Link from "next/link";
import { useEffect, useState } from "react";
import {useSearchParams } from "next/navigation"

export default function Product() {
    //capturar id pela url
    const id = Number(useSearchParams().get("id"))
    //estado para guardar o nome do produdo
    const [nameProduct, setNameProduct] = useState <string> ("") 
    //estado para guardar a descrição do produto 
    const [description, setdescription] = useState <string> ("") 
    //estado para guardar o preço do produto
    const [price, setPrice] = useState <string> ("")
    //estado para categoria do produto
    const [category, setCategory] = useState <string> ("") 
    //estado para guardar situação 
    const [situation,setSiuation] =useState <string> ("")
    //estado para controle de carregamendo
    const [loading, setLoading] = useState <boolean> (false)
    //estado para controle de erro
    const [error , setError] = useState <string | null> (null) 
    //estado para controle de sucesso 
    const [success, setSuccess] = useState <string | null> (null)

    //função para capturar os dados ja existente dentro da API
    const fetchProduct = async () =>{
        try{
            //iniciar carrgamento 
            setLoading(true)
            //fazer requisição para API
            const response = await instance.get(`/product/${id}`)
            //salvar dados encontrado 
            setNameProduct(response.data.name)
            setdescription(response.data.description)
            setPrice (response.data.price)
            setCategory(response.data.category)
            setSiuation(response.data.situation)
        }
        catch (error: any){
            //verificar se existe erro na requisição
            if (error.response && error.response.data && error.response.data.menssage){
                //verificar se o erro é um array
                if(Array.isArray(error.response.data.menssage)) {
                    setError(error.response.data.menssage.join(" - "))
                }
                else{
                    //menssagem caso n seja array
                    setError(error.response.data.menssage)
                }
            }
        }
        finally{
            //terminar carregamento 
            setLoading(false)
        }
    }

    //função para atualizar os dados alterados 
    const handleSubmit = async (event: React.FormEvent) => {
        //parar carregamento da pagina
        event.preventDefault()
        //iniciar o carregamento 
        setLoading(true)
        //limpar erro anteriro
        setError(null)
        //limpar acerto anterior
        setSuccess(null)
        
        try{
            //realizar requisição para a API
            const response = await instance.put(`/product/${id}`, {
                name: nameProduct,
                description: description,
                price: price,
                category: category,
                situation: situation
            })
            //exibir menssagem de sucesso 
            setSuccess(response.data.menssage || "Dados do produto atualizados com sucesso")

            //limpar o campo do formulario 
            setNameProduct("")
            setdescription("")
            setPrice("")
            setCategory("")
            setSiuation("")
        }
        catch(error: any){
            //verificar que existe erro na requisição
            if(error.response && error.response.data && error.response.data.menssage){
                if(Array.isArray(error.response.data.menssage)){
                    setError(error.response.data.menssage.join(" - "))
                }
                else{
                    //retornar menssagem no caso de ser somente uma 
                    setError(error.response.data.menssage)
                }
            }
        }
        finally{
            //terminar o carregamento
            setLoading(false)
        }
    }

    //hook para atualizar a pagina quando mudar o componente
    useEffect(() =>{
        if(id) {
            fetchProduct()
        }
    },[id]) //recarrega a pagina quando mudar o id

    return(
        <div>
            <Menu /><br />
            <Link href = {"/product/list"}>Listar</Link><br />

            <br /><h1>Editar Produto</h1><br />
            {/* mostar carregando */}
            {loading && <p>carregando...</p>}
            {/* mostrar erro caso tenha */}
            {error && <p>{error}</p>}
            {/* mostrar sucesso caso tenha */}
            {success && <p>{success}</p>}
            {/* mostrar formulario */}
            {!loading && !error && (
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="nameProduct">Novo nome: </label>
                        <input 
                            id="nameProduct"
                            type="text" 
                            value= {nameProduct}
                            placeholder="Novo Nome do produto"
                            onChange={(e) => setNameProduct(e.target.value)}
                        /> <br />
                        <label htmlFor="description">Nova descrição: </label>
                        <input 
                            id="description"
                            type="text"
                            value={description}
                            placeholder="Nova Descrição"
                            onChange={(e) => setdescription(e.target.value)}  
                        /> <br />
                        <label htmlFor="pice">Novo preço: </label>
                        <input
                            id="price" 
                            type="number"
                            value={price}
                            min={0.00}
                            step={0.01}
                            placeholder="Novo Preço do produto "
                            onChange={(e) => setPrice(e.target.value)}
                        /><br />
                        <label htmlFor="category">Nova categoria: </label>
                        <input 
                            id="category"
                            type="text"
                            value={category}
                            placeholder="Nova categoria"
                            onChange={(e) => setCategory(e.target.value)}
                        /> <br />
                        <label htmlFor="situation">Nova Stuação: </label>
                        <input 
                            id="situation"
                            type="text"
                            value={situation}
                            placeholder="Nova Situação"
                            onChange={(e) => setSiuation(e.target.value)} 
                        />
                    </div>
                    <button type="submit" disabled={loading}>
                        {loading ? "Atualizando" : "Salvar"}
                    </button>
                </form>
            )}
        </div>
    )

}