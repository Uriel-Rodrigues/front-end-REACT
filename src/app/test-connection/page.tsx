//a diretiva é usada para indicar que este com´pomponente é executado no cliente (browser)
//essa diretiva é especifica para next.js 13+ quando se utiliza a renderização no lado do cliente
'use client'

//importar hooks do react para usar o estado e os efeitos colaterais
import { useEffect, useState } from "react";

//importar a instancia do axios configurada para fazer requisições para a API
import instance from "@/services/api";

export default function TestConnection(){
    //cria um estado para armazenar a mensagem que sera exibida na tela
    //o valor inicial é "carregando...", que será substituido apos a tentativa de conexão
    const [message,setMessage] = useState<string>("carregando...");

    useEffect(() => {
        //função assincrona para testar a conexão com a API
        const testConnection = async () => {
            try{
                //testar fazer uma requisição GET para o endpoint "/test-connection"
                const response = await instance.get("/test-connection");
                //se a requisição for bem sucedida, atualia a mensagem com a resposta da API
                setMessage(response.data.menssage || "Conexão com a API realizada com sucesso!")
            }catch(error: any) {
                //caso ocorra um erro na requisição, exibe o erro no console e define uma mensagem de erro
                console.error("Erro ao testar a conexão:", error);
                setMessage(`erro ao conectar com a API: ${error}`);
            }
        }
        //chama a função para testar a conexão assim que o componente for montado
        testConnection();
    }, []);// a dependencia vazia [] faz com que o useEffect execute apenas uma vez, após o componente ser montado
    
    return(
        <div>
            {/* exibir a mensagem de status da conexão */}
            {message}<br>
            </br>
        </div>
    )
}