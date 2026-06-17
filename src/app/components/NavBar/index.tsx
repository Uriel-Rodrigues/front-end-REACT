'use client'

//importa hooks para manipular a navegação do usuario
import { useRouter } from "next/navigation";

const NavBar = () => {

    //istanciar o objeto router 
    const router= useRouter()

    const handleLogaut = () => {
        //remover o token do local storage
        localStorage.removeItem("token")
        //redireciona para a pagina login
        router.push("/login")
    }

    return (
        <div>
            {/* <!-- Navbar --> */}
            <nav className="navbar">
                <div className="navbar-container">
                    <button id="toggleSidebar" className="menu-button">
                        <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/>
                        </svg>
                    </button>
                    <div className="user-container">
                        <div className="relative">
                            {/* <!-- Dropdown --> */}
                            <button id="userDropdowButton" className="dropdown-button">
                                Usuario
                                <svg className="ml-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd"
                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                        clipRule="evenodd" />
                                </svg>
                            </button>
                            {/* <!-- conteudo do dropdown --> */}
                            <div id="dropdownContent" className="dropdown-content hidden">
                                <a href="#" className="dropdown-item ">Perfil</a>
                                <a href="#" onClick={handleLogaut} className="dropdown-item ">Sair</a>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </div>
    )
}

export default NavBar