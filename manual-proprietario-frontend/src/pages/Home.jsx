import { useState, useEffect } from "react";
import BarraLateral from "../components/BarraLateral"
import MenuInicial from "../components/MenuInicial"
import { MdOutlineEngineering } from "react-icons/md";
import { buscarDadosDashboard } from "../services/homeService";

function getClasseStatus(status) {
    switch(status) {
        case "Em construção":
            return "td-construcao";
        case "Entregue":
            return "td-entregue";
        case "Desativado":
            return "td-desativado";
        default:
            return "td-pendente";
    }
}

function Home({ onLogout }) {
    const [manuais, setManuais] = useState([]);
    const [projetos, setProjetos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        let ativo = true;

        const carregar = async () => {
            try {
                setLoading(true);

                const dados = await buscarDadosDashboard(searchTerm);
                if (!ativo) {
                    return;
                }

                setManuais(dados.manuais);
                setProjetos(dados.projetos);
            } catch (error) {
                console.error("Erro ao carregar dashboard:", error);
            } finally {
                if (ativo) {
                    setLoading(false);
                }
            }
        };

        carregar();

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
                    
                    <h3 className="page-title pl-2">Manuais recentes</h3>
                    <div className="w-full overflow-x-auto overflow-y-visible p-2 mb-6">
                        <table className="tb-manuais w-full">
                            <colgroup>
                                <col className="w-1/4" /><col className="w-1/4" />
                                <col className="w-1/4" /><col className="w-1/4" />
                            </colgroup>
                            <thead>
                                <tr className="cabecalho bg-(--laranja-principal) text-white text-sm text-left rounded-2xl font-semibold">
                                    <th className="py-4 px-6">MANUAL</th>
                                    <th className="py-4 px-6">RESPONSÁVEL</th>
                                    <th className="py-4 px-6">STATUS</th>
                                    <th className="py-4 px-6">ÚLTIMA ATUALIZAÇÃO</th>
                                </tr>
                            </thead>
                            <tbody className="">
                                {manuais.length > 0 ? (
                                    manuais.map((manual) => (
                                        <tr key={manual.id}>
                                            <td className="py-5 px-6">{manual.manual}</td>
                                            <td className="py-5 px-6">{manual.responsavel}</td>
                                            <td className="py-5 px-6">
                                                <div className={getClasseStatus(manual.status)}>
                                                    {manual.status}
                                                </div>
                                            </td>
                                            <td className="py-5 px-6">{manual.ultimaAtualizacao}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="py-10 px-6">
                                            <div className="w-full flex flex-col items-center text-center mt-14 mb-14">
                                                <MdOutlineEngineering className="w-40 h-40 text-[#455a641e]" />
                                                <h4>{loading ? "Carregando..." : "Você não possui nenhum manual"}</h4>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <h3 className="page-title pl-2">Projetos recentes</h3>
                    <div className="w-full overflow-x-auto overflow-y-visible p-2">
                        <table className="tb-manuais w-full">
                            <colgroup>
                                <col className="w-1/4" /><col className="w-1/4" />
                                <col className="w-1/4" /><col className="w-1/4" />
                            </colgroup>
                            <thead>
                                <tr className="cabecalho bg-(--laranja-principal) text-white text-sm text-left rounded-2xl font-semibold">
                                    <th className="py-4 px-6">PROJETO</th>
                                    <th className="py-4 px-6">RESPONSÁVEL</th>
                                    <th className="py-4 px-6">STATUS</th>
                                    <th className="py-4 px-6">ÚLTIMA ATUALIZAÇÃO</th>
                                </tr>
                            </thead>
                            <tbody className="">
                                {projetos.length > 0 ? (
                                    projetos.map((projeto) => (
                                        <tr key={projeto.id}>
                                            <td className="py-5 px-6">{projeto.projeto}</td>
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
                                                <h4>{loading ? "Carregando..." : "Você não possui nenhum projeto"}</h4>
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

export default Home