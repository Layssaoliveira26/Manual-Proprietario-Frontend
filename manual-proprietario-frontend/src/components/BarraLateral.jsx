import { NavLink } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function BarraLateral( {onLogout} ) {
    const token = localStorage.getItem("token");
    let homePath = "/";
    if (token) {
        try {
            const decoded = jwtDecode(token);
            if (decoded?.profile) homePath = `/${decoded.profile}`;
        } catch {
            // ignore invalid token
        }
    }
    
    return (
        <div className="h-full w-1/5 shrink-0 bg-white">
            <h6>
                <NavLink
                    to={homePath}
                    className={({ isActive }) => (isActive ? "active" : "")}
                    end
                >
                    Início
                </NavLink>
            </h6>
            <h6>
                <NavLink to="/manuais" className={({ isActive }) => (isActive ? "active" : "")}>
                    Manuais
                </NavLink>
            </h6>
            <h6>
                <NavLink to="/projetos" className={({ isActive }) => (isActive ? "active" : "")}>
                    Projetos
                </NavLink>
            </h6>
            <h6>Materiais</h6>
            <hr className="border-t-3 border-[#dcdcdc] my-5 mx-10"/>
            <h6 className="text">Minha Conta</h6>
            <h6 className="h6-sair cursor-pointer" onClick={onLogout}>Sair</h6>
        </div>
    )
}

export default BarraLateral