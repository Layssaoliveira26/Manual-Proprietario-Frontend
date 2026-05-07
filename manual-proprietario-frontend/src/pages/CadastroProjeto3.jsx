import { useState } from "react";
import BarraLateral from "../components/BarraLateral";
import MenuInicial from "../components/MenuInicial";
import { LuUpload } from "react-icons/lu";
import BarraNumeros from "../components/BarraNumeros";
import { Link } from "react-router-dom"

function CadastroProjeto3() {
    const [arquivos, setArquivos] = useState({});
    
    const projetos = [
        { id: "projArquitetonico", label: "Projeto Arquitetônico" },
        { id: "projEstrutural", label: "Projeto Estrutural" },
        { id: "projHidrossanitario", label: "Projeto Hidrossanitário" },
        { id: "projEletrico", label: "Projeto Elétrico" },
    ];

    function atualizarArquivo(id, e) {
        const arquivo = e.target.files[0];
        if (!arquivo) return;
        const novosArquivos = { ...arquivos, [id]: arquivo };
        setArquivos(novosArquivos);
    }

    return (
        <div className="h-svh flex flex-col overflow-hidden">
            <MenuInicial />
            <div className="flex flex-1 overflow-hidden">
                <BarraLateral />
                <main className="w-full overflow-y-auto px-10 py-8">
                    <h3 className="page-title pl-2">Configurar Projeto</h3>
                    <BarraNumeros />
                    <div className="flex flex-col justify-center mt-10">
                        <form action="">
                            <div className="flex justify-center text-center gap-6">
                                {projetos.map((proj) => (
                                    <div key={proj.id} className="flex flex-col w-full max-w-1/4 gap-2">
                                        <label htmlFor={proj.id} className="text-[var(--laranja-principal)] font-medium text-sm">
                                            {proj.label}
                                        </label>
                                        <label
                                            htmlFor={proj.id}
                                            className="flex flex-col items-center justify-center gap-2 w-full h-32 border border-[#dcdcdc] rounded-lg cursor-pointer hover:bg-gray-50 transition"
                                        >
                                            {arquivos[proj.id] ? (
                                                <>
                                                    <LuUpload className="text-[var(--laranja-principal)] text-xl" />
                                                    <span className="text-xs text-[var(--laranja-principal)] font-medium px-2 truncate w-full text-center">
                                                        {arquivos[proj.id].name}
                                                    </span>
                                                </>
                                            ) : (
                                                <>
                                                    <LuUpload className="text-[#aaa] text-xl" />
                                                    <span className="text-xs text-[#aaa]">Importar arquivo</span>
                                                </>
                                            )}
                                            <input
                                                type="file"
                                                id={proj.id}
                                                className="hidden"
                                                onChange={(e) => atualizarArquivo(proj.id, e)}
                                            />
                                        </label>
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-center items-center gap-3 mt-50">
                                <Link
                                    to="/cadastro-projeto2"
                                    className="w-full max-w-37.5 py-3 px-4 text-center text-(--laranja-principal) border-(--laranja-principal) border-2 rounded-md font-medium"
                                >
                                    Anterior
                                </Link>
                                <button type="submit" className="w-full max-w-37.5 py-3 px-4 bg-(--laranja-principal) text-white rounded-md font-medium">Próximo</button>
                            </div>
                        </form>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default CadastroProjeto3;