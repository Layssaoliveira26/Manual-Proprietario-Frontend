import { useLocation } from "react-router-dom";

function MenuInicial() {
    const localizacao = useLocation();
    const ocultarNasRotasDeCadastro = [
        "/cadastro-projeto",
        "/cadastro-projeto2",
        "/cadastro-projeto3",
    ].includes(localizacao.pathname);
    const mostrarComponente = !ocultarNasRotasDeCadastro;

    return (
        <div className="flex items-center justify-between px-10 py-6 bg-white">
            <div className="flex items-center">
                <img src="/src/assets/svg/logo-portal.svg" alt="" className="w-12"/>
                <h5 className="pl-2">Manual do Proprietário</h5>
                {/* <h5 className="pl-12">Início</h5> */}
            </div>
            <div className="flex justify-end items-center">
                <div className="relative ">
                    {mostrarComponente && (
                        <>
                            <input
                                type="text"
                                placeholder="Pesquisar Projetos ou Manuais"
                                className="min-w-md py-3.25 px-4 border border-[#dcdcdc] rounded-r-md text-sm text-[#333]"
                            />
                            <img
                                src="/src/assets/svg/lupa.svg"
                                className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                            />
                        </>
                    )}
                    
                </div>
                
            </div>
        </div>
    )
}

export default MenuInicial