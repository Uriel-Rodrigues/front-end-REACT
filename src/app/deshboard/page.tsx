'use client'
//importa hooks de react para usar o estado "useState" e os efeitos colateria "useEffect"
import { useEffect, useState } from "react";
//importar componente de layout
import Layout from "../components/Layout";
//importar componente grafico de usuarios
import UsersBarChart from "../components/Graphic/User/UsersBarChart";
//importar componente grafico de produtos
import ProductsAreaChart from "../components/Graphic/Product/AreaChart";
// importar animação spinner para carregando
import LoadingSpinner from "../components/LoadingSpinner";
//importar o componente para apresentar os alertas
import AlertMessage from "../components/AlertMessage";
import instance from "@/services/api";

//definir interface para os dados dos graficos
interface UsersReport{
    month: string,
    users: number
    
}
interface ProductsReport{
    month: string,
    products: number

}

export default function Dashboard() {

    //estado para controle de carregamento 
    const [loading, setLoading] = useState <boolean> (false) 
    //estado para controle de erro 
    const [error, setError] = useState <string | null> (null)
    //estado para controle de sucesso 
    const [success, setSuccess] = useState <string | null> (null)
    //estado para armazenar os dados do grafico usuarios
    const [usersReport,setUsersReport] = useState<UsersReport []> ([])
    //estado para armazenar os dados do grafico produtos
    const [productsReport,setProductsReport] = useState<ProductsReport []> ([])

    const fetchReports = async () => {
        try {
            
            //inicia o carregamento
            setLoading(true)
            //limpa o erro anterior
            setError(null)
            //limpa o sucesso anterior
            setSuccess(null)

            //fazer multiplas requisições para a api
            const [usersReport, productsReport] = await Promise.all([
                instance.get(`/users-report`),
                instance.get(`/products-report`)
            ])
            
            //atribuir os dados que a API retornou
            setUsersReport(usersReport.data)
            setProductsReport(productsReport.data)

        }
        catch{
            //criar mensagem generica de erro
            setError("erro ao carrgar os dados do dashboard!")

        }
        finally{
            //termina o carregamento em caso de erro
            setLoading(false)
        }
    }
    //buscar os dados ao carregar a pagina
    useEffect(() => {
        fetchReports()
    },[])

    return (
        <Layout>
            {/* <!-- conteudo principal --> */}
            <main className="main-content">
                {/* <!-- titulo a trilha de navegação --> */}
                <div className="content-wrapper">
                    <div className="content-header">
                        <h2 className="content-title">Dashboard</h2>
                        <nav className="breadcrumb">
                            <span>Dashboard</span>
                        </nav>
                    </div>
                </div>

                <div className="content-box">
                    <div className="content-box-header">
                        <h3 className="content-box-title">pagina inicial</h3>
                        <div className="content-box-btn">botão</div>
                    </div>

                    {/* mostrar carregamento */}
                    {loading && <LoadingSpinner/>}
                    {/* mostrar erro caso tenha */}
                    <AlertMessage type="error" message={error}/>
                    {/* mostrar sucesso caso tenha */}
                    <AlertMessage type="success" message={success}/>

                    <div className="flex flex-col md:flex-row items-center justify-center py-5 gap-5">
                        
                        <UsersBarChart  data={usersReport}/>

                        <ProductsAreaChart data={productsReport} />

                    </div>

                </div>
            </main>
        </Layout>
    )

}