import { useState } from 'react';
import BarraLateral from "../components/BarraLateral"
import MenuInicial from "../components/MenuInicial"
import { LuTrash2 } from "react-icons/lu";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { projetosDetalhesMock } from "../mocks/projetosDetalhes";

const TIPOS_CONSTRUCAO = [
  { value: "Apartamento", label: "Apartamento" },
  { value: "Casa", label: "Casa" },
  { value: "Comercial", label: "Comercial" },
  { value: "Outro", label: "Outro" }
];

const CARGOS = [
  { value: "Mestre de Obra", label: "Mestre de Obra" },
  { value: "Engenheiro", label: "Engenheiro" },
  { value: "Servente", label: "Servente" },
  { value: "Outro", label: "Outro" }
];

export default function AlteracoesProjeto({ onLogout }) {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const projetoData = location.state?.projeto ?? projetosDetalhesMock[id];

  const defaultFormData = {
    nomeProjeto: "",
    descricao: "",
    rua: "",
    bairro: "",
    numero: "",
    complemento: "",
    tipoConstrucao: "Apartamento",
    dataInicio: "",
    dataConclussaoEstimada: "",
    numeroART: ""
  };

  const formatarDataParaInput = (data) => {
    if (!data) return "";
    if (data.includes("-")) return data;

    const partes = data.split("/");
    if (partes.length !== 3) return "";

    const [dia, mes, ano] = partes;
    return `${ano}-${mes.padStart(2, "0")}-${dia.padStart(2, "0")}`;
  };

  const inferirTipoConstrucao = (titulo = "") => {
    const texto = titulo.toLowerCase();

    if (texto.includes("apartamento") || texto.includes("apto")) {
      return "Apartamento";
    }

    if (texto.includes("casa") || texto.includes("sobrado")) {
      return "Casa";
    }

    if (texto.includes("comercial")) {
      return "Comercial";
    }

    return "Outro";
  };

  const extrairEndereco = (endereco = "") => {
    const [logradouroParte, bairroParte] = endereco.split(" - ");
    const segmentos = (logradouroParte ?? "").split(",").map((item) => item.trim()).filter(Boolean);

    return {
      rua: segmentos[0] ?? "",
      numero: segmentos[1] ?? "",
      complemento: segmentos[2] ?? "",
      bairro: bairroParte?.trim() ?? ""
    };
  };

  const montarFormDataDoProjeto = (projeto) => {
    const endereco = extrairEndereco(projeto?.endereco);

    return {
      ...defaultFormData,
      nomeProjeto: projeto?.titulo ?? "",
      descricao: projeto?.descricao ?? "",
      rua: endereco.rua,
      bairro: endereco.bairro,
      numero: endereco.numero,
      complemento: endereco.complemento,
      tipoConstrucao: inferirTipoConstrucao(projeto?.titulo),
      dataInicio: formatarDataParaInput(projeto?.dataInicio),
      dataConclussaoEstimada: formatarDataParaInput(projeto?.dataConclusao),
      numeroART: projeto?.numeroART ?? ""
    };
  };

  const initialFormData = projetoData ? montarFormDataDoProjeto(projetoData) : defaultFormData;

  const [formData, setFormData] = useState(initialFormData);

  const [funcionarios, setFuncionarios] = useState([
    { id: 1, nome: "", cargo: "Mestre de Obra" }
  ]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFuncionarioChange = (id, field, value) => {
    setFuncionarios(prev =>
      prev.map(func =>
        func.id === id ? { ...func, [field]: value } : func
      )
    );
  };

  const handleAdicionarFuncionario = (e) => {
    e.preventDefault();
    const novoId = Math.max(...funcionarios.map(f => f.id), 0) + 1;
    setFuncionarios([...funcionarios, { id: novoId, nome: "", cargo: "Mestre de Obra" }]);
  };

  const handleRemoverFuncionario = (id, e) => {
    e.preventDefault();
    if (funcionarios.length > 1) {
      setFuncionarios(funcionarios.filter(func => func.id !== id));
    }
  };

  const handleSalvar = (e) => {
    e.preventDefault();
    console.log("Salvando alterações do projeto:", formData, funcionarios);
    alert("Informações do projeto salvas com sucesso!");
    navigate(`/projetos/${id}`);
  };

  const handleCancelar = (e) => {
    e.preventDefault();
    setFormData(initialFormData);
    setFuncionarios([{ id: 1, nome: "", cargo: "Mestre de Obra" }]);
  };

  return (
    <div className="h-svh flex flex-col overflow-hidden">
      <MenuInicial />
      <div className="flex flex-1 overflow-hidden">
        <BarraLateral onLogout={onLogout} />
        <main className="w-full overflow-y-auto px-8 py-6 bg-gray-100">
          

          <form onSubmit={handleSalvar} className="space-y-8">
            

            {/* Informações do Projeto */}
            <section className="bg-white p-6 rounded-lg shadow-sm space-y-4">
              {/* Nome do Projeto */}
              <div>
                {/* Título */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-blue-900">
                Alterar Informações do Projeto
              </h1>
            </div>
                <label className="block text-sm font-semibold text-red-600 mb-2">
                  Nome do Projeto*
                </label>
                <input
                  type="text"
                  name="nomeProjeto"
                  value={formData.nomeProjeto}
                  onChange={handleInputChange}
                  placeholder="Apartamento do Gabriel"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Descrição */}
              <div>
                <label className="block text-sm font-semibold text-red-600 mb-2">
                  Descrição
                </label>
                <textarea
                  name="descricao"
                  value={formData.descricao}
                  onChange={handleInputChange}
                  placeholder="Apartamento aconchegante e futurista com instalações da natureza. A estética e design evoca a câmara do campo afastada de forma aglomerada à agitação advinda dos populosos centros urbanos."
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Rua e Bairro */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-red-600 mb-2">
                    Rua*
                  </label>
                  <input
                    type="text"
                    name="rua"
                    value={formData.rua}
                    onChange={handleInputChange}
                    placeholder="Rua Edmundo Ferreira Cosme"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-red-600 mb-2">
                    Bairro*
                  </label>
                  <input
                    type="text"
                    name="bairro"
                    value={formData.bairro}
                    onChange={handleInputChange}
                    placeholder="Padre Aísio Menezes"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Número, Complemento e Tipo de Construção */}
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-red-600 mb-2">
                    Número*
                  </label>
                  <input
                    type="text"
                    name="numero"
                    value={formData.numero}
                    onChange={handleInputChange}
                    placeholder="270"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-red-600 mb-2">
                    Complemento
                  </label>
                  <input
                    type="text"
                    name="complemento"
                    value={formData.complemento}
                    onChange={handleInputChange}
                    placeholder="Apto 102"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-red-600 mb-2">
                    Tipo de Construção*
                  </label>
                  <select
                    name="tipoConstrucao"
                    value={formData.tipoConstrucao}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 bg-white"
                  >
                    {TIPOS_CONSTRUCAO.map(tipo => (
                      <option key={tipo.value} value={tipo.value}>
                        {tipo.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Data de Início, Data de Conclusão e Número do ART */}
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-red-600 mb-2">
                    Data de início*
                  </label>
                  <input
                    type="date"
                    name="dataInicio"
                    value={formData.dataInicio}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-red-600 mb-2">
                    Data de conclusão estimada
                  </label>
                  <input
                    type="date"
                    name="dataConclussaoEstimada"
                    value={formData.dataConclussaoEstimada}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-red-600 mb-2">
                    Número do ART
                  </label>
                  <input
                    type="text"
                    name="numeroART"
                    value={formData.numeroART}
                    onChange={handleInputChange}
                    placeholder="06 2028 1234567"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </section>

            {/* Funcionários da Obra */}
            <section className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-lg font-bold text-blue-900 mb-6">
                Funcionários da Obra
              </h2>

              <div className="space-y-4 mb-4">
                {funcionarios.map((funcionario) => (
                  <div key={funcionario.id} className="flex gap-6 items-end">
                    <div className="flex-1">
                      <label className="block text-sm font-semibold text-red-600 mb-2">
                        Nome do Funcionário*
                      </label>
                      <input
                        type="text"
                        value={funcionario.nome}
                        onChange={(e) => handleFuncionarioChange(funcionario.id, 'nome', e.target.value)}
                        placeholder="Samuel Sobrenome Oliveira"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-semibold text-red-600 mb-2">
                        Cargo*
                      </label>
                      <select
                        value={funcionario.cargo}
                        onChange={(e) => handleFuncionarioChange(funcionario.id, 'cargo', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 bg-white"
                      >
                        {CARGOS.map(cargo => (
                          <option key={cargo.value} value={cargo.value}>
                            {cargo.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex-none">
                      <button
                        type="button"
                        onClick={(e) => handleRemoverFuncionario(funcionario.id, e)}
                        className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                        disabled={funcionarios.length === 1}
                      >
                        <LuTrash2 size={20} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Botão para adicionar funcionário */}
              <div className="flex justify-center mt-6">
                <button
                  type="button"
                  onClick={handleAdicionarFuncionario}
                  className="w-10 h-10 flex items-center justify-center border-2 rounded"
                  style={{ borderColor: '#C15A3E', color: '#C15A3E' }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#f5ede8'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                  +
                </button>
              </div>
            </section>

            {/* Botões de Ação */}
            <section className="flex justify-center gap-4 py-6">
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