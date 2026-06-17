'use client'

//importar hooks do react
import React from "react"

//importa o componente de SaideBar
import SideBar from "../SideBar";

//importa o componente da NavBar
import NavBar from "../NavBar";

//importar o componente de proteção de rotas
import ProtectedRoute from "../ProtectedRoute";

const Layout = ({children} : {children: React.ReactNode}) => {
    return (
        <ProtectedRoute>
            <div className="bg-dashboard">
                <NavBar/>
                <SideBar/>
                {children}

            </div>
        </ProtectedRoute>
    )
}

export default Layout