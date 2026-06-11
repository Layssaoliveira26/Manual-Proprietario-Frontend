import { useParams, useNavigate } from "react-router-dom";
import { FaBuilding, FaSitemap, FaWater, FaBolt } from "react-icons/fa";
import BarraLateral from "../components/BarraLateral";
import MenuInicial from "../components/MenuInicial";
import { useEffect, useState } from "react";
import api from "../services/api";
import { BiEdit } from "react-icons/bi";

const iconesProjeto = {
  "Projeto Arquitetônico": FaBuilding,
  "Projeto Estrutural": FaSitemap,
  "Projeto Hidrossanitário": FaWater,
  "Projeto Elétrico": FaBolt,
};

function ProjetoDetalhe({ onLogout }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [projeto, setProjeto] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [modalAberto, setModalAberto] = useState(false);
  const [novoComodo, setNovoComodo] = useState({ nome: "", andar: "Térreo" });

  useEffect(() => {
    let ativo = true;

    const fetchProjeto = async () => {
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

        // Documentos (plantas)
        const documentos = (apiData.plantas || []).map((p) => ({
          id: p.id,
          tipo: p.nomePlanta || p.tipo || "Documento",
          dataCriacao: p.dataCriacao ? new Date(p.dataCriacao).toLocaleDateString("pt-BR") : (p.createdAt ? new Date(p.createdAt).toLocaleDateString("pt-BR") : ""),
        }));

        // Cômodos: planificar andares -> comodos
        const comodos = (apiData.andares || []).flatMap((andar) => {
          const nomeAndar = andar.nome || andar.nomeAndar || "";
          return (andar.comodos || []).map((c) => ({
            id: c.id,
            nome: c.nome || c.nomeComodo || "",
            andar: nomeAndar,
            ultimaAlteracao: c.ultimaAlteracao ? new Date(c.ultimaAlteracao).toLocaleDateString("pt-BR") : (c.updatedAt ? new Date(c.updatedAt).toLocaleDateString("pt-BR") : ""),
          }));
        });

        // Mapeamento resiliente de datas baseado nas respostas reais do Back-end
        const dataInicioRaw = apiData.datas?.dataInicio ?? apiData.datas?.inicio ?? apiData.dataInicio;
        const dataConclusaoRaw = apiData.datas?.dataConclusao ?? apiData.datas?.conclusao ?? apiData.dataEntrega ?? apiData.dataConclusao;

        // CORREÇÃO: Forçando o timeZone 'UTC' para evitar que a data volte 1 dia atrás devido ao fuso local
        const formatarDataSegura = (dataRaw) => {
          if (!dataRaw) return "";
          const d = new Date(dataRaw);
          return isNaN(d.getTime()) ? "" : d.toLocaleDateString("pt-BR", { timeZone: "UTC" });
        };

        const mapped = {
          titulo: apiData.nomeProjeto || apiData.titulo || "",
          descricao: apiData.descricao || "",
          endereco,
          dataInicio: formatarDataSegura(dataInicioRaw),
          dataConclusao: formatarDataSegura(dataConclusaoRaw),
          documentos,
          comodos,
        };

        setProjeto(mapped);
      } catch (error) {
        console.error("Erro ao carregar projeto:", error);
        setProjeto(null);
      } finally {
        if (ativo) setCarregando(false);
      }
    };

    fetchProjeto();

    return () => { ativo = false; };
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
      window.location.reload();
    } catch (error) {
      console.error("Erro ao criar cômodo:", error);
      alert("Erro ao criar cômodo. Tente novamente.");
    }
  };

  return (
    <div className="h-svh flex flex-col overflow-hidden">
      <MenuInicial />
      <div className="flex flex-1 overflow-hidden">
        <BarraLateral onLogout={onLogout} />
        <main className="w-full overflow-y-auto px-10 py-8">
          {carregando ? (
            <div className="w-full py-20 text-center">Carregando dados da obra...</div>
          ) : !projeto ? (
            <div className="w-full py-20 text-center text-red-500">Projeto não encontrado.</div>
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
                      className="text-sm border border-[#c0392b] text-[#c0392b] rounded px-4 py-2 hover:bg-[#c0392b] hover:text-white transition-colors "
                    >
                      Editar Informações
                    </button>
                    <button className="text-sm border border-[#c0392b] text-[#c0392b] rounded px-4 py-2 hover:bg-[#c0392b] hover:text-white transition-colors">Entregar Manual</button>
                  </div>
                </div>
                <div className="mt-8 mb-8 ml-6  text-[#455861]">
                  <p className="font-semibold ">
                    <span className="text-(--cor-azul) font-bold">Descrição: </span>
                    {projeto.descricao}
                  </p>

                  <p className="font-semibold ">
                    <span className="text-(--cor-azul) font-bold">Endereço: </span>
                    {projeto.endereco}
                  </p>
                </div>

                <div className="text-base  text-[#455861] font-medium">
                  <p className="">Data de início da obra: {projeto.dataInicio}</p>
                  <p className="">Data estimada de conclusão: {projeto.dataConclusao}</p>
                </div>

              </div>

              <h3 className="page-title ">Documentos da Obra</h3>
              <div className="grid grid-cols-4 gap-4 mb-10">
                {projeto.documentos.map((planta) => {
                  const Icone = iconesProjeto[planta.tipo] ?? FaBuilding;
                  return (
                    <div
                      key={planta.id}
                      className="border border-gray-200 rounded-lg p-4 flex flex-col items-center gap-3 bg-white shadow-sm"
                    >
                      <p className="text-sm font-semibold text-[#c0392b] text-center">
                        {planta.tipo}
                      </p>
                      <div className="w-full h-28  rounded flex items-center justify-center">
                        <Icone size={48} className="text-gray-400" />
                      </div>
                      <p className="text-xs text-gray-400 text-center">
                        Última atualização: {planta.dataCriacao}
                      </p>
                      <div className="flex gap-2">
                        <button className="text-sm border border-[#c0392b] text-[#c0392b] rounded px-4 py-1 hover:bg-[#c0392b] hover:text-white transition-colors">
                          Visualizar
                        </button>
                        <button className="text-sm border border-[#c0392b] text-[#c0392b] rounded px-4 py-1 hover:bg-[#c0392b] hover:text-white transition-colors">
                          Alterar
                        </button>
                      </div>

                    </div>
                  );
                })}
              </div>

              <div className="w-full overflow-x-auto overflow-y-visible py-6 px-8 bg-white">
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
                      <span className="text-sm text-gray-400 mr-6">
                        Última alteração: {comodo.ultimaAlteracao}
                      </span>
                      <button
                        onClick={() => navigate(`/projetos/${id}/comodo/${comodo.id}/alteracoes`, { state: { projeto, comodo } })}
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