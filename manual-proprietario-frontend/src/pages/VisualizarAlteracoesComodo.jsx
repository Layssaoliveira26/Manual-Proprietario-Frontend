// src/pages/VisualizarAlteracoesComodo.jsx
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import BarraLateral from '../components/BarraLateral';
import MenuInicial from '../components/MenuInicial';
import { LuEye } from 'react-icons/lu';

const alteracoesMock = [
  {
    id: 1,
    descricao: "Substituição do revestimento do piso por porcelanato 60x60.",
    dataAlteracao: "1999-01-01",
    disciplina: "ARQUITETÔNICA",
    arquivo: "foto_piso.jpg",
    descricaoFoto: "Foto do novo piso instalado",
    funcionarioResponsavel: "Samuel Sobrenome Oliveira"
  },
  {
    id: 2,
    descricao: "Alteração no ponto elétrico da parede sul.",
    dataAlteracao: "2000-03-15",
    disciplina: "ELÉTRICA",
    arquivo: "eletrico.pdf",
    descricaoFoto: "Diagrama do novo ponto elétrico",
    funcionarioResponsavel: "João Silva Santos"
  },
  {
    id: 3,
    descricao: "Reforço estrutural na viga central.",
    dataAlteracao: "2001-07-20",
    disciplina: "ESTRTURAL",
    arquivo: "viga.pdf",
    descricaoFoto: "Foto da viga reforçada",
    funcionarioResponsavel: "Maria Costa Lima"
  },
  {
    id: 4,
    descricao: "Instalação de nova tubulação hidrossanitária.",
    dataAlteracao: "2002-11-05",
    disciplina: "HIDROSSANITÁRIA",
    arquivo: "hidro.jpg",
    descricaoFoto: "Foto da tubulação instalada",
    funcionarioResponsavel: "Carlos Pereira Neto"
  }
];

const DISCIPLINAS_LABEL = {
  "ARQUITETÔNICA": "Arquitetônica",
  "ESTRTURAL": "Estrutural",
  "HIDROSSANITÁRIA": "Hidrossanitária",
  "ELÉTRICA": "Elétrica"
};

export default function VisualizarAlteracoesComodo({ onLogout }) {
  const location = useLocation();
  const comodo = location.state?.comodo ?? null;
  const [indiceAtual, setIndiceAtual] = useState(0);

  const alteracao = alteracoesMock[indiceAtual];
  const total = alteracoesMock.length;

  const handleAnterior = () => {
    if (indiceAtual > 0) setIndiceAtual(prev => prev - 1);
  };

  const handleProximo = () => {
    if (indiceAtual < total - 1) setIndiceAtual(prev => prev + 1);
  };

  const formatarData = (dataISO) => {
    if (!dataISO) return '';
    const [ano, mes, dia] = dataISO.split('-');
    return `${dia}/${mes}/${ano}`;
  };

  return (
    <div className="h-svh flex flex-col overflow-hidden">
      <MenuInicial />
      <div className="flex flex-1 overflow-hidden">
        <BarraLateral onLogout={onLogout} />
        <main className="w-full overflow-y-auto px-8 py-6 bg-gray-100">

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
                value={alteracao.descricao}
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
                  value={formatarData(alteracao.dataAlteracao)}
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
                    value={alteracao.disciplina}
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
                  <span className="text-gray-400 text-sm">
                    {alteracao.arquivo ?? 'Visualizar Arquivo'}
                  </span>
                  <LuEye className="text-red-400 text-lg" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: '#C15A3E' }}>
                  Descrição da Foto
                </label>
                <input
                  type="text"
                  readOnly
                  value={alteracao.descricaoFoto}
                  placeholder="Descrição da Foto"
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
                value={alteracao.funcionarioResponsavel}
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

        </main>
      </div>
    </div>
  );
}