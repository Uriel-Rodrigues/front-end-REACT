'use client'
import Menu from "../components/Menu";
//importar o componente de proteção de rotas
import ProtectedRoute from "../components/ProtectedRoute";
//importar componente de layout
import Layout from "../components/Layout";

export default function Dashboard() {
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

                    <div className="conten-box-body">
                        bem-vindo
                    </div>

                </div>
            </main>
        </Layout>
    )

}