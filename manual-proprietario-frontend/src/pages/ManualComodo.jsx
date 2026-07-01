import { useNavigate, useParams } from "react-router-dom";
import BarraLateral from "../components/BarraLateral";
import MenuInicial from "../components/MenuInicial";

function ManualComodo({ onLogout }) {
    const { id, idComodo } = useParams();
    const navigate = useNavigate();

    return (
        <div className="h-svh flex flex-col overflow-hidden">
            <MenuInicial />
            <div className="flex flex-1 overflow-hidden">
                <BarraLateral onLogout={onLogout} />
                <main className="w-full overflow-y-auto px-10 py-8 bg-gray-100">
                    <div className="mb-6">
                        <p className="text-lg font-semibold text-(--laranja-principal)">Manual</p>
                        <h1 className="text-(--cor-azul) text-4xl font-semibold mt-2 pl-2">
                            Detalhes do cômodo
                        </h1>
                    </div>

                    <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm text-[#455861]">
                        <p className="font-semibold">Manual: {id}</p>
                        <p className="font-semibold mt-2">Cômodo: {idComodo}</p>
                        <p className="mt-4">Conteúdo detalhado do cômodo será exibido aqui.</p>

                        <button
                            type="button"
                            onClick={() => navigate(`/manuais/${id}/comodo/${idComodo}/visualizaralteracoescomodo`, { state: { comodo: { nome: `Cômodo ${idComodo}` } } })}
                            className="mt-6 rounded-md bg-[#c0392b] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#a93226]"
                        >
                            Visualizar Alteração
                        </button>
                    </section>
                </main>
            </div>
        </div>
    );
}

export default ManualComodo;