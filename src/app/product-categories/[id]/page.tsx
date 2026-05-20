'use client'
import Menu from "@/app/components/Menu";
import instance from "@/services/api";
//importar componente para deletar 
import DeleteButton from "@/app/components/DeleteButton";
//hook para controle de navegação do usuario
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import ProtectedRoute from "@/app/components/ProtectedRoute";

interface Categories {
    id: number,
    name: string,
    createdAt: string,
    updatedAt: string
}

const categoriesDetails = ()=>{
    //useParams para pegar o id da URL 
    const {id} = useParams()
    //instanciar router para poder usar
    const router = useRouter()
    //estado para atualizar a categoria
    const [categories, setCategories] = useState <Categories | null> (null)
    //estado para carregamento 
    const [loading, setLoading] = useState <boolean> (true)
    //estado para tratar erro
    const [error, setError] = useState <string | null> (null)
    //estado para controle de acerto 
    const [success, setSuccess] = useState <string | null> (null)

    //funão para buscar as categorias da API
    const fetchCategoriesDetail = async (id: string) => {
        try{
            //iniciar carregamento
            setLoading(true)
            //realizar a solicitação para a API
            const response = await instance.get(`/product-categories/${id}`)
            //atuar alizar os dados de acordo com a resposta da api
            setCategories(response.data)
            //parar carregamento 
            setLoading(false)
        }
        catch(error:any){
            //verificar se erro é da mensagem e validação
            if (error.response && error.response.data){
                //retornar a mensagem de error da API
                setError(error.response.data.menssage)
            }
            else{
                //criar mensagem generica de erro
                setError("erro ao carregar os detalhes da categoria de poduto")
            }
            //parar o carregamento
            setLoading(false)

        }
    }
    //controlar navegação do usuario e criar mensagem de sucesso 
    const hendleSuccess = () => {
        // criar mensagem de sucesso apos deletar 
        sessionStorage.setItem("successMenssage","categoria de produto deletada com sucesso. ")
        //redirecionar o usuario para list
        router.push(`/product-categories/list`)
    }

    useEffect (() => {
        if (id){
            //garantir que o id seja uma string
            const categoriesId = Array.isArray(id) ? id[0] : id   
            //buscar os dados da situação se estiver disponivel
            fetchCategoriesDetail(categoriesId)
        }
    },[id])// recarrega a pagina sempre que o id mudar 

    return (
        <ProtectedRoute> 
            <Menu /> <br/>

            <Link href= {`/product-categories/list`}>List</Link>
            {/* implementar botão deletar */}
            {categories && !loading && !error && (
                < DeleteButton
                    id = {String(categories.id)}
                    route="product-categories"
                    onSuccess={hendleSuccess}
                    setError={setError}
                    setSuccess={setSuccess}
                />
            )}
            <h1>Detalhes da Categoria do Produto</h1>
            {/* exibir o carregando */}
            {loading && <p>carregando...</p>}
            {/* exibnir erro se ouver */}
            {error && <p style={{color:"#AB080B"}}>{error}</p>}

            {/* imprimir detalhes do registro */}
            {categories && !loading && !error &&(
                <div>
                    <p>ID: {categories.id}</p>
                    <p>Nome categoria-produto: {categories.name}</p>
                    <p>createdAt: {new Date(categories.createdAt).toLocaleString()}</p>
                    <p>updatedAt: {new Date(categories.updatedAt).toLocaleString()}</p>
                </div>
            )}
        </ProtectedRoute>        
    )
}
export default categoriesDetails