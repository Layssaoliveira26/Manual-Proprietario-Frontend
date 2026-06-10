import { useState } from 'react'; 
import BarraLateral from "../components/BarraLateral"
import MenuInicial from "../components/MenuInicial"
import { MdOutlineEngineering } from "react-icons/md";
import { LuUpload } from "react-icons/lu";
import { Link, useLocation, useParams } from "react-router-dom";
import { projetosDetalhesMock } from "../mocks/projetosDetalhes";

const DISCIPLINAS = [
  { value: "Arquitetônica", label: "Arquitetônica" },
  { value: "Estrutural", label: "Estrutural" },
  { value: "Hidrossanitária", label: "Hidrossanitária" },
  { value: "Elétrica", label: "Elétrica" }
];

// Funcionários mockados para testar o dropdown
const FUNCIONARIOS_POR_PROJETO = {
  "default": [
    { id: 1, nome: "Samuel Sobrenome Oliveira" },
    { id: 2, nome: "João Silva" },
    { id: 3, nome: "Maria Santos" },
    { id: 4, nome: "Pedro Costa" }
  ]
};

export default function AlteraçõesComodos({ onLogout }) {
  const location = useLocation();
  const { id: projetoId, idComodo } = useParams();
  const projeto = location.state?.projeto ?? projetosDetalhesMock[projetoId];
  const comodo = location.state?.comodo ?? projeto?.comodos?.find((item) => `${item.id}` === idComodo) ?? null;
  const tituloComodo = comodo?.nome ?? "[nome do Cômodo]";

  const funcionariosIniciais = location.state?.funcionarios && Array.isArray(location.state.funcionarios)
    ? location.state.funcionarios.map((func, index) => ({
        id: func.id ?? `funcionario-${index}`,
        nome: func.nome || "Sem nome"
      }))
    : FUNCIONARIOS_POR_PROJETO.default;
  
  const [formData, setFormData] = useState({
    nomeAlteracao: "",
    descricao: "",
    dataAlteracao: "",
    disciplina: "Arquitetônica",
    arquivo: null,
    descricaoFoto: "",
    funcionarioResponsavel: ""
  });

  const [funcionarios] = useState(funcionariosIniciais);
  const [registrosFoto, setRegistrosFoto] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleArquivoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        arquivo: file
      }));
    }
  };

  const handleAdicionarFoto = (e) => {
    e.preventDefault();
    if (formData.arquivo && formData.descricaoFoto) {
      setRegistrosFoto(prev => [...prev, {
        id: Date.now(),
        arquivo: formData.arquivo.name,
        descricao: formData.descricaoFoto,
        file: formData.arquivo
      }]);
      setFormData(prev => ({
        ...prev,
        arquivo: null,
        descricaoFoto: ""
      }));
      // Limpar o input file
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = '';
    }
  };

  const handleRemoverFoto = (id) => {
    setRegistrosFoto(prev => prev.filter(foto => foto.id !== id));
  };

  const handleSalvar = (e) => {
    e.preventDefault();
    console.log("Salvando alteração:", formData, registrosFoto);
    alert("Alteração salva com sucesso!");
  };

  const handleCancelar = (e) => {
    e.preventDefault();
    setFormData({
      nomeAlteracao: "",
      descricao: "",
      dataAlteracao: "",
      disciplina: "Arquitetônica",
      arquivo: null,
      descricaoFoto: "",
      funcionarioResponsavel: ""
    });
    setRegistrosFoto([]);
    // Limpar o input file
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) fileInput.value = '';
  };

  return (
    <div className="h-svh flex flex-col overflow-hidden">
      <MenuInicial />
      <div className="flex flex-1 overflow-hidden">
        <BarraLateral onLogout={onLogout} />
        <main className="w-full overflow-y-auto px-8 py-6 bg-gray-100">
         

          <form onSubmit={handleSalvar} className="space-y-8">
            {/* Nome da Alteração, Data e Descrição - Juntos */}
            <section className="bg-white p-6 rounded-lg shadow-sm space-y-4">
              {/* Cabeçalho */}
              <div className="pb-4 border-b border-gray-200">
                <div className="mb-2 font-semibold text-sm" style={{ color: '#C15A3E' }}>As-Built</div>
                <h1 className="text-2xl font-bold text-blue-900">
                  Alteração no Cômodo - {tituloComodo}
                </h1>
                {projeto?.titulo ? (
                  <p className="mt-2 text-sm text-gray-500">Projeto: {projeto.titulo}</p>
                ) : null}
              </div>

              {/* Nome da Alteração */}
              <div>
                <label className="block text-sm font-semibold text-red-600 mb-2">
                  Nome da Alteração
                </label>
                <input
                  type="text"
                  name="nomeAlteracao"
                  value={formData.nomeAlteracao}
                  onChange={handleInputChange}
                  placeholder="Nome da Alteração"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Descrição e Justificativa */}
              <div>
                <label className="block text-sm font-semibold text-red-600 mb-2">
                  Descrição/Justificativa
                </label>
                <textarea
                  name="descricao"
                  value={formData.descricao}
                  onChange={handleInputChange}
                  placeholder="Descrição/Justificativa"
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Data e Disciplina */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-red-600 mb-2">
                    Data da Alteração
                  </label>
                  <input
                    type="date"
                    name="dataAlteracao"
                    value={formData.dataAlteracao}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-red-600 mb-2">
                    Disciplina da Alteração
                  </label>
                  <select
                    name="disciplina"
                    value={formData.disciplina}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 bg-white"
                  >
                    {DISCIPLINAS.map(disc => (
                      <option key={disc.value} value={disc.value}>
                        {disc.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </section>

            {/* Registros da Alteração */}
            <section className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-lg font-bold text-blue-900 mb-4">
                Registros da Alteração
              </h2>
              <div className="grid grid-cols-2 gap-6 mb-4">
                <div>
                  <label className="block text-sm font-semibold text-red-600 mb-2">
                    Arquivo
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      id="fileInput"
                      onChange={handleArquivoChange}
                      accept="image/*,.pdf"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <label
                      htmlFor="fileInput"
                      className="flex items-center justify-between w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-gray-500"
                      style={{ borderColor: '#A0AEC0' }}
                    >
                      <span className="text-gray-400">
                        {formData.arquivo ? formData.arquivo.name : "Importar Arquivo"}
                      </span>
                      <LuUpload className="text-gray-400 text-lg" />
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-red-600 mb-2">
                    Descrição da Foto
                  </label>
                  <input
                    type="text"
                    name="descricaoFoto"
                    value={formData.descricaoFoto}
                    onChange={handleInputChange}
                    placeholder="Descrição da Foto"
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-gray-500"
                  />
                </div>
              </div>
              <div className="flex justify-center mb-4">
                <button
                  type="button"
                  onClick={handleAdicionarFoto}
                  className="w-10 h-10 flex items-center justify-center border-2 rounded"
                  style={{ borderColor: '#C15A3E', color: '#C15A3E' }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#f5ede8'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                  +
                </button>
              </div>

              {/* Lista de fotos */}
              {registrosFoto.length > 0 && (
                <div className="bg-gray-50 p-4 rounded-md">
                  {registrosFoto.map(foto => (
                    <div key={foto.id} className="flex justify-between items-center py-2 border-b last:border-b-0">
                      <div>
                        <div className="font-semibold text-sm">{foto.arquivo}</div>
                        <div className="text-xs text-gray-600">{foto.descricao}</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoverFoto(foto.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Funcionário Responsável */}
            <section className="bg-white p-6 rounded-lg shadow-sm">
              <label className="block text-sm font-semibold text-red-600 mb-2">
                Nome do Funcionário
              </label>
              <select
                name="funcionarioResponsavel"
                value={formData.funcionarioResponsavel}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 bg-white"
              >
                <option value="">Selecione um funcionário</option>
                {funcionarios.map(func => (
                  <option key={func.id} value={func.nome}>
                    {func.nome}
                  </option>
                ))}
              </select>
            </section>

            {/* Botões de Ação */}
            <section className="flex justify-center gap-4 py-6 ">
              <button
                type="button"
                onClick={handleCancelar}
                className="px-8 py-2 border-2 rounded-md font-semibold"
                style={{ borderColor: '#C15A3E', color: '#C15A3E', backgroundColor: 'transparent' }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#f5ede8'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-8 py-2 text-white rounded-md font-semibold"
                style={{ backgroundColor: '#C15A3E' }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#a84a31'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#C15A3E'}
              >
                Salvar
              </button>
            </section>
          </form>
        </main>
      </div>
    </div>
  );
}