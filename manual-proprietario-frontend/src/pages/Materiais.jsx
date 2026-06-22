import { useState, useEffect } from 'react';
import BarraLateral from "../components/BarraLateral";
import MenuInicial from "../components/MenuInicial";
import { MdOutlineHandyman } from "react-icons/md";
import { Link } from "react-router-dom";
import { IoSettingsOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

// Mock de dados de materiais
const materiaisMock = [
    {
        id: "projeto-gabriel-apto",
        projeto: "Reforma do Apartamento do Gabriel",
        responsavel: "Gabriel Ribeiro",
        status: "Em construção",
        ultimaAtualizacao: "25/03/2025",
    },
    {
        id: "projeto-exemplo",
        projeto: "Projeto de Exemplo",
        responsavel: "Layssa Oliveira",
        status: "Entregue",
        ultimaAtualizacao: "02/01/2026",
    },
    {
        id: "projeto-pamela-apto",
        projeto: "Adequações do Apartamento da Pâmela",
        responsavel: "Gabriela Coutinho",
        status: "Desativado",
        ultimaAtualizacao: "29/04/2026",
    },
    {
        id: "projeto-casa-cicero",
        projeto: "Casa do Cícero Igor",
        responsavel: "Cícero Higor",
        status: "Entregue",
        ultimaAtualizacao: "05/06/2024",
    },
    {
        id: "projeto-predio-luiz-henrique",
        projeto: "Prédio do Luiz Henrique",
        responsavel: "Luiz Henrique",
        status: "Em construção",
        ultimaAtualizacao: "29/04/2026",
    },
    {
        id: "projeto-sobrado-pedro-botelho",
        projeto: "Sobrado do Pedro Botelho",
        responsavel: "Pedro Botelho",
        status: "Em construção",
        ultimaAtualizacao: "29/04/2026",
    },
];

function getClasseStatus(status) {
    switch (status) {
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

function Materiais({ onLogout }) {
    const [materiais, setMateriais] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        // Simula carregamento assíncrono com filtro por searchTerm
        // setCarregando(true);
        const timeout = setTimeout(() => {
            const filtrados = materiaisMock.filter((item) =>
                item.projeto.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.responsavel.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setMateriais(filtrados);
            setCarregando(false);
        }, 300);

        return () => clearTimeout(timeout);
    }, [searchTerm]);

    return (
        <div className="h-svh flex flex-col overflow-hidden">
            <MenuInicial onSearchChange={setSearchTerm} />
            <div className="flex flex-1 overflow-hidden">
                <BarraLateral onLogout={onLogout} />
                <main className="w-full overflow-y-auto px-10 py-8">
                    <div className="flex items-center text-center justify-between">
                        <h3 className="page-title pl-2">Materiais</h3>
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
                                <tr className="cabecalho bg-(--laranja-principal) text-white text-sm text-left font-semibold">
                                    <th className="py-4 px-6">PROJETO</th>
                                    <th className="py-4 px-6">RESPONSÁVEL</th>
                                    <th className="py-4 px-6">STATUS</th>
                                    <th className="py-4 px-6">ÚLTIMA ATUALIZAÇÃO</th>
                                </tr>
                            </thead>
                            <tbody>
                                {carregando ? (
                                    <tr>
                                        <td colSpan={4} className="py-10 text-center">
                                            Carregando materiais...
                                        </td>
                                    </tr>
                                ) : materiais.length > 0 ? (
                                    materiais.map((item) => (
                                        <tr
                                            key={item.id}
                                            className="cursor-pointer hover:bg-gray-50 transition-colors"
                                            onClick={() => navigate(`/materiais/${item.id}`)}
                                        >
                                            <td className="py-5 px-6 font-medium">{item.projeto}</td>
                                            <td className="py-5 px-6">{item.responsavel}</td>
                                            <td className="py-5 px-6">
                                                <div className={getClasseStatus(item.status)}>
                                                    {item.status}
                                                </div>
                                            </td>
                                            <td className="py-5 px-6">
                                                <div className="flex items-center justify-center gap-15 text-center">
                                                    <span className="text-center">{item.ultimaAtualizacao}</span>
                                                    <IoSettingsOutline
                                                        className="w-5 h-5 cursor-pointer"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            navigate(`/materiais/${item.id}`);
                                                        }}
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="py-10 px-6">
                                            <div className="w-full flex flex-col items-center text-center mt-14 mb-14">
                                                <MdOutlineHandyman className="w-40 h-40 text-[#455a641e]" />
                                                <h4 className="text-gray-400">Nenhum material encontrado</h4>
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
    );
}

export default Materiais;