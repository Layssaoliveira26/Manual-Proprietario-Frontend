import BarraLateral from "../components/BarraLateral";
import MenuInicial from "../components/MenuInicial";
import { useState } from "react";
import BarraNumeros from "../components/BarraNumeros";
import { Link } from "react-router-dom";

function CadastroProjeto2() {
    const [qtdCampos, setQtdCampos] = useState(1);

    function adicionarCampos(e) {
        e.preventDefault();
        setQtdCampos(qtdCampos+1);
    }

    return (
        <div className="h-svh flex flex-col overflow-hidden">
            <MenuInicial />
            <div className="flex flex-1 overflow-hidden">
                <BarraLateral />
                <main className="w-full overflow-y-auto px-10 py-8">
                    <h3 className="page-title pl-2">Configurar Projeto</h3>
                    <div className="relative flex w-fit mx-auto gap-15 mb-5 before:content-[''] before:absolute before:top-5 before:left-5 before:right-6 before:h-0.5 before:bg-[rgba(0,0,0,0.123)]">
                        <BarraNumeros />
                    </div>
                    <div className="flex flex-col justify-center">
                        <form action="">
                            {Array.from({ length: qtdCampos}).map((_,index) => (
                                <div key={index} className="flex flex-col lg:flex-row gap-10 w-full mb-5">
                                    <div className="flex flex-col w-full">
                                        <label for="rua">Nome do Funcionário*</label>
                                        <input type="text" placeholder="Nome do Funcionário" className="w-full min-w-0 mt-3 mb-3 px-4 py-3.5 border border-[#dcdcdc] rounded-lg text-sm text-[#333] outline-none" required/>
                                    </div>
                                    <div className="flex flex-col w-full">
                                        <label for="">Cargo</label>
                                        <select name="" className="w-full min-w-0 mt-3 mb-3 px-4 py-3.5 border border-[#dcdcdc] rounded-lg text-sm text-[#333] outline-none">
                                            <option value="" className="w-full min-w-0 mt-3 mb-3 px-4 py-3.5 border border-[#dcdcdc] rounded-lg text-sm text-[#333] outline-none">Pedreiro</option>
                                        </select>
                                        
                                        
                                    </div>
                                </div>
                            ))}
                            <div className="flex justify-center items-center">
                                <button className="w-full max-w-[60px] py-3 px-4  text-[var(--laranja-principal)] border-[var(--laranja-principal)] border-2 rounded-md font-medium" onClick={adicionarCampos}>+</button>
                            </div>
                            <div className="flex justify-center items-center gap-3 mt-50">
                                <Link
                                    to="/cadastro-projeto"
                                    className="w-full max-w-37.5 py-3 px-4 text-center text-(--laranja-principal) border-(--laranja-principal) border-2 rounded-md font-medium"
                                >
                                    Anterior
                                </Link>
                                <button type="button" className="w-full max-w-37.5 py-3 px-4 bg-(--laranja-principal) text-white rounded-md font-medium"><Link to="/cadastro-projeto3">Próximo</Link></button>
                            </div>
                        </form>
                    </div>
                </main>
            </div>
        </div>
    );
     
}

export default CadastroProjeto2