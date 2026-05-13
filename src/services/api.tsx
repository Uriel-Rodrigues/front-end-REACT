//importar o axios e o tipo axiosInstance para tipagem de instancia
import axios, { AxiosInstance } from "axios";

//Definir o tipo para a instancia do Axios
//criar uma instancia persnalizada do axios com configuração padrão
const instance: AxiosInstance = axios.create({
    baseURL: "http://localhost:8080",// definir a URL base para todas as requisições 
    headers:{
        "Content-Type": "application/json" // definir o cabeçalho padrão para envio de dados no formato JSON
    }
})

//exportar a instancia do axios para ser utilizada em outras partes do projeto
export default instance;