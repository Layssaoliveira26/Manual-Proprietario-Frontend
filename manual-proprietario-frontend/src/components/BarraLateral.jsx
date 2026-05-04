import { Link } from "react-router-dom"

function BarraLateral() {
    
    return (
        <div className="h-full w-1/5 shrink-0 bg-white">
            <h6><Link to="/home">Início</Link> </h6>
            <h6><Link to="/manuais">Manuais</Link></h6>
            <h6><Link to="/projetos">Projetos</Link></h6>
            <h6>Materiais</h6>
            <hr className="border-t-3 border-[#dcdcdc] my-5 mx-10"/>
            <h6 className="text">Minha Conta</h6>
            <h6 className="h6-sair"><Link to="/login">Sair</Link></h6>
        </div>
    )
}

export default BarraLateral