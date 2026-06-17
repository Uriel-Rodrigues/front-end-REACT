import { useState } from "react";
import instance from "@/services/api";

interface DeleteButtonProps{
    id: string //ID da situaçãoa se excluida
    route: string //rota para requisição
    onSuccess?: () => void //função de callback apos sucesso
    setError: (menssage: string | null) => void //função de callback para retornar menssagem de erro 
    setSuccess: (menssage: string | null) => void //função de callback para retornar menssagem de sucesso
    className?: string
}

export default function DeleteButton({id, route, onSuccess, setError, setSuccess}: DeleteButtonProps){
    //estado para controle de carregamento 
    const [loading, setLoading] = useState <boolean> (false)
    
    const handleDelete = async () => {
        // evita multiplos cliques
        if(loading) {
            return
        }
        //iniciar o carregamento 
        setLoading(true)
        //limpa o erro anterior
        setError(null)
        //limpa o sucesso anterior
        setSuccess(null)
        try {
            //fa a solicitação para a API
            const response = await instance.delete (`/${route}/${id}`) //ex:/sitation/3
            //resposta de sucesso
            setSuccess(response.data.menssage || "erro ao apagar o registro")
            //chamar a função de sucesso 
            if(onSuccess){
                onSuccess()
            }
        }
        catch (error: any){
            //verifica se exite erro de validação
            setError(error.response?.data?.menssage || "erro ao deletar o registro")
        }
        finally{
            //temina o carregamento
            setLoading(false)
        }
    }
    return (
        <div>
            <button onClick={handleDelete} disabled = {loading} className="btn-danger hidden md:inline-block">
                {loading?"Excluindo..." : "Apagar"}
            </button>
        </div>
    )
}
