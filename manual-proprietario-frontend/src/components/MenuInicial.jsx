
import { useEffect, useState } from "react";

function MenuInicial({ onSearchChange }) {
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const timeoutId = window.setTimeout(() => {
            if (typeof onSearchChange === "function") {
                onSearchChange(searchTerm.trim());
            }
        }, 350);

        return () => window.clearTimeout(timeoutId);
    }, [searchTerm, onSearchChange]);

    return (
        <div className="flex items-center justify-between px-10 py-6 bg-white">
            <div className="flex items-center">
                <img src="/src/assets/svg/logo-portal.svg" alt="" className="w-12"/>
                <h5 className="pl-2">Manual do Proprietário</h5>
                {/* <h5 className="pl-12">Início</h5> */}
            </div>
            <div className="flex justify-end items-center">
                <select name="" id="" className="w-40 h-12 m-0 border border-[#dcdcdc] rounded-l-md text-sm text-[#333333a6]">
                    <option value="" className="text-sm text-[#7c3d3d]">Todos</option>
                </select>
                <div className="relative ">
                    <input 
                        type="text" 
                        placeholder="Pesquisar Projetos ou Manuais" 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="min-w-md py-[13px] px-4 border border-[#dcdcdc] rounded-r-md text-sm text-[#333]"  
                    />
                    <img src="src/assets/svg/lupa.svg" className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"/> 
                </div>
                
            </div>
        </div>
    )
}

export default MenuInicial