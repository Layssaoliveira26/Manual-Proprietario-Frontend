import { useParams } from "react-router-dom";
import BarraLateral from "../components/BarraLateral";
import MenuInicial from "../components/MenuInicial";

function ProjetosComodo({ onLogout }) {
    const { id, idComodo } = useParams();

    return (
        <div className="h-svh flex flex-col overflow-hidden">
            <MenuInicial />
            <div className="flex flex-1 overflow-hidden">
                <BarraLateral onLogout={onLogout} />
                <main className="w-full overflow-y-auto px-10 py-8">
                    <div className="mb-6">
                        <p className="text-lg font-semibold text-(--laranja-principal)">Projeto</p>
                        <h3 className="text-(--cor-azul) text-4xl font-semibold mt-2 pl-2">
                            Detalhes do cômodo
                        </h3>
                    </div>
                    <div className="rounded-lg border border-gray-200 bg-white p-6 text-[#455861] shadow-sm">
                        <p className="font-semibold">Projeto: {id}</p>
                        <p className="font-semibold mt-2">Cômodo: {idComodo}</p>
                        <p className="mt-4">Conteúdo detalhado do cômodo será exibido aqui.</p>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default ProjetosComodo;