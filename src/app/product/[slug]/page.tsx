'use client'
import DeleteButton from "@/app/components/DeleteButton";
import instance from "@/services/api";
import Menu from "@/app/components/Menu";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";

interface Product {
    id: number,
    name: string,
    slug:string,
    description: string,
    price: number
    situation: number,
    category: number,
    createdAt: string,
    updatedAt: string
};

export default function ProducDetail(){
    //pegar parametro da url
    //const {id} = useParams();
    const {slug} = useParams()
    //instanciar router para poder usar
    const router = useRouter()
    //criar um estado para armazenar Produto
    const [product, setProduct] = useState <Product | null> (null) 
    //estado para controle de carregamento 
    const [loading, setLoading] = useState <boolean> (false)
    //estado para controle de erro 
    const [error, setError] = useState <string | null> (null)
    //estado para controle de acerto
    const [success , setSuccess] = useState <string | null> (null)

    //função para fazer a requisição para a API
    const fetchProducts = async (slug: string) => {
        try{
            //iniciar o carregamento
            setLoading(true)
            //fazer a requisição para a api
            const response = await instance.get(`/product/${slug}`)
            //atualizar os dados com o que retornar da requisição
            setProduct(response.data)
            //terminar o carregamento
            setLoading(false)
        }
        catch(error: any){
            //verificar  se contem erro de validação
            if (error.response && error.response.data){
                // retornar a mensagem da API
                setError (error.response.data.menssage)
            }
            else {
                //retornar mensagem generica de erro 
                setError("erro ao carregar os detalhes do produto selecionado tente novamente!")
            }
            //terminar o carregamento
            setLoading(false)

        }
    }
    //redirecionar usuario para pagina "listar" caso registro seja apágado
    const handleSuccess = () => {
        //salvar mensagem no sessionStorange antes de redirecionar 
        sessionStorage.setItem("successMenssage", "Registro deletado com sucesso")
        //redirecionar o usuario para a pagina listar
        router.push(`/product/list`)
    }
    //hook para atualizar os dados quando o ID estiver disponivel
    useEffect(()=>{
        if(slug) {
            //garatir que o id seja uma string
            const productId = Array.isArray(slug) ? slug[0] : slug
            //buscar os dados caso o id esteja disponivel
            fetchProducts(productId)
        }
    },[slug]) // recarrega os dados quando o id mudar

    //inicio da parte visual da aplicação
    return(
        <div>
            <Menu />
            <Link href = {`/product/list`}>Listar</Link>

            {product && !loading && !error && (
                <DeleteButton 
                    id = {String(product.id)}
                    route = "product"
                    onSuccess = {handleSuccess}
                    setError= {setError}
                    setSuccess= {setSuccess}
                />
            )}

            <h1>Detalhes do Produto</h1>
            {/* exibir carregando */}
            {loading && <p>carregando...</p>}
            {/* exibir erro caso tenha */}
            {error && <p>{error}</p>}
            {/* edxibir sucesso caso tenha */}
            {success && <p>{success}</p>}
            {/* imprimir os detelhes do produto  */}
            {product && !loading && !error && (
                <div>
                    <p>ID: {product.id} </p>
                    <p>Nome: {product.name} </p>
                    <p>Descrição: {product.description}</p>
                    <p>Preço: {product.price} </p>
                    <p>Criado em: {product.createdAt} </p>
                    <p>Editado em: {product.updatedAt} </p>
                </div>
            )}
        </div>
    )
};

