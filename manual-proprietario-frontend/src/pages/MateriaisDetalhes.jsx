import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import BarraLateral from '../components/BarraLateral';
import MenuInicial from '../components/MenuInicial';
import { IoSettingsOutline } from 'react-icons/io5';
import { MdOutlineHandyman } from 'react-icons/md';
import { listarMateriaisPorProjeto, AREAS } from '../services/materialsService';
import api from '../services/api';

// ---------------------------------------------------------------------------
// Helpers visuais
// ---------------------------------------------------------------------------

function getRoleAtual() {
    try {
        const token = localStorage.getItem('token');
        if (!token) return null;
        const decoded = jwtDecode(token);
        return decoded?.profile ?? null;
    } catch {
        return null;
    }
}

const AREA_CORES = {
    'Pinturas':        { bg: '#3B4FA8', text: '#fff' },
    'Luminárias':      { bg: '#1B2A6B', text: '#fff' },
    'Revestimentos':   { bg: '#C84B2F', text: '#fff' },
    'Louças e metais': { bg: '#2E7D52', text: '#fff' },
};

function BadgeArea({ area }) {
    const cor = AREA_CORES[area] ?? { bg: '#888', text: '#fff' };
    return (
        <span
            style={{
                backgroundColor: cor.bg,
                color:            cor.text,
                borderRadius:     '999px',
                padding:          '3px 14px',
                fontSize:         '12px',
                fontWeight:       600,
                whiteSpace:       'nowrap',
                display:          'inline-block',
            }}
        >
            {area}
        </span>
    );
}

// ---------------------------------------------------------------------------
// Componente principal
// ---------------------------------------------------------------------------

function MateriaisDetalhes({ onLogout }) {
    const { id } = useParams();          // id do projeto
    const navigate = useNavigate();
    const isProprietario = getRoleAtual() === 'PROPRIETARIO';

    // --- estados ---
    const [nomeProjeto,    setNomeProjeto]    = useState('');
    const [todosMateriais, setTodosMateriais] = useState([]); // todos vindos da API
    const [materiais,      setMateriais]      = useState([]); // filtrados por área
    const [areaSelecionada, setAreaSelecionada] = useState('Todos');
    const [carregando,     setCarregando]     = useState(true);
    const [erro,           setErro]           = useState(null);

    // --- busca inicial: nome do projeto + materiais ---
    useEffect(() => {
        let ativo = true;

        const fetchDados = async () => {
            try {
                setCarregando(true);
                setErro(null);

                // Requisições paralelas para nome do projeto e lista de materiais
                const [resNome, listaMateriais] = await Promise.all([
                    api.get(`/projects/${id}`).then((r) => r.data?.data?.nomeProjeto ?? '').catch(() => ''),
                    listarMateriaisPorProjeto(id),
                ]);

                if (!ativo) return;

                setNomeProjeto(resNome);
                setTodosMateriais(listaMateriais);
                setMateriais(listaMateriais); // começa com "Todos"
            } catch (err) {
                if (!ativo) return;
                console.error('[MateriaisDetalhes] Erro ao carregar:', err);
                setErro('Não foi possível carregar os materiais. Tente novamente.');
            } finally {
                if (ativo) setCarregando(false);
            }
        };

        fetchDados();
        return () => { ativo = false; };
    }, [id]);

    // --- filtragem local por área (sem nova requisição) ---
    useEffect(() => {
        if (areaSelecionada === 'Todos') {
            setMateriais(todosMateriais);
        } else {
            setMateriais(todosMateriais.filter((m) => m.area === areaSelecionada));
        }
    }, [areaSelecionada, todosMateriais]);

    // -------------------------------------------------------------------------
    // Render helper — corpo da tabela
    // -------------------------------------------------------------------------
    const renderCorpo = () => {
        if (carregando) {
            return (
                <tr>
                    <td colSpan={4} className="py-10 text-center text-gray-400">
                        Carregando materiais...
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

        if (materiais.length === 0) {
            return (
                <tr>
                    <td colSpan={4} className="py-10 px-6">
                        <div className="w-full flex flex-col items-center text-center mt-10 mb-10">
                            <MdOutlineHandyman className="w-32 h-32 text-[#455a641e]" />
                            <h4 className="text-gray-400">
                                {areaSelecionada === 'Todos'
                                    ? 'Nenhum material cadastrado neste projeto'
                                    : `Nenhum material encontrado para a área "${areaSelecionada}"`}
                            </h4>
                        </div>
                    </td>
                </tr>
            );
        }

        return materiais.map((item) => (
            <tr
                key={item.id}
                className="hover:bg-gray-50 transition-colors"
            >
                {/* Nome do material — exibe também marca e referência como subtexto */}
                <td className="py-5 px-6">
                    <p className="font-medium text-gray-800">{item.nomeMaterial}</p>
                    {(item.marca !== '—' || item.referencia !== '—') && (
                        <p className="text-xs text-gray-400 mt-0.5">
                            {[item.marca !== '—' && item.marca, item.referencia !== '—' && `Ref: ${item.referencia}`]
                                .filter(Boolean)
                                .join(' · ')}
                        </p>
                    )}
                </td>

                {/* Área — badge colorido */}
                <td className="py-5 px-6">
                    <BadgeArea area={item.area} />
                </td>

                {/* Cômodos — join do array agrupado vindo da API */}
                <td className="py-5 px-6 text-gray-600 text-sm">
                    {item.comodos}
                </td>

                {/* Última atualização + ações */}
                <td className="py-5 px-6">
                    <div className="flex items-center justify-between gap-4">
                        <span className="text-sm">{item.ultimaAtualizacao}</span>
                        {!isProprietario && (
                            <IoSettingsOutline
                                className="w-5 h-5 text-gray-400 cursor-pointer hover:text-gray-600 transition-colors flex-shrink-0"
                                onClick={() => navigate(`/materiais/${id}/editar/${item.id}`)}
                            />
                        )}
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
            <MenuInicial />
            <div className="flex flex-1 overflow-hidden">
                <BarraLateral onLogout={onLogout} />
                <main className="w-full overflow-y-auto px-10 py-8">

                    {/* Breadcrumb */}
                    <nav className="text-sm text-gray-400 mb-6 flex items-center gap-1">
                        <span
                            className="cursor-pointer hover:text-gray-600 transition-colors"
                            onClick={() => navigate('/materiais')}
                        >
                            Materiais
                        </span>
                        <span className="mx-1">›</span>
                        <span className="text-gray-700 font-medium">
                            {nomeProjeto || 'Projeto'}
                        </span>
                    </nav>

                    {/* Título + botão Adicionar (só Construtor) */}
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="page-title pl-2">Materiais</h3>
                        {!isProprietario && (
                            <Link to={`/materiais/${id}/adicionar`}>
                                <button className="text-md px-4 h-10 rounded-sm border-2 font-semibold border-(--cor-azul) text-(--cor-azul) hover:bg-(--cor-azul) hover:text-white transition-all">
                                    Adicionar material
                                </button>
                            </Link>
                        )}
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
                                            ? 'bg-(--laranja-principal) border-(--laranja-principal) text-white'
                                            : 'border-gray-300 text-gray-600 hover:border-gray-400'
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
                                <col style={{ width: '32%' }} />
                                <col style={{ width: '18%' }} />
                                <col style={{ width: '28%' }} />
                                <col style={{ width: '22%' }} />
                            </colgroup>
                            <thead>
                                <tr className="cabecalho bg-(--laranja-principal) text-white text-sm text-left font-semibold">
                                    <th className="py-4 px-6">MATERIAL</th>
                                    <th className="py-4 px-6">ÁREA</th>
                                    <th className="py-4 px-6">CÔMODOS</th>
                                    <th className="py-4 px-6">ÚLTIMA ATUALIZAÇÃO</th>
                                </tr>
                            </thead>
                            <tbody>
                                {renderCorpo()}
                            </tbody>
                        </table>
                    </div>

                </main>
            </div>
        </div>
    );
}

export default MateriaisDetalhes;