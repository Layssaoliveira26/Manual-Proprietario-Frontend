import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { MdOutlineEngineering } from 'react-icons/md';
import { IoSettingsOutline } from 'react-icons/io5';
import BarraLateral from '../components/BarraLateral';
import MenuInicial from '../components/MenuInicial';
import { ModalSucesso } from '../components/ModalSucesso';
import { Paginacao } from '../components/Paginacao';
import { listarProjetos } from '../services/projectsService';

// ---------------------------------------------------------------------------
// Helpers de estilo de status (usa o label traduzido já normalizado)
// ---------------------------------------------------------------------------
function getClasseStatus(status) {
    switch (status) {
        case 'Em construção': return 'td-construcao';
        case 'Entregue':      return 'td-entregue';
        case 'Desativado':    return 'td-desativado';
        default:              return 'td-padrao';
    }
}

// ---------------------------------------------------------------------------
// Componente
// ---------------------------------------------------------------------------
function Projetos({ onLogout }) {
    const [projetos,    setProjetos]    = useState([]);
    const [carregando,  setCarregando]  = useState(true);
    const [erro,        setErro]        = useState(null);
    const [searchTerm,  setSearchTerm]  = useState('');

    const [paginaAtual, setPaginaAtual] = useState(1);
    const itensPorPagina = 10;

    const indiceInicio = (paginaAtual - 1) * itensPorPagina;
    const indiceFim = indiceInicio + itensPorPagina;
    const projetosPaginados = projetos.slice(indiceInicio, indiceFim);
    const totalPaginas = Math.ceil(projetos.length / itensPorPagina);

    const navigate = useNavigate();
    const location = useLocation();
    const [modalSucesso, setModalSucesso] = useState(false);

    useEffect(() => {
        let ativo = true;

        if (location.state?.sucessoCriacao) {
            setModalSucesso(true);
            // Limpa o state para não mostrar novamente se recarregar
            window.history.replaceState({}, document.title);
        }

        const fetchProjetos = async () => {
            try {
                setCarregando(true);
                setErro(null);

                const dados = await listarProjetos(searchTerm);

                if (!ativo) return;
                setProjetos(dados);
                setPaginaAtual(1);
            } catch (err) {
                if (!ativo) return;
                console.error('[Projetos] Erro ao carregar:', err);
                setErro('Não foi possível carregar os projetos. Tente novamente.');
            } finally {
                if (ativo) setCarregando(false);
            }
        };

        fetchProjetos();
        return () => { ativo = false; };
    }, [searchTerm]);

    // -------------------------------------------------------------------------
    // Render helpers — estados de UI
    // -------------------------------------------------------------------------
    const renderCorpo = () => {
        if (carregando) {
            return (
                <tr>
                    <td colSpan={4} className="py-10 text-center text-gray-400">
                        Carregando projetos...
                    </td>
                </tr>
            );
        }

        if (erro) {
            return (
                <tr>
                    <td colSpan={4} className="py-10 text-center text-red-500 font-medium">
                        {erro}
                    </td>
                </tr>
            );
        }

        if (projetosPaginados.length === 0) {
            return (
                <tr>
                    <td colSpan={4} className="py-10 px-6">
                        <div className="w-full flex flex-col items-center text-center mt-14 mb-14">
                            <MdOutlineEngineering className="w-40 h-40 text-[#455a641e]" />
                            <h4 className="text-gray-400">Você não possui nenhum projeto</h4>
                        </div>
                    </td>
                </tr>
            );
        }

        return projetosPaginados.map((projeto) => (
            <tr
                key={projeto.id}
                className="cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => navigate(`/projetos/${projeto.id}`)}
            >
                <td className="py-5 px-6 font-medium">{projeto.nomeProjeto}</td>
                <td className="py-5 px-6">{projeto.responsavel}</td>
                <td className="py-5 px-6">
                    <div className={getClasseStatus(projeto.status)}>
                        {projeto.status}
                    </div>
                </td>
                <td className="py-5 px-6">
                    <div className="flex items-center justify-center gap-15 text-center">
                        <span className="text-center">{projeto.ultimaAtualizacao}</span>
                        <IoSettingsOutline
                            className="w-5 h-5 cursor-pointer"
                            onClick={(e) => { e.stopPropagation(); navigate(`/projetos/${projeto.id}`); }}
                        />
                    </div>
                </td>
            </tr>
        ));
    };

    // -------------------------------------------------------------------------
    // Render principal
    // -------------------------------------------------------------------------
    return (
        <div className="h-svh flex flex-col overflow-hidden">
            <MenuInicial onSearchChange={setSearchTerm} />
            <div className="flex flex-1 overflow-hidden">
                <BarraLateral onLogout={onLogout} />
                <main className="w-full overflow-y-auto px-10 py-8">

                    <div className="flex items-center text-center justify-between">
                        <h3 className="page-title pl-2">Projetos recentes</h3>
                        <Link to="/cadastro-projeto">
                            <button className="text-md px-4 h-10 rounded-sm border-2 font-semibold border-(--cor-azul) text-(--cor-azul) hover:bg-(--cor-azul) hover:text-white transition-all">
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
                                <tr className="cabecalho bg-(--laranja-principal) text-white text-sm text-left font-semibold">
                                    <th className="py-4 px-6">PROJETO</th>
                                    <th className="py-4 px-6">RESPONSÁVEL</th>
                                    <th className="py-4 px-6">STATUS</th>
                                    <th className="py-4 px-6">ÚLTIMA ATUALIZAÇÃO</th>
                                </tr>
                            </thead>
                            <tbody>
                                {renderCorpo()}
                            </tbody>
                        </table>
                    </div>
                    <ModalSucesso 
                        isAberto={modalSucesso}
                        mensagem="Projeto criado com sucesso!"
                        subtexto="Seu novo projeto foi adicionado ao sistema."
                        onFechar={() => setModalSucesso(false)}
                    />
                    <Paginacao 
                        paginaAtual={paginaAtual}
                        totalPaginas={totalPaginas}
                        onMudarPagina={setPaginaAtual}
                    />
                </main>
            </div>
        </div>
    );
}

export default Projetos;