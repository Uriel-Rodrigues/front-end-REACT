'use client'

//importar hooks do react
import React, { useState } from "react"

//importa o componente de SaideBar
import SideBar from "../SideBar";

//importa o componente da NavBar
import NavBar from "../NavBar";

//importar o componente de proteção de rotas
import ProtectedRoute from "../ProtectedRoute";

const Layout = ({children} : {children: React.ReactNode}) => {
    
    //estado para controlar se a sidebar estara aberta ou fechada
    const [isOpen, setIsOpen] = useState(false)

    return (
        <ProtectedRoute>

            <div className="bg-dashboard">

                <NavBar setIsOpen={setIsOpen}/>

                <div className="flex">

                    <SideBar isOpen={isOpen} setIsOpen={setIsOpen}/>

                    {children}

                </div>
 
            </div>
        </ProtectedRoute>
    )
}

export default Layout