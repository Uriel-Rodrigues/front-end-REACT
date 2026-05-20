'use client'
import Menu from "@/app/components/Menu"
import instance from "@/services/api"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import ProtectedRoute from "@/app/components/ProtectedRoute";


export default function Categories () {
    // capturar dados encaminhados atraves da URL
    const id = Number(useSearchParams().get("id"))
    // armazenar dados da categoria
    const [nameCategory, setNameCategory] = useState <string> ("") 
    // estado para controle de carregamento
    const [loading, setLoading] = useState <boolean> (false)  
    // estado para controle de erro
    const [error, setError] = useState <string | null> (null)
    //estado para controle de sucesso 
    const [success, setSuccess] = useState <string | null> (null)

    //função para fazer a requisição para a API PEGAR os dados
    const fetchCategories = async () => {
        try{
            //iniciar o carregamento 
            setLoading(true)
            //fazer a requisição de dados para a API
            const response = await instance.get(`/product-categories/${id}`)
            //guardar os dados encontrados
            setNameCategory(response.data.name)
        }
        catch (error: any){
            //verificar de exite algum erro de validação
            if(error.response && error.response.data && error.response.data.menssage){
                //mostrar menssagem de erro caso seja um array
                if(Array.isArray(error.response.data.menssage)) {
                    setError(error.response.data.menssage.join(" - "))
                }
                else{
                    //mostrar menssagem de erro caso seja somente uma menssagem
                    setError(error.response.data.menssage)
                }
            }
            else {
                setError("erro ao editar categoria de produto tente novamente")
            }    
        }
        finally{
            //parar carregamento
            setLoading(false)
        }
    }
    //função para pazer requisição para a API e editar os dados
    const handleSubmit = async (event: React.FormEvent) => {
        //nao recarregar a pagina apos enviar formulario 
        event.preventDefault()
        //iniciar o carregamento
        setLoading(true)
        //limpar campo erro anterior
        setError(null)
        // limpar acerto anterior
        setSuccess(null)

        try{
            //fazer a requisição para a API
            const response = await instance.put(`/product-categories/${id}`, {
                name: nameCategory
            })
            //mostrar mensagem de sucesso 
            setSuccess(response.data.menssage || "Categoria de produto editada com sucesso!")
            //limpar o campo do formulario
            setNameCategory("")
        }
        catch(error: any){
            // verificar se existe erro de validação
            if (error.response && error.response.data && error.response.data.menssage){
                //mostrar mensagem de erro caso seja um array
                if(Array.isArray(error.response.data.menssage)){
                    setError(error.response.data.menssage.join(" - "))
                }
                
                else {
                    //mostrar mensagem em caso de n ser array
                    setError(error.response.data.menssage)
                }
            }
            else{
                //mostrar mensagem generica de erro
                setError("erro ao editar a categoria do produto")
            }
        }
        finally{
            //finalizar carregamento
            setLoading(false)
        }
    }
    //Hook para atualizar a pagina quando o componente mudar
    useEffect(() => {
        if(id) {
            //faz nova solicitação para a API
            fetchCategories()
        }
    },[id])//atualiza apagina sempre que o id mudar
    
    //parte visual da aplicação
    return (
        <ProtectedRoute>
            <Menu /><br />
            <Link href={`/product-categories/list`}> List</Link>
    
            <h1>Editar categoria de produto</h1>
            {/* verificar carregameno */}
            {loading && <p>carregando...</p>}
            {/* exibir mensagem de erro caso tenha */}
            {error && <p>{error}</p>}
            {/* exibir menssagem de sucesso caso tenha */}
            {success && <p>{success}</p>}

            
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="nameCategory">Nome da Categoria: </label>
                    <input 
                        type="text" 
                        value={nameCategory}
                        id="nameCategory"
                        placeholder="nome da categoria"
                        onChange={(e) => setNameCategory(e.target.value) }
                    />
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? "eviando": "Salvar"}
                </button>
            </form>
            
        </ProtectedRoute>

    )
}
