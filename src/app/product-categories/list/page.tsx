'use client'
import { useEffect, useState } from "react";
import Link from "next/link";

import instance from "@/services/api";
//importando componente de paginação
import Pagination from "@/app/components/Pagination";
//importa o componente menu
import Menu from "@/app/components/Menu";
import DeleteButton from "@/app/components/DeleteButton";
import ProtectedRoute from "@/app/components/ProtectedRoute";

//definir tipos para a resposta da API
interface Categories {
    id: number,
    name: string,
    createdAt: string,
    updatedAt: string
}

export default function ProductCategoriesList() {
    //estado para armazenar Categorias
    const [categories, setCategories] = useState<Categories[]>([]);
    //estado para controle de carregamento 
    const [loading,setLoading] = useState<boolean>(true);
    //estado para controle de erros
    const [error, setError] = useState<string | null>(null);
    // estado para controle de sucesso
    const [success ,setSuccess] = useState <string | null> (null)
    //pagina atual
    const [currentPage, setCurrentPage] = useState<number>(1) 
    //pagina final
    const [lastPage, setLastPage] = useState<number>(4)

    //função para buscar as Categorias da API
    const fetchCategories = async (page:number) => {
        try{
            //inicia o carregamento
            setLoading(true)
            //faz a solicitação para a API
            const response = await instance.get(`/product-categories?page=${page}&limit=1`)
            //atualiza o estado com os dados da API
            setCategories(response.data.data)
            //atualiza a pagina atual
            setCurrentPage(response.data.currentPage)
            //terminar o carregamento
            setLoading(false) 

        }
        catch(error) {
            setError("erro ao carregar as categorias")
            //termina o carregamento em caso de erro
            setLoading(false)

        }
    }
    //atualizar a pagina apos deletar
    const hendleSuccess = () => {
        fetchCategories(currentPage)
    }
    //hook para buscar os dados na primeira renderização
    useEffect (() => {
        //capturar mensagem caso tenha
        const menssage =sessionStorage.getItem("successMenssage")
        if(menssage) {
            //atribui a messagem capturada
            setSuccess(menssage)
            //remove a mensagem para n aparecer mais de uma vez
            sessionStorage.removeItem("successMenssage")

        }
        //buscar os dados
        fetchCategories (currentPage)
    },[currentPage])//recarrega os dados sempre que a pagina muda
    
    return(
        <ProtectedRoute>
            <Menu/>
            <br/>
            
            <Link href={`/product-categories/create`}>Cadastrar</Link>
            <h1>Listar as Categorias de produtos</h1> <br/>
            {/* exibir o carregando... */}
            {loading && <p>carregando....</p>}
            {/* exibe erros se ouver */}
            {error && <p style={{color:"#AB080B"}}>{error}</p>}
            {/* exibe mensagem de sucesso */}
            {success && <p style={{color:"#3CB648"}}>{success}</p>}

            {!loading && !error && (
                <table>
                    <thead>
                        <tr>
                            <th>ID</th> 
                            <th>Nome Categoria</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map((categories) => (
                            <tr key={categories.id}>
                                <th>{categories.id}</th> 
                                <th>{categories.name}</th>
                                <td><Link href = {`/product-categories/${categories.id}`}>Visualizar</Link> - <Link href={`/product-categories/edit?id=${categories.id}`}>Editar</Link> -
                                < DeleteButton
                                    id={String(categories.id)}
                                    route="product-categories"
                                    onSuccess={hendleSuccess}
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