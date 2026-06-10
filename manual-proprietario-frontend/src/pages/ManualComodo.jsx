import { useParams } from "react-router-dom";
import BarraLateral from "../components/BarraLateral";
import MenuInicial from "../components/MenuInicial";

function ManualComodo({ onLogout }) {
    const { id, idComodo } = useParams();

    return (
        <div className="h-svh flex flex-col overflow-hidden">
            <MenuInicial />
            <div className="flex flex-1 overflow-hidden">
                <BarraLateral onLogout={onLogout} />
                <main className="w-full overflow-y-auto px-10 py-8">
                    {/* Conteúdo a ser implementado */}
                </main>
            </div>
        </div>
    );
}

export default ManualComodo;