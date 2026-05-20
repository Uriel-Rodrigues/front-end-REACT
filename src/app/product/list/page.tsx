'use client';

import Pagination from "@/app/components/Pagination";
import Menu from "@/app/components/Menu";
import instance from "@/services/api";
import { useEffect, useState } from "react";
import DeleteButton from "@/app/components/DeleteButton";
import Link from "next/link";
import ProtectedRoute from "@/app/components/ProtectedRoute";

//interface com os tipos de resposta da api
interface Product {
    id: number,
    name: string,
    slug: string,
    description: string,
    price: number
    situation: number,
    category: number,
    createdAt: string,
    updatedAt: string
};

export default function productList(){
    //estado para armazenar os dados dos produtos
    const [product, setProduct] = useState <Product[]> ([]);
    //estado para controle de carregamento 
    const [loading, setLoading] = useState <boolean> (false);
    //estado para controle de erro
    const [error, setError] = useState <string | null> (null);
    //estado para controle de sucesso 
    const [success, setSuccess] = useState <string | null> (null);
    //pagina atual
    const [currentPage, setCurrentPage] = useState <number> (1)
    //pagina final
    const [lastPage, setLastPage] = useState <number> (10)

    //função para buscar os produtos na API
    const fetchProducts = async (page: number) => {
        try{
        //iniciar o carregamento 
        setLoading(true)
        //fazer a solicitação para a api
        const response = await instance.get(`/product?page=${page}&limit=1`)
        //atualizar os dados com o que foi retornado
        setProduct(response.data.data)
        //atualizar a pagina atual
        setCurrentPage(response.data.currentPage)
        //parar carregamento
        setLoading(false)

        }
        catch(error) {
            //retorna menssagem em caso de erro
            setError ("não foi possivel carregar os Produtos")
            console.log(error)
            //para o carregamento 
            setLoading(false)
        }
    }
    //atuarlizar a pagina apos deletar registro
    const handleSuccess = () => {
        fetchProducts(currentPage)
    }

    //hook para atualizar os registros quando mudar de pagina
    useEffect(() => {
        //buscar dados ao mudar a pagina
        fetchProducts(currentPage)
    },[currentPage])// atualiza os dados quando a pagina mudar 
    
    return(
        <ProtectedRoute>
            <Menu></Menu> <br />
            <Link href = {"/product/create"}>Cadastrar</Link> <br />

            <h1>Listar produtos cadastrados </h1> <br />

            {/* exibir carregando */}
            {loading && <p>Carregando...</p>}
            {/* exibir mensage de erro se tiver */}
            {error && <p>{error}</p>}
            {/* exibir mensagem de sucesso se tiver  */}
            {success && <p style={{color:"#3CB648" }}>{success}</p>}

            {!loading && !error && (
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nome do Produto</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {product.map((product) =>(
                            <tr key={product.id}>
                                <td>{product.id}</td>
                                <td>{product.name}</td>
                                <td> 
                                    <Link href = {`/product/${product.slug}`}> Viasualizar-</Link> 
                                    <Link href={`/product/edit?id=${product.slug}`}> Editar -</Link>  
                                    <DeleteButton 
                                        id = {String(product.slug)}
                                        route = "product"
                                        onSuccess={handleSuccess}
                                        setError={setError}
                                        setSuccess={setSuccess}

                                    />   
                                    </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            {/* paginação */}
            <Pagination 
                currentPage={currentPage}
                lastPage={lastPage}
                onPageChange={setCurrentPage}
            />

        </ProtectedRoute>
    )
}
