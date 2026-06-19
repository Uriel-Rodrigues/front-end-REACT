'use client'
import DeleteButton from "@/app/components/DeleteButton";
import instance from "@/services/api";
import Menu from "@/app/components/Menu";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
//importar componente de NavBar
import NavBar from "@/app/components/NavBar";
//importar componente de SidBar
import SideBar from "@/app/components/SideBar";
//importar componente para proteger rota
import ProtectedRoute from "@/app/components/ProtectedRoute";


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
    const {id} = useParams();
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
    const fetchProducts = async (id: string) => {
        try{
            //iniciar o carregamento
            setLoading(true)
            //fazer a requisição para a api
            const response = await instance.get(`/product/${id}`)
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
        if(id) {
            //garatir que o id seja uma string
            const productId = Array.isArray(id) ? id[0] : id
            //buscar os dados caso o id esteja disponivel
            fetchProducts(productId)
        }
    },[id]) // recarrega os dados quando o id mudar

    //inicio da parte visual da aplicação
    return(
        <ProtectedRoute>
            <div className="bg-dashboard">
                <NavBar/>
                <div className="flex">
                    <SideBar/>

                    {/* exibir carregando */}
                    {loading && <p>carregando...</p>}
                    {/* exibir erro caso tenha */}
                    {error && <p>{error}</p>}
                    {/* edxibir sucesso caso tenha */}
                    {success && <p>{success}</p>}
                    {/* imprimir os detelhes do produto  */}
                    {product && !loading && !error && (

                        // <!-- conteudo principal -->
                        <main className="main-content">
                            {/* <!-- titulo a trilha de navegação --> */}
                            <div className="content-wrapper">
                                <div className="content-header">
                                    <h2 className="content-title">Produtos</h2>
                                    <nav className="breadcrumb">
                                        <a href="/deshboard" className=" breadcrumb-link">Dashboard</a>
                                        <span>/</span>
                                        <a href={`/product/list`} className=" breadcrumb-link">Produtos </a>
                                        <span>/</span>
                                        <span>Visualizar</span>
                                    </nav>
                                </div>
                            </div>
                            
                            <div className="content-box">
                                <div className="content-box-header">
                                    <h3 className="content-box-title">Visualizar Produto</h3>
                                    <div className="content-box-btn">
                                        <a href={`/product/list`} className="btn-info aling-icon-btn">
                                            {/* <!-- svg list-bullet (Heroicons) --> */}
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4">

                                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                                            </svg>
                                            <span>Listar</span>
                                        </a>
                                        <a href="/src/adm/users/edit.html" className="btn-warning aling-icon-btn ">
                                            {/* <!-- svg pencil-square (Heroicons) --> */}
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                            </svg>
                                            <span>Editar</span>
                                        </a>
                                        <DeleteButton 
                                            id = {String(product.id)}
                                            route = "product"
                                            onSuccess = {handleSuccess}
                                            setError= {setError}
                                            setSuccess= {setSuccess}
                                        />
                                    </div>
                                </div>

                                <div className="detail-box">
                                    <div className="mb-1">
                                        <span className="detail-content">ID: {product.id} </span>
                                    </div>

                                    <div className="mb-1">
                                        <span className="detail-content">Nome: {product.name} </span>
                                   </div>

                                    <div className="mb-1">
                                        <span className="detail-content">Descrição: {product.description}</span>
                                    </div>

                                    <div className="mb-1">
                                        <span className="detail-content">Preço: {product.price} </span>
                                    </div>

                                    <div className="mb-1">
                                        <span className="detail-content">Criado em: {product.createdAt} </span>
                                    </div>

                                    <div className="mb-1">
                                        <span className="detail-content">Editado em: {product.updatedAt} </span>
                                    </div>
                                </div>
                            </div>
                        </main>
                    )}
                </div>
            </div>
        </ProtectedRoute>
    )
};

