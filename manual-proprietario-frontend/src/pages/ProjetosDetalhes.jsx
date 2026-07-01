import { useParams, useNavigate } from "react-router-dom";
import { FaBuilding, FaSitemap, FaWater, FaBolt } from "react-icons/fa";
import BarraLateral from "../components/BarraLateral";
import MenuInicial from "../components/MenuInicial";
import { useEffect, useState } from "react";
import api from "../services/api";
import { BiEdit } from "react-icons/bi";
import { IoEyeOutline } from "react-icons/io5";

const iconesProjeto = {
  "Projeto Extensão / Elétrico": FaBolt,
  "Projeto Elétrico": FaBolt,
  "Projeto Estrutural": FaSitemap,
  "Projeto Hidrossanitário": FaWater,
  "Projeto Arquitetônico": FaBuilding,
};

const TIPOS_PADRAO_DOCUMENTOS = [
  "Projeto Elétrico",
  "Projeto Estrutural",
  "Projeto Arquitetônico",
  "Projeto Hidrossanitário"
];

function ProjetoDetalhe({ onLogout }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [projeto, setProjeto] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [enviandoDoc, setEnviandoDoc] = useState(false); 
  const [modalAberto, setModalAberto] = useState(false);
  const [novoComodo, setNovoComodo] = useState({ nome: "", andar: "Térreo" });
  const [docSelecionado, setDocSelecionado] = useState(null);
  const [loadingComodos, setLoadingComodos] = useState(true);
  const [comodos, setComodos] = useState([]);

  // CORREÇÃO DEFINITIVA: Aponta cirurgicamente para a rota estática raiz do Express (Porta 3000)
  const obterUrlAbsoluta = (path) => {
    if (!path) return "";
    if (path.startsWith("http://") || path.startsWith("https://")) return path;
    
    // Extrai apenas o nome puro do arquivo enviado pelo banco
    const nomeArquivo = decodeURIComponent(path.split(/[/\\]/).pop());

    let urlBase = api.defaults.baseURL || "";
    if (urlBase.startsWith("http")) {
      // Remove sub-rotas como '/api' ou '/projects' para isolar o domínio principal do servidor
      const origemBackend = urlBase.replace(/\/api\/?$/, "").replace(/\/projects\/?$/, "").replace(/\/$/, "");
      return `${origemBackend}/uploads/${nomeArquivo}`;
    }

    // Fallback padrão seguro para a porta nativa do servidor local
    return `http://localhost:3000/uploads/${nomeArquivo}`;
  };

  const carregarDadosDoProjeto = async (mostrarSpinner = true) => {
    try {
      if (mostrarSpinner) setCarregando(true);
      const res = await api.get(`/projects/${id}`);
      const payload = res.data;

      if (!payload || payload.status !== "success" || !payload.data) {
        setProjeto(null);
        return;
      }

      const apiData = payload.data;

      // Endereço concatenado
      const enderecoObj = apiData.endereco || {};
      const enderecoParts = [];
      if (enderecoObj.rua) enderecoParts.push(enderecoObj.rua);
      if (enderecoObj.numero) enderecoParts.push(String(enderecoObj.numero));
      if (enderecoObj.bairro) enderecoParts.push(enderecoObj.bairro);
      let endereco = enderecoParts.join(", ");
      if (enderecoObj.complemento) endereco = endereco ? `${endereco} - ${enderecoObj.complemento}` : enderecoObj.complemento;

      // Consolidação dos 4 slots padrão buscando os arquivos reais existentes no banco
      const documentosConsolidados = TIPOS_PADRAO_DOCUMENTOS.map((tipoAlvo) => {
        const plantasDoMesmoTipo = (apiData.plantas || []).filter((p) => {
          const t = p.tipo || "";
          return t.toLowerCase().trim() === tipoAlvo.toLowerCase().trim();
        });

        const plantasComArquivo = plantasDoMesmoTipo.filter(
          (p) => p.arquivo
        );
        
        const plantaEscolhida = plantasComArquivo.length > 0 
          ? plantasComArquivo[plantasComArquivo.length - 1] 
          : (plantasDoMesmoTipo[plantasDoMesmoTipo.length - 1] || { id: `temp-${tipoAlvo}`, tipoPlanta: tipoAlvo });

        let pathBruto = plantaEscolhida.arquivo || "";

        const dataBruta = plantaEscolhida.dataCriacao || plantaEscolhida.createdAt;

        return {
          id: plantaEscolhida.idPlanta || plantaEscolhida.id,
          tipo: tipoAlvo,
          url: pathBruto ? obterUrlAbsoluta(pathBruto) : "",
          dataCriacao: dataBruta ? new Date(dataBruta).toLocaleDateString("pt-BR", { timeZone: "UTC" }) : "",
        };
      });

      const dataInicioRaw = apiData.datas?.dataInicio ?? apiData.datas?.inicio ?? apiData.dataInicio;
      const dataConclusaoRaw = apiData.datas?.dataConclusao ?? apiData.datas?.conclusao ?? apiData.dataEntrega ?? apiData.dataConclusao;

      const formatarDataSegura = (dataRaw) => {
        if (!dataRaw) return "";
        const d = new Date(dataRaw);
        return isNaN(d.getTime()) ? "" : d.toLocaleDateString("pt-BR", { timeZone: "UTC" });
      };

      setProjeto({
        titulo: apiData.nomeProjeto || apiData.titulo || "",
        descricao: apiData.descricao || "",
        endereco,
        dataInicio: formatarDataSegura(dataInicioRaw),
        dataConclusao: formatarDataSegura(dataConclusaoRaw),
        documentos: documentosConsolidados,
        comodos: (apiData.andares || []).flatMap((andar) => {
          const nomeAndar = andar.nome || andar.nomeAndar || "";
          return (andar.comodos || []).map((c) => ({
            id: c.id,
            idComodo: c.id,
            idAndar: andar.id,
            nome: c.nome || c.nomeComodo || "",
            andar: nomeAndar,
            ultimaAlteracao: c.ultimaAlteracao ? new Date(c.ultimaAlteracao).toLocaleDateString("pt-BR", { timeZone: "UTC" }) : (c.updatedAt ? new Date(c.updatedAt).toLocaleDateString("pt-BR", { timeZone: "UTC" }) : ""),
          }));
        }),
      });
    } catch (error) {
      console.error("Erro ao carregar projeto:", error);
      setProjeto(null);
    } finally {
      if (mostrarSpinner) setCarregando(false);
    }
  };

  useEffect(() => {
    carregarDadosDoProjeto(true);
  }, [id]);

  const handleCriarComodo = async () => {
    if (!novoComodo.nome.trim()) return;

    try {
      await api.post(`/projects/${id}/rooms`, {
        nomeAndar: novoComodo.andar,
        nomeComodo: novoComodo.nome.trim(),
      });

      setNovoComodo({ nome: "", andar: "Térreo" });
      setModalAberto(false);
      buscaComodos();
      carregarDadosDoProjeto(false);
    } catch (error) {
      console.error("Erro ao criar cômodo:", error);
      alert("Erro ao criar cômodo. Tente novamente.");
    }
  };

  const buscaComodos = async () => {
    try {
      setLoadingComodos(true);
      const response = await api.get(`/projects/${id}/rooms`);
      const andares = response.data.data;
      const todosComodos = andares.flatMap((andar) =>
        andar.comodos.map((comodo) => ({
          id: `${andar.id}-${comodo.id}`,
          idComodo: comodo.id,
          idAndar: andar.id,
          nome: comodo.nome,
          andar: andar.nome,
        }))
      );
      setComodos(todosComodos);
    } catch (error) {
      console.log("Erro ao buscar cômodos: ", error);
    } finally {
      setLoadingComodos(false);
    }
  };

  useEffect(() => {
    buscaComodos();
  }, [id]);
  const lidarBotaoAlterarClick = (planta) => {
    setDocSelecionado(planta);
    document.getElementById("helper-upload-documento").click();
  };

  const handleFileUpload = async (e) => {
    const arquivo = e.target.files[0];
    if (!arquivo || !docSelecionado) return;

    const formDataUpload = new FormData();
    formDataUpload.append("file", arquivo);
    formDataUpload.append("tipoPlanta", docSelecionado.tipo);

    try {
      setEnviandoDoc(true);
      await api.post(`/projects/${id}/documents`, formDataUpload, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Documento atualizado com sucesso!");
      await carregarDadosDoProjeto(false);
    } catch (error) {
      console.error("Erro ao enviar documento:", error);
      const mensagemApi = error.response?.data?.message || "Erro ao fazer upload do arquivo.";
      alert(`Falha ao atualizar o documento.\n\nDetalhe: ${mensagemApi}`);
    } finally {
      e.target.value = ""; 
      setDocSelecionado(null);
      setEnviandoDoc(false);
    }
  };

  if (carregando) {
    return (
      <div className="h-svh flex flex-col overflow-hidden">
        <MenuInicial />
        <div className="flex flex-1 overflow-hidden">
          <BarraLateral onLogout={onLogout} />
          <main className="w-full overflow-y-auto px-10 py-8 bg-gray-100 flex items-center justify-center">
            <div className="text-gray-600 font-semibold">Carregando dados da obra...</div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="h-svh flex flex-col overflow-hidden">
      <MenuInicial />
      <div className="flex flex-1 overflow-hidden">
        <BarraLateral onLogout={onLogout} />
        <main className="w-full overflow-y-auto px-10 py-8">
          <input
            type="file"
            id="helper-upload-documento"
            className="hidden"
            accept="application/pdf,image/*"
            onChange={handleFileUpload}
          />

          {enviandoDoc && (
            <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded mb-6 text-center font-semibold animate-pulse">
              Enviando arquivo para o servidor... Por favor, aguarde.
            </div>
          )}

          {!projeto ? (
            <div className="w-full py-20 text-center text-red-500 font-semibold">Projeto não encontrado.</div>
          ) : (
            <>
              <div className="mb-8">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-semibold text-(--laranja-principal)">Projeto</p>
                    <h3 className="text-(--cor-azul) text-4xl font-semibold mt-2 pl-2">{projeto.titulo}</h3>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => navigate(`/projetos/${id}/alteracoes`, { state: { projeto } })}
                      className="text-sm border border-[#c0392b] text-[#c0392b] rounded px-4 py-2 hover:bg-[#c0392b] hover:text-white transition-colors"
                    >
                      Editar Informações
                    </button>
                    <button className="text-sm border border-[#c0392b] text-[#c0392b] rounded px-4 py-2 hover:bg-[#c0392b] hover:text-white transition-colors">Entregar Manual</button>
                  </div>
                </div>
                <div className="mt-8 mb-8 ml-6 text-[#455861]">
                  <p className="font-semibold">
                    <span className="text-(--cor-azul) font-bold">Descrição: </span>
                    {projeto.descricao}
                  </p>
                  <p className="font-semibold">
                    <span className="text-(--cor-azul) font-bold">Endereço: </span>
                    {projeto.endereco}
                  </p>
                </div>
                <div className="text-base text-[#455861] font-medium">
                  <p>Data de início da obra: {projeto.dataInicio}</p>
                  <p>Data estimada de conclusão: {projeto.dataConclusao}</p>
                </div>
              </div>

              <h3 className="page-title ">Documentos da Obra</h3>
              <div className="grid grid-cols-4 gap-4 mb-10">
                {projeto.documentos.map((planta) => {
                  const Icone = iconesProjeto[planta.tipo] ?? FaBuilding;
                  const formatoPdf = planta.url?.toLowerCase().endsWith(".pdf") || planta.url?.includes(".pdf");

                  return (
                    <div
                      key={planta.id}
                      className="border border-gray-200 rounded-lg p-4 flex flex-col items-center gap-3 bg-white shadow-sm h-[290px] justify-between"
                    >
                      <p className="text-sm font-semibold text-[#c0392b] text-center line-clamp-1">
                        {planta.tipo}
                      </p>
                      
                      <div className="w-full h-32 rounded bg-gray-50 flex items-center justify-center overflow-hidden border border-gray-100 relative">
                        {planta.url ? (
                          formatoPdf ? (
                            <iframe
                              src={`${planta.url}#toolbar=0&navpanes=0&scrollbar=0`}
                              className="w-full h-full pointer-events-none scale-105 border-0"
                              title={planta.tipo}
                            />
                          ) : (
                            <img 
                              src={planta.url} 
                              alt={planta.tipo} 
                              className="w-full h-full object-cover"
                            />
                          )
                        ) : (
                          <Icone size={44} className="text-gray-300" />
                        )}
                      </div>

                      <p className="text-xs text-gray-400 text-center">
                        {planta.url ? `Atualizado: ${planta.dataCriacao}` : "Nenhum arquivo enviado"}
                      </p>
                      
                      <div className="flex gap-2 w-full justify-center">
                        <button 
                          onClick={() => planta.url ? window.open(planta.url, "_blank") : alert("Nenhum arquivo disponível.")}
                          className={`text-sm border rounded px-3 py-1 transition-colors ${
                            planta.url 
                              ? "border-[#c0392b] text-[#c0392b] hover:bg-[#c0392b] hover:text-white" 
                              : "border-gray-200 text-gray-300 cursor-not-allowed"
                          }`}
                          disabled={!planta.url}
                        >
                          Visualizar
                        </button>
                        <button 
                          onClick={() => lidarBotaoAlterarClick(planta)}
                          className="text-sm border border-[#c0392b] text-[#c0392b] rounded px-3 py-1 hover:bg-[#c0392b] hover:text-white transition-colors"
                        >
                          Alterar
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Seção de Cômodos */}
              <div className="w-full overflow-x-auto overflow-y-visible py-6 px-8 bg-white rounded-lg shadow-sm">
                <div className="flex items-center justify-between">
                  <h2 className="text-3xl font-semibold text-(--cor-azul) mb-4">Cômodos</h2>
                  {!modalAberto ? (
                    <button
                      onClick={() => setModalAberto(true)}
                      className="text-sm border border-[#c0392b] text-[#c0392b] rounded px-4 py-1.5 hover:bg-[#c0392b] hover:text-white transition-colors"
                    >
                      Novo Cômodo
                    </button>
                  ) : (
                    <button
                      onClick={() => { setModalAberto(false); setNovoComodo({ nome: "", andar: "Térreo" }); }}
                      className="text-sm border border-[#c0392b] text-[#c0392b] rounded px-4 py-1.5 hover:bg-[#c0392b] hover:text-white transition-colors"
                    >
                      Cancelar
                    </button>
                  )}
                </div>
                {modalAberto && (
                  <div className="w-full px-2 py-3 mb-4">
                    <div className="flex items-end gap-4">
                      <div className="flex flex-col gap-1">
                        <label className="text-sm font-semibold text-[#c0392b]">Andar</label>
                        <select
                          value={novoComodo.andar}
                          onChange={(e) => setNovoComodo({ ...novoComodo, andar: e.target.value })}
                          className="border border-gray-300 rounded px-3 py-2 text-sm text-gray-600 w-36"
                        >
                          <option>Térreo</option>
                          <option>Primeiro Andar</option>
                          <option>Segundo Andar</option>
                          <option>Terceiro Andar</option>
                        </select>
                      </div>

                      <div className="flex flex-col gap-1 flex-1">
                        <label className="text-sm font-semibold text-[#c0392b]">Nome do Cômodo</label>
                        <input
                          type="text"
                          placeholder="Nome do Cômodo"
                          value={novoComodo.nome}
                          onChange={(e) => setNovoComodo({ ...novoComodo, nome: e.target.value })}
                          className="border border-gray-300 rounded px-3 py-2 text-sm text-gray-600"
                        />
                      </div>

                      <button
                        onClick={handleCriarComodo}
                        className="text-sm border border-[#c0392b] text-[#c0392b] rounded px-5 py-2 hover:bg-[#c0392b] hover:text-white transition-colors whitespace-nowrap"
                      >
                        Criar Cômodo
                      </button>
                    </div>
                  </div>
                )}
                <div className="flex flex-col ">
                  {projeto.comodos.map((comodo) => (
                    <div
                      key={comodo.id}
                      className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0"
                    >
                      <span className="font-semibold text-sm text-gray-800 w-36">
                        {comodo.nome}
                      </span>
                      <span className="text-sm text-gray-500 flex-1 px-4">
                        {comodo.andar}
                      </span>
                      {/* <span className="text-sm text-gray-400 mr-6">
                        Última alteração: {comodo.ultimaAlteracao}
                      </span> */}
                      <button
                        onClick={() => navigate(`/manuais/:id/comodo/:idComodo/visualizaralteracoescomodo`, { state: { projeto, comodo } })}
                        className=" text-white text-xl rounded px-4 py-1.5 cursor-pointer transition-colors whitespace-nowrap"
                      >
                        <IoEyeOutline color="#c0392b"/>
                      </button>
                      <button
                        onClick={() => navigate(`/projetos/${id}/comodo/${comodo.idComodo}/alteracoes`, { state: { projeto, comodo } })}
                        className=" text-white text-xl rounded px-4 py-1.5 cursor-pointer transition-colors whitespace-nowrap"
                      >
                        <BiEdit color="#c0392b"/>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default ProjetoDetalhe;