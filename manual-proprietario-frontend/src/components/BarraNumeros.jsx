import { useLocation, useNavigate } from "react-router-dom";

function BarraNumeros() {
    const navigate = useNavigate();
    const location = useLocation();

    const etapas = [
        { numero: 1, label: "Obra", rota: "/cadastro-projeto" },
        { numero: 2, label: "Funcionários", rota: "/cadastro-projeto2" },
        { numero: 3, label: "Documentos", rota: "/cadastro-projeto3" },
    ];

    const etapaAtual = etapas.find((e) => e.rota === location.pathname)?.numero ?? 1;
    const projectId = location.state?.projectId;
    const passosConcluidos = projectId
        ? new Set(etapas.filter((e) => e.numero < etapaAtual).map((e) => e.numero))
        : new Set();

    return (
        <div className="relative flex w-fit mx-auto gap-15 mb-5 before:content-[''] before:absolute before:top-5 before:left-5 before:right-6 before:h-0.5 before:bg-[rgba(0,0,0,0.123)]">
            {etapas.map((etapa) => {
                const concluida = passosConcluidos.has(etapa.numero);
                const circleClassName = [
                    "relative z-10 inline-flex h-10 w-10 items-center justify-center rounded-full border-2",
                    concluida
                        ? "bg-[var(--laranja-principal)] text-white border-[var(--laranja-principal)]"
                        : "border-[rgba(0,0,0,0.123)] bg-white",
                ].join(" ");

                return (
                    <div
                        key={etapa.numero}
                        className="flex flex-col items-center gap-1 cursor-pointer"
                        onClick={() => navigate(etapa.rota)}
                    >
                        <span className={circleClassName}>{etapa.numero}</span>
                        <p>{etapa.label}</p>
                    </div>
                );
            })}
        </div>
    );
}

export default BarraNumeros;