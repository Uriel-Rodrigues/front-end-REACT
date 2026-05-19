//importa o componente menu 
import Link from "next/link"

export default function Home() {
  return (
    <div>
      <h1>bem vindo URIEL</h1>
      <br/>
      <Link href="/login" className="border">Login</Link>
    </div>
  )
}