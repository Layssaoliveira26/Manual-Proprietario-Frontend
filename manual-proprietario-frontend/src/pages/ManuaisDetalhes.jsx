import { useParams, useNavigate } from "react-router-dom";
import { FaBuilding, FaSitemap, FaWater, FaBolt } from "react-icons/fa";
import BarraLateral from "../components/BarraLateral";
import MenuInicial from "../components/MenuInicial";
import { useEffect, useState } from "react";
import api from "../services/api";

const iconesProjeto = {
  "Projeto Extensão / Elétrico": FaBolt,
  "Projeto Elétrico": FaBolt,
  "Projeto Estrutural": FaSitemap,
  "Projeto Hidrossanitário": FaWater,
  "Projeto Arquitetônico": FaBuilding,
};

// Lista mestre com os 4 tipos estáveis exigidos pelo design do sistema
const TIPOS_PADRAO_DOCUMENTOS = [
  "Projeto Elétrico",
  "Projeto Estrutural",
  "Projeto Arquitetônico",
  "Projeto Hidrossanitário"
];

function ManualDetalhe({ onLogout }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [projeto, setProjeto] = useState(null);
  const [carregando, setCarregando] = useState(true);

  // Aponta cirurgicamente para a rota estática raiz do Express (Porta 3000)
  const obterUrlAbsoluta = (path) => {
    if (!path) return "";
    if (path.startsWith("http://") || path.startsWith("https://")) return path;
    
    const nomeArquivo = path.split(/[/\\]/).pop();
    let urlBase = api.defaults.baseURL || "";
    
    if (urlBase.startsWith("http")) {
      const origemBackend = urlBase.replace(/\/api\/?$/, "").replace(/\/projects\/?$/, "").replace(/\/$/, "");
      return `${origemBackend}/uploads/${nomeArquivo}`;
    }
    return `http://localhost:3000/uploads/${nomeArquivo}`;
  };

  useEffect(() => {
    let ativo = true;

    const carregarManual = async () => {
      try {
        setCarregando(true);
        const res = await api.get(`/projects/${id}`);
        const payload = res.data;

        if (!ativo) return;

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

        // CORREÇÃO: Consolidação com varredura profunda idêntica à tela anterior
        const documentosConsolidados = TIPOS_PADRAO_DOCUMENTOS.map((tipoAlvo) => {
          const plantasDoMesmoTipo = (apiData.plantas || []).filter((p) => {
            const t = p.tipoPlanta || p.nomePlanta || p.tipo || "";
            return t.toLowerCase().trim() === tipoAlvo.toLowerCase().trim();
          });

          const plantasComArquivo = plantasDoMesmoTipo.filter(
            (p) => p.arquivoPlanta || p.url || p.path || p.caminho || p.arquivo
          );
          
          const plantaEscolhida = plantasComArquivo.length > 0 
            ? plantasComArquivo[plantasComArquivo.length - 1] 
            : (plantasDoMesmoTipo[plantasDoMesmoTipo.length - 1] || { id: `temp-${tipoAlvo}`, tipoPlanta: tipoAlvo });

          let pathBruto = plantaEscolhida.arquivoPlanta || plantaEscolhida.url || plantaEscolhida.path || plantaEscolhida.caminho || plantaEscolhida.arquivo || "";
          
          if (!pathBruto && typeof plantaEscolhida === "object") {
            for (const key in plantaEscolhida) {
              if (typeof plantaEscolhida[key] === "string" && 
                  (plantaEscolhida[key].endsWith(".pdf") || plantaEscolhida[key].includes("uploads") || plantaEscolhida[key].includes("/"))) {
                pathBruto = plantaEscolhida[key];
                break;
              }
            }
          }

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
              nome: c.nome || c.nomeComodo || "",
              andar: nomeAndar,
              ultimaAlteracao: c.ultimaAlteracao ? new Date(c.ultimaAlteracao).toLocaleDateString("pt-BR", { timeZone: "UTC" }) : (c.updatedAt ? new Date(c.updatedAt).toLocaleDateString("pt-BR", { timeZone: "UTC" }) : ""),
            }));
          }),
        });
      } catch (error) {
        console.error("Erro ao carregar projeto para o manual:", error);
        setProjeto(null);
      } finally {
        if (ativo) setCarregando(false);
      }
    };

    carregarManual();
    return () => { ativo = false; };
  }, [id]);

  if (carregando) {
    return (
      <div className="h-svh flex flex-col overflow-hidden">
        <MenuInicial />
        <div className="flex flex-1 overflow-hidden">
          <BarraLateral onLogout={onLogout} />
          <main className="w-full overflow-y-auto px-10 py-8 bg-gray-100 flex items-center justify-center">
            <div className="text-gray-600 font-semibold">Carregando dados do manual...</div>
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
          
          {!projeto ? (
            <div className="w-full py-20 text-center text-red-500 font-semibold">Manual não encontrado.</div>
          ) : (
            <>
              <div className="mb-8">
                <p className="text-lg font-semibold text-[var(--laranja-principal)]">Manual</p>
                <h3 className="text-[var(--cor-azul)] text-4xl font-semibold mt-2 pl-2">{projeto.titulo}</h3>
                
                <div className="mt-8 mb-8 ml-6 text-[#455861]">
                  <p className="font-semibold ">
                    <span className="text-[var(--cor-azul)] font-bold">Descrição: </span>
                    {projeto.descricao}
                  </p>

                  <p className="font-semibold mt-1">
                    <span className="text-[var(--cor-azul)] font-bold">Endereço: </span>
                    {projeto.endereco}
                  </p>
                </div>

                <div className="text-base text-[#455861] font-medium ml-6">
                  <p className="">Data de início da obra: {projeto.dataInicio}</p>
                  <p className="">Data estimada de conclusão: {projeto.dataConclusao}</p>
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
                      
                      {/* CORREÇÃO VISUAL: Miniatura dinâmica por iframe/img reativada */}
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
                          className={`text-sm border rounded px-6 py-1 transition-colors font-medium ${
                            planta.url 
                              ? "border-[#c0392b] text-[#c0392b] hover:bg-[#c0392b] hover:text-white" 
                              : "border-gray-200 text-gray-300 cursor-not-allowed"
                          }`}
                          disabled={!planta.url}
                        >
                          Visualizar
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Seção de Cômodos */}
              <div className="w-full overflow-x-auto overflow-y-visible py-6 px-8 bg-white rounded-lg shadow-sm border border-gray-100">
                <h2 className="text-3xl font-semibold text-[var(--cor-azul)] mb-4">Cômodos</h2>
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
                      <span className="text-sm text-gray-400 mr-6">
                        Última alteração: {comodo.ultimaAlteracao}
                      </span>
                      <button
                        onClick={() => navigate(`/manuais/${id}/comodo/${comodo.id}`)}
                        className="bg-[#c0392b] text-white text-sm rounded px-4 py-1.5 hover:bg-[#a93226] transition-colors whitespace-nowrap font-medium"
                      >
                        Ver Alterações
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

export default ManualDetalhe;