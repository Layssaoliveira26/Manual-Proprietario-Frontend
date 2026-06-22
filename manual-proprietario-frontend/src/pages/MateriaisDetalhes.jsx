import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BarraLateral from "../components/BarraLateral";
import MenuInicial from "../components/MenuInicial";
import { IoSettingsOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import { materiaisDetalhesMock, AREAS } from "../mocks/materiaisDetalhesMock";
import { projetosMock } from '../mocks/projetos';

const AREA_CORES = {
    "Pinturas":       { bg: "#3B4FA8", text: "#fff" },
    "Luminárias":     { bg: "#1B2A6B", text: "#fff" },
    "Revestimentos":  { bg: "#C84B2F", text: "#fff" },
    "Louças e metais":{ bg: "#2E7D52", text: "#fff" },
};

function BadgeArea({ area }) {
    const cor = AREA_CORES[area] ?? { bg: "#888", text: "#fff" };
    return (
        <span
            style={{
                backgroundColor: cor.bg,
                color: cor.text,
                borderRadius: "999px",
                padding: "3px 14px",
                fontSize: "12px",
                fontWeight: 600,
                whiteSpace: "nowrap",
                display: "inline-block",
            }}
        >
            {area}
        </span>
    );
}

function MateriaisDetalhes({ onLogout }) {
    const { id } = useParams();
    const navigate = useNavigate();

    const projeto = projetosMock.find((p) => p.id === id);
    const todosMateriais = materiaisDetalhesMock[id] ?? [];

    const [areaSelecionada, setAreaSelecionada] = useState("Todos");
    const [materiais, setMateriais] = useState(todosMateriais);

    useEffect(() => {
        if (areaSelecionada === "Todos") {
            setMateriais(todosMateriais);
        } else {
            setMateriais(todosMateriais.filter((m) => m.area === areaSelecionada));
        }
    }, [areaSelecionada, id]);

    return (
        <div className="h-svh flex flex-col overflow-hidden">
            <MenuInicial />
            <div className="flex flex-1 overflow-hidden">
                <BarraLateral onLogout={onLogout} />
                <main className="w-full overflow-y-auto px-10 py-8">

                    <nav className="text-sm text-gray-400 mb-6 flex items-center gap-1">
                        <span
                            className="cursor-pointer hover:text-gray-600 transition-colors"
                            onClick={() => navigate("/materiais")}
                        >
                            Materiais
                        </span>
                        <span className="mx-1">›</span>
                        <span className="text-gray-700 font-medium">
                            {projeto?.projeto ?? "Projeto"}
                        </span>
                    </nav>

                    {/* Título + botão */}
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="page-title pl-2">Materiais</h3>
                        <Link to={`/materiais/${id}/adicionar`}>
                            <button className="text-md px-4 h-10 rounded-sm border-2 font-semibold border-(--cor-azul) text-(--cor-azul) hover:bg-(--cor-azul) hover:text-white transition-all">
                                Adicionar material
                            </button>
                        </Link>
                    </div>

                    {/* Filtros por área */}
                    <div className="flex items-center gap-3 mb-6 flex-wrap pl-2">
                        <span className="text-sm text-gray-500 font-medium mr-1">Filtrar por área:</span>
                        {AREAS.map((area) => {
                            const ativo = areaSelecionada === area;
                            return (
                                <button
                                    key={area}
                                    onClick={() => setAreaSelecionada(area)}
                                    className={`px-4 h-9 rounded-sm text-sm font-semibold border-2 transition-all ${
                                        ativo
                                            ? "bg-(--laranja-principal) border-(--laranja-principal) text-white"
                                            : "border-gray-300 text-gray-600 hover:border-gray-400"
                                    }`}
                                >
                                    {area}
                                </button>
                            );
                        })}
                    </div>

                    {/* Tabela */}
                    <div className="w-full overflow-x-auto overflow-y-visible p-2">
                        <table className="tb-manuais w-full">
                            <colgroup>
                                <col style={{ width: "30%" }} />
                                <col style={{ width: "20%" }} />
                                <col style={{ width: "25%" }} />
                                <col style={{ width: "25%" }} />
                            </colgroup>
                            <thead>
                                <tr className="cabecalho bg-(--laranja-principal) text-white text-sm text-left font-semibold">
                                    <th className="py-4 px-6">MATERIAL</th>
                                    <th className="py-4 px-6">ÁREA</th>
                                    <th className="py-4 px-6">CÔMODO</th>
                                    <th className="py-4 px-6">ÚLTIMA ATUALIZAÇÃO</th>
                                </tr>
                            </thead>
                            <tbody>
                                {materiais.length > 0 ? (
                                    materiais.map((item) => (
                                        <tr
                                            key={item.id}
                                            className="cursor-pointer hover:bg-gray-50 transition-colors"
                                        >
                                            <td className="py-5 px-6 font-medium">{item.material}</td>
                                            <td className="py-5 px-6">
                                                <BadgeArea area={item.area} />
                                            </td>
                                            <td className="py-5 px-6 text-gray-600">{item.comodo}</td>
                                            <td className="py-5 px-6">
                                                <div className="flex items-center justify-between gap-4">
                                                    <span>{item.ultimaAtualizacao}</span>
                                                    <IoSettingsOutline
                                                        className="w-5 h-5 text-gray-400 cursor-pointer hover:text-gray-600 transition-colors"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            navigate(`/materiais/${id}/editar/${item.id}`);
                                                        }}
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="py-10 px-6 text-center text-gray-400">
                                            Nenhum material encontrado para esta área.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                </main>
            </div>
        </div>
    );
}

export default MateriaisDetalhes;