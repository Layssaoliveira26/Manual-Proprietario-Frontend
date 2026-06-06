import { useParams, useNavigate } from "react-router-dom";
import { FaBuilding, FaSitemap, FaWater, FaBolt } from "react-icons/fa";
import BarraLateral from "../components/BarraLateral";
import MenuInicial from "../components/MenuInicial";
import { plantasMock, comodosMock } from "../mocks/manuaisDetalhes";
import { useAuth } from "../context/AuthContext";

const iconesProjeto = {
  "Projeto Arquitetônico": FaBuilding,
  "Projeto Estrutural": FaSitemap,
  "Projeto Hidrossanitário": FaWater,
  "Projeto Elétrico": FaBolt,
};

function ManualDetalhe({ onLogout }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="h-svh flex flex-col overflow-hidden">
      <MenuInicial />
      <div className="flex flex-1 overflow-hidden">
        <BarraLateral onLogout={onLogout} />
        <main className="w-full overflow-y-auto px-10 py-8">
          
          <div className="mb-8">
            <p className="text-lg font-semibold text-[var(--laranja-principal)]">Manual</p>
            <h3 className="text-[var(--cor-azul)] text-4xl font-bold mt-2 pl-2 font-semibold">Apartamento do {user?.name ?? user?.nome ?? "Usuário"}</h3>
            <div className="mt-8 mb-8 ml-6  text-[#455861]">
              <p className="font-semibold ">
                <span className="text-[var(--cor-azul)] font-bold">Descrição: </span>
                  Apartamento aconchegante e futurísico com insipirações da natureza. A estética 
                  e design evoca a calmaria do campo atrelada de forma apaziguadora à agitação advinda dos 
                  populosos centros urbanos.
              </p>
              

              <p className="font-semibold ">
                <span className="text-[var(--cor-azul)] font-bold">Endereço: </span>
                
                [Rua], [Número], [Complemento] - [Bairro]
              </p>
            </div>
            
            <div className="text-base  text-[#455861] font-medium">
              <p className="">Data de início da obra: 01/01/1999</p>
              <p className="">Data estimada de conclusão: 12/12/2026</p>
            </div>
            
          </div>
          

          <h3 className="page-title ">Documentos da Obra</h3>
          <div className="grid grid-cols-4 gap-4 mb-10">
            {plantasMock.map((planta) => {
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
                  <button className="text-sm border border-[#c0392b] text-[#c0392b] rounded px-4 py-1 hover:bg-[#c0392b] hover:text-white transition-colors">
                    Visualizar
                  </button>
                </div>
              );
            })}
          </div>
        
        <div className="w-full overflow-x-auto overflow-y-visible py-6 px-8 bg-white">
            <h2 className="text-3xl font-semibold text-[var(--cor-azul)] mb-4">Cômodos</h2>
            <div className="flex flex-col ">
                {comodosMock.map((comodo) => (
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
                    className="bg-[#c0392b] text-white text-sm rounded px-4 py-1.5 hover:bg-[#a93226] transition-colors whitespace-nowrap"
                    >
                    Ver Alterações
                    </button>
                </div>
                ))}
            </div>
        </div>
          {/* Seção Cômodos */}
          

        </main>
      </div>
    </div>
  );
}

export default ManualDetalhe;