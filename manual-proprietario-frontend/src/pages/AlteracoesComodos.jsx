import { useState, useEffect } from 'react'; 
import BarraLateral from "../components/BarraLateral"
import MenuInicial from "../components/MenuInicial"
import { MdOutlineEngineering } from "react-icons/md";
import { LuUpload } from "react-icons/lu";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import { ValidateRequired, ValidatePastOrTodayDate, ValidateAfterProjectStart } from "../utils/validations";

const DISCIPLINAS = [
  { value: "ARQUITETONICA", label: "Arquitetônica" },
  { value: "ESTRUTURAL", label: "Estrutural" },
  { value: "HIDROSSANITARIA", label: "Hidrossanitária" },
  { value: "ELETRICA", label: "Elétrica" }
];

export default function AlteraçõesComodos({ onLogout }) {
  const location = useLocation();
  const { id: projetoId } = useParams();
  const navigate = useNavigate();
  const idProjeto = useParams();
  const comodo = location.state?.comodo ?? null;
  const projeto = location.state?.projeto ?? null;
  const [errors, setErrors] = useState({});

  const funcionariosIniciais = location.state?.funcionarios && Array.isArray(location.state.funcionarios)
    ? location.state.funcionarios.map((func, index) => ({
        id: func.id ?? `funcionario-${index}`,
        nome: func.nome || "Sem nome"
      }))
    : []
  
  const [formData, setFormData] = useState({
    nomeAlteracao: "",
    descricao: "",
    dataAlteracao: "",
    disciplina: "",
    arquivo: null,
    descricaoFoto: "",
    funcionarioResponsavel: ""
  });

  const [funcionarios, setFuncionarios] = useState([]);
  const [loadingFuncionarios, setLoadingFuncionarios] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [registrosFoto, setRegistrosFoto] = useState([]);

  useEffect(() => {
    const buscaFuncionarios = async () => {
      try {
        setLoadingFuncionarios(true);
        const response = await api.get(`/projects/${projetoId}`);
        const apiFuncs = response.data.data?.funcionarios ?? [];
        const flatFuncs = apiFuncs.map(f => {
           const id = f.funcionario?.id || f.idFuncionario || f.id;
           const nome = f.funcionario?.nomeFunc || f.nomeFunc || f.nome || "Sem Nome";
           return { id, nome };
        }).filter(f => f.id);
        setFuncionarios(flatFuncs);
      }
      catch (error){
        console.log("Erro ao buscar funcionários:", error);
      }
      finally {
        setLoadingFuncionarios(false);
      }
    }
    buscaFuncionarios();
  }, [projetoId]);

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
    if (formData.arquivo) {
      setRegistrosFoto(prev => [...prev, {
        id: Date.now(),
        arquivo: formData.arquivo.name,
        descricao: formData.descricaoFoto || "Sem descrição",
        file: formData.arquivo
      }]);
      setFormData(prev => ({
        ...prev,
        arquivo: null,
        descricaoFoto: ""
      }));
      
      const fileInput = document.getElementById('fileInput');
      if (fileInput) fileInput.value = '';
    }
  };

  const handleRemoverFoto = (id) => {
    setRegistrosFoto(prev => prev.filter(foto => foto.id !== id));
  };

  const handleSalvar = async (e) => {
    e.preventDefault();
    const newErrors = {};

    const nomeErro = ValidateRequired(formData.nomeAlteracao, "Nome da Alteração");
    if (nomeErro) newErrors.nomeAlteracao = nomeErro;

    const descErro = ValidateRequired(formData.descricao, "Descrição");
    if (descErro) newErrors.descricao = descErro;

    const dataErro = ValidatePastOrTodayDate(formData.dataAlteracao) 
    || ValidateAfterProjectStart(formData.dataAlteracao, projeto?.dataInicio);
    if (dataErro) newErrors.dataAlteracao = dataErro;
    
    const discErro = ValidateRequired(formData.disciplina, "Disciplina da Alteração");
    if (discErro) newErrors.disciplina = discErro;

    const funcErro = ValidateRequired(formData.funcionarioResponsavel, "Funcionário Responsável");
    if (funcErro) newErrors.funcionarioResponsavel = funcErro;

    const temArquivoPendente = formData.arquivo !== null;

    if (registrosFoto.length === 0 && !temArquivoPendente) {
      newErrors.arquivo = "É obrigatório anexar pelo menos um arquivo.";
    }

    if (Object.keys(newErrors).length > 0 ) {
      setErrors(newErrors);
      return;
    }
    setErrors({});

    try {
      setSalvando(true);
      const todosArquivosParaSalvar = [...registrosFoto];
      if (temArquivoPendente) {
          todosArquivosParaSalvar.push({
              id: Date.now(),
              arquivo: formData.arquivo.name,
              descricao: formData.descricaoFoto || "Sem descrição",
              file: formData.arquivo
          });
      }

      const formPayload = new FormData();
      formPayload.append("areaAlteracao", formData.disciplina);
      formPayload.append("idAndar", String(comodo.idAndar));
      formPayload.append("idComodo", String(comodo.idComodo));
      formPayload.append("nomeAlteracao", formData.nomeAlteracao);
      formPayload.append("descricao", formData.descricao);
      formPayload.append("dataAlteracao", formData.dataAlteracao);
      
      // formData.funcionarioResponsavel agora guarda o ID
      formPayload.append("funcionariosIds", JSON.stringify([formData.funcionarioResponsavel]));

      todosArquivosParaSalvar.forEach((foto) => {
         formPayload.append("fotos", foto.file);
      });

      await api.post(`/projects/${projetoId}/alterations`, formPayload, {
         headers: { "Content-Type": "multipart/form-data" }
      });
      
      navigate(`/projetos/${projetoId}`, { state: { sucessoAlteracao: true } });
    } catch (error) {
      console.error("Erro ao salvar:", error);
    } finally {
      setSalvando(false);
    }
  };

  const handleCancelar = (e) => {
    e.preventDefault();
    setFormData({
      nomeAlteracao: "",
      descricao: "",
      dataAlteracao: "",
      disciplina: "ARQUITETONICA",
      arquivo: null,
      descricaoFoto: "",
      funcionarioResponsavel: ""
    });
    setRegistrosFoto([]);
    
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
                  Alteração no Cômodo - {comodo.nome}
                </h1>
              </div>

              {/* Nome da Alteração */}
              <div>
                <label className="block text-sm font-semibold text-red-600 mb-2">
                  Nome da Alteração*
                </label>
                <input
                  type="text"
                  name="nomeAlteracao"
                  value={formData.nomeAlteracao}
                  onChange={handleInputChange}
                  placeholder="Nome da Alteração"
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500 ${errors.nomeAlteracao ? 'border-red-500' : 'border-gray-300'}`}                />
                {errors.nomeAlteracao && (
                  <span className="text-red-500 text-xs mt-1 block">{errors.nomeAlteracao}</span>
                )}
              </div>

              {/* Descrição e Justificativa */}
              <div>
                <label className="block text-sm font-semibold text-red-600 mb-2">
                  Descrição/Justificativa*
                </label>
                <textarea
                  name="descricao"
                  value={formData.descricao}
                  onChange={handleInputChange}
                  placeholder="Descrição/Justificativa"
                  rows="4"
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500 ${errors.descricao ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.descricao && (
                  <span className="text-red-500 text-xs mt-1 block">{errors.descricao}</span>
                )}
              </div>

              {/* Data e Disciplina */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-red-600 mb-2">
                    Data da Alteração*
                  </label>
                  <input
                    type="date"
                    name="dataAlteracao"
                    value={formData.dataAlteracao}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500 ${errors.dataAlteracao ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.dataAlteracao && (
                    <span className="text-red-500 text-xs mt-1 block">{errors.dataAlteracao}</span>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-red-600 mb-2">
                    Disciplina da Alteração*
                  </label>
                  <select
                    name="disciplina"
                    value={formData.disciplina}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500 bg-white ${errors.disciplina ? 'border-red-500' : 'border-gray-300'}`}
                  >
                    <option value="">Selecione uma disciplina</option>
                    {DISCIPLINAS.map(disc => (
                      <option key={disc.value} value={disc.value}>
                        {disc.label}
                      </option>
                    ))}
                  </select>
                  {errors.disciplina && (
                    <span className="text-red-500 text-xs mt-1 block">{errors.disciplina}</span>
                  )}
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
                    Arquivo*
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      id="fileInput"
                      onChange={handleArquivoChange}
                      accept="image/*,.pdf"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div
                      className={`flex items-center justify-between w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-gray-500 ${errors.arquivo ? 'border-red-500' : 'border-gray-300'}`}
                      style={!errors.arquivo ? { borderColor: '#A0AEC0' } : {}}
                    >
                      {/* Cor dinâmica: Se tem arquivo fica escuro, se não, fica cinza */}
                      <span className={formData.arquivo ? "text-gray-800 font-medium" : "text-gray-400"}>
                        {formData.arquivo ? formData.arquivo.name : "Importar Arquivo"}
                      </span>
                      <LuUpload className="text-gray-400 text-lg" />
                    </div>
                  </div>
                  {errors.arquivo && (
                    <span className="text-red-500 text-xs mt-1 block">{errors.arquivo}</span>
                  )}
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
                Nome do Funcionário*
              </label>
              <select
                name="funcionarioResponsavel"
                value={formData.funcionarioResponsavel}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500 bg-white ${errors.funcionarioResponsavel ? 'border-red-500' : 'border-gray-300'}`}
              >
                <option value="">Selecione um funcionário</option>
                {funcionarios.map(func => (
                  <option key={func.id} value={func.id}>
                    {func.nome}
                  </option>
                ))}
              </select>
              {errors.funcionarioResponsavel && (
                <span className="text-red-500 text-xs mt-1 block">{errors.funcionarioResponsavel}</span>
              )}
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