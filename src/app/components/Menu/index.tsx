//importar hook usado para meniulçar a navegação do usuario 
import { useRouter } from "next/navigation"

const Menu = () => {
    //istanciar o objeto router 
    const router= useRouter()

    const handleLogaut = () => {
        //remover o token do local storage
        localStorage.removeItem("token")
        //redireciona para a pagina login
        router.push("/login")
    } 
    return (
        <nav>
            <ul>
                <li><a href="/">Dashboard</a></li>
                <li><a href="situation/list">Situações</a></li>
                <li><a href="product-situations/list">Situações de Produto</a></li>
                <li><a href="product-categories/list">Categoria de Produto</a></li>
                <li><a href="#" onClick={handleLogaut}>SAIR</a></li>
            </ul>
        </nav>
    )
}

export default Menu