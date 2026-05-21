import { useState, useEffect } from 'react'; 
import BarraLateral from "../components/BarraLateral"
import MenuInicial from "../components/MenuInicial"
import { MdOutlineEngineering } from "react-icons/md";
import { Link } from "react-router-dom";
import { buscarDadosDashboard } from "../services/homeService";

function getClasseStatus(status) {
    switch(status) {
        case "Entregue":
            return "td-entregue";
        case "Em construção":
            return "td-construcao";
        case "Desativado":
            return "td-desativado";
        default:
            return "td-padrao";
    }
}

function Projetos({ onLogout }) {
    const [projetos, setProjetos] = useState([]); 
    const [carregando, setCarregando] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        let ativo = true;

        const carregarDados = async () => {
            try {
                setCarregando(true);

                const dados = await buscarDadosDashboard(searchTerm);

                if (!ativo) {
                    return;
                }

                setProjetos(dados.projetos);
            } catch (error) {
                console.error("Erro ao carregar projetos:", error);
            } finally {
                if (ativo) {
                    setCarregando(false);
                }
            }
        };

        carregarDados();

        return () => {
            ativo = false;
        };
    }, [searchTerm]);

    return (
        <div className="h-svh flex flex-col overflow-hidden">
            <MenuInicial onSearchChange={setSearchTerm} />
            <div className="flex flex-1 overflow-hidden">
                <BarraLateral onLogout={onLogout}/>
                <main className="w-full overflow-y-auto px-10 py-8">
                    <div className="flex items-center text-center justify-between">
                        <h3 className="page-title pl-2">Projetos recentes</h3>
                        <Link to="/cadastro-projeto">
                            <button className="text-md px-4 h-10 rounded-sm border-2 font-semibold border-[var(--cor-azul)] text-[var(--cor-azul)] hover:bg-[var(--cor-azul)] hover:text-white transition-all">
                                Criar novo projeto
                            </button>
                        </Link>
                    </div>
                    
                    <div className="w-full overflow-x-auto overflow-y-visible p-2">
                        <table className="tb-manuais w-full">
                            <colgroup>
                                <col className="w-1/4" />
                                <col className="w-1/4" />
                                <col className="w-1/4" />
                                <col className="w-1/4" />
                            </colgroup>
                            <thead>
                                <tr className="cabecalho bg-[var(--laranja-principal)] text-white text-sm text-left font-semibold">
                                    <th className="py-4 px-6">PROJETO</th>
                                    <th className="py-4 px-6">RESPONSÁVEL</th>
                                    <th className="py-4 px-6">STATUS</th>
                                    <th className="py-4 px-6">ÚLTIMA ATUALIZAÇÃO</th>
                                </tr>
                            </thead>
                            <tbody>
                                {carregando ? (
                                    <tr>
                                        <td colSpan={4} className="py-10 text-center">Carregando projetos...</td>
                                    </tr>
                                ) : projetos.length > 0 ? (
                                    projetos.map((projeto) => (
                                        <tr key={projeto.id}>
                                            <td className="py-5 px-6 font-medium">{projeto.projeto}</td>
                                            <td className="py-5 px-6">{projeto.responsavel}</td>
                                            <td className="py-5 px-6">
                                                <div className={getClasseStatus(projeto.status)}>
                                                    {projeto.status}
                                                </div>
                                            </td>
                                            <td className="py-5 px-6">{projeto.ultimaAtualizacao}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="py-10 px-6">
                                            <div className="w-full flex flex-col items-center text-center mt-14 mb-14">
                                                <MdOutlineEngineering className="w-40 h-40 text-[#455a641e]" />
                                                <h4 className="text-gray-400">Você não possui nenhum projeto</h4>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </main>
            </div>
        </div>
    )
}

export default Projetos;