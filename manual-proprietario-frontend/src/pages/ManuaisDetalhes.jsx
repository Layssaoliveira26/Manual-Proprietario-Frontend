import { useParams, useNavigate } from "react-router-dom";
import BarraLateral from "../components/BarraLateral";
import MenuInicial from "../components/MenuInicial";
import { plantasMock, comodosMock } from "../mocks/manuaisDetalhes";

function ManualDetalhe({ onLogout }) {
    const { id } = useParams();
    const navigate = useNavigate();

    return (
        <div className="h-svh flex flex-col overflow-hidden">
            <MenuInicial />
            <div className="flex flex-1 overflow-hidden">
                <BarraLateral onLogout={onLogout} />
                <main className="w-full overflow-y-auto px-10 py-8">
                    {/* Plantas */}
                    {plantasMock.map((planta) => (
                        <div key={planta.id}>{planta.tipo}</div>
                    ))}
                    {/* Cômodos */}
                    {comodosMock.map((comodo) => (
                        <div
                            key={comodo.id}
                            className="cursor-pointer"
                            onClick={() => navigate(`/manuais/${id}/comodo/${comodo.id}`)}
                        >
                            {comodo.nome}
                        </div>
                    ))}
                </main>
            </div>
        </div>
    );
}

export default ManualDetalhe;