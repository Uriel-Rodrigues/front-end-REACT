'use client'
import Menu from "../components/Menu";
//importar o componente de proteção de rotas
import ProtectedRoute from "../components/ProtectedRoute";

export default function Dashboard() {
    return (
        <ProtectedRoute>
            <Menu />

            <h1>Bem-vindo Dashboard Uriel!</h1>
        </ProtectedRoute>
    )

}