// src/pages/VisualizarAlteracoesComodo.jsx
import { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import BarraLateral from '../components/BarraLateral';
import MenuInicial from '../components/MenuInicial';
import { LuEye } from 'react-icons/lu';

import api from '../services/api';

const DISCIPLINAS_LABEL = {
  "ARQUITETONICA": "Arquitetônica",
  "ESTRUTURAL": "Estrutural",
  "HIDROSSANITARIA": "Hidrossanitária",
  "ELETRICA": "Elétrica"
};

export default function VisualizarAlteracoesComodo({ onLogout }) {
  const location = useLocation();
  const { id: idProjetoParam, idComodo: idComodoParam } = useParams();
  
  const projeto = location.state?.projeto ?? null;
  const comodo = location.state?.comodo ?? null;

  const projetoId = projeto?.id || idProjetoParam;
  const comodoId = comodo?.idComodo || idComodoParam;
  
  const [alteracoes, setAlteracoes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [indiceAtual, setIndiceAtual] = useState(0);

  useEffect(() => {
    if (!projetoId || !comodoId) {
      setErro("Projeto ou Cômodo não identificados.");
      setCarregando(false);
      return;
    }

    const buscarAlteracoes = async () => {
      try {
        setCarregando(true);
        const res = await api.get(`/projects/${projetoId}/alterations?idComodo=${comodoId}`);
        setAlteracoes(res.data.data.alteracoes || []);
        setErro(null);
      } catch (err) {
        console.error("Erro ao buscar alterações:", err);
        setErro("Não foi possível carregar as alterações deste cômodo.");
      } finally {
        setCarregando(false);
      }
    };

    buscarAlteracoes();
  }, [projeto, comodo]);

  const total = alteracoes.length;
  const alteracao = alteracoes[indiceAtual];

  const handleAnterior = () => {
    if (indiceAtual > 0) setIndiceAtual(prev => prev - 1);
  };

  const handleProximo = () => {
    if (indiceAtual < total - 1) setIndiceAtual(prev => prev + 1);
  };

  const formatarData = (dataISO) => {
    if (!dataISO) return '';
    const d = new Date(dataISO);
    return isNaN(d.getTime()) ? dataISO : d.toLocaleDateString('pt-BR', { timeZone: 'UTC' });
  };

  const obterNomeFuncionario = (alt) => {
    if (alt?.funcionarios && alt.funcionarios.length > 0 && alt.funcionarios[0].funcionario) {
      return alt.funcionarios[0].funcionario.nomeFunc;
    }
    return "Não informado";
  };

  const obterFoto = (alt) => {
    if (alt?.fotos && alt.fotos.length > 0) {
      return alt.fotos[0].urlDaFoto;
    }
    return null;
  };

  const obterUrlAbsoluta = (caminho) => {
    if (!caminho) return "";
    if (caminho.startsWith('http')) return caminho;
    
    const normalized = caminho.replace(/\\/g, '/');
    
    const index = normalized.lastIndexOf('uploads/');
    if (index !== -1) {
      return `http://localhost:3000/uploads/${normalized.substring(index + 8)}`;
    }
    
    if (normalized.includes('alteracoes/')) {
       return `http://localhost:3000/uploads/${normalized}`;
    }
    
    const filename = normalized.split('/').pop();
    return `http://localhost:3000/uploads/alteracoes/fotos/${filename}`;
  };

  return (
    <div className="h-svh flex flex-col overflow-hidden">
      <MenuInicial />
      <div className="flex flex-1 overflow-hidden">
        <BarraLateral onLogout={onLogout} />
        <main className="w-full overflow-y-auto px-8 py-6 bg-gray-100">

          {carregando ? (
            <div className="flex justify-center items-center h-full">
              <p className="text-gray-500 font-semibold">Carregando alterações...</p>
            </div>
          ) : erro ? (
            <div className="flex justify-center items-center h-full">
              <p className="text-red-500 font-semibold">{erro}</p>
            </div>
          ) : total === 0 ? (
            <div className="flex justify-center items-center h-full">
              <p className="text-gray-500 font-semibold">Nenhuma alteração registrada para este cômodo.</p>
            </div>
          ) : (
            <>
              {/* Seção Principal */}
              <section className="bg-white p-6 rounded-lg shadow-sm space-y-4 mb-6">
                {/* Contador e Título */}
                <div>
                  <div className="text-sm font-semibold mb-1" style={{ color: '#C15A3E' }}>
                    Alteração {indiceAtual + 1} de {total}
                  </div>
                  <h1 className="text-2xl font-bold text-blue-900">
                    Alteração no Cômodo - {comodo?.nome ?? '[nome do Cômodo]'}
                  </h1>
                </div>

                {/* Descrição/Justificativa */}
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: '#C15A3E' }}>
                    Descrição/Justificativa
                  </label>
                  <textarea
                    readOnly
                    value={alteracao?.descricaoAlteracao || alteracao?.descricao || ""}
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 resize-none focus:outline-none"
                  />
                </div>

                {/* Data e Disciplina */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: '#C15A3E' }}>
                      Data da Alteração
                    </label>
                    <input
                      type="text"
                      readOnly
                      value={formatarData(alteracao?.dataAlteracao)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: '#C15A3E' }}>
                      Disciplina da Alteração
                    </label>
                    <div className="relative">
                      <select
                        disabled
                        value={alteracao?.area || alteracao?.disciplina}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 appearance-none focus:outline-none"
                      >
                        {Object.entries(DISCIPLINAS_LABEL).map(([value, label]) => (
                          <option key={value} value={value}>{label}</option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Registros da Alteração */}
              <section className="bg-white p-6 rounded-lg shadow-sm mb-6">
                <h2 className="text-lg font-bold text-blue-900 mb-4">
                  Registros da Alteração
                </h2>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: '#C15A3E' }}>
                      Arquivos
                    </label>
                    <div className="flex items-center justify-between w-full px-4 py-2 border border-gray-300 rounded-md bg-white">
                      <span className="text-gray-400 text-sm truncate max-w-[80%]">
                        {obterFoto(alteracao) ? obterFoto(alteracao).split('/').pop() : 'Nenhum arquivo enviado'}
                      </span>
                      {obterFoto(alteracao) ? (
                        <a 
                          href={obterUrlAbsoluta(obterFoto(alteracao))} 
                          target="_blank" 
                          rel="noreferrer"
                        >
                          <LuEye className="text-red-400 text-lg cursor-pointer hover:text-red-600" />
                        </a>
                      ) : (
                        <LuEye className="text-gray-300 text-lg" />
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: '#C15A3E' }}>
                      Descrição da Foto
                    </label>
                    <input
                      type="text"
                      readOnly
                      value={alteracao?.nomeAlteracao || alteracao?.descricaoFoto || ""}
                      placeholder="Sem descrição adicional"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none"
                    />
                  </div>
                </div>
              </section>

              {/* Funcionário Responsável */}
              <section className="bg-white p-6 rounded-lg shadow-sm mb-6">
                <h2 className="text-lg font-bold text-blue-900 mb-4">
                  Funcionário Responsável pela Alteração
                </h2>
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: '#C15A3E' }}>
                    Nome do Funcionário
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={obterNomeFuncionario(alteracao)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none"
                  />
                </div>
              </section>

              {/* Botões de Navegação */}
              <section className="flex justify-center gap-4 py-4">
                <button
                  onClick={handleAnterior}
                  disabled={indiceAtual === 0}
                  className="px-8 py-2 border-2 rounded-md font-semibold disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{ borderColor: '#C15A3E', color: '#C15A3E', backgroundColor: 'transparent' }}
                  onMouseEnter={(e) => { if (indiceAtual > 0) e.currentTarget.style.backgroundColor = '#f5ede8' }}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  Anterior
                </button>
                <button
                  onClick={handleProximo}
                  disabled={indiceAtual === total - 1}
                  className="px-8 py-2 text-white rounded-md font-semibold disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{ backgroundColor: '#C15A3E' }}
                  onMouseEnter={(e) => { if (indiceAtual < total - 1) e.currentTarget.style.backgroundColor = '#a84a31' }}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#C15A3E'}
                >
                  Próximo
                </button>
              </section>
            </>
          )}

        </main>
      </div>
    </div>
  );
}