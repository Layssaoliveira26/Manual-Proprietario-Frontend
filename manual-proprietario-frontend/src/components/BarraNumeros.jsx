import { useLocation, useNavigate } from "react-router-dom";
import {
    ValidateART,
    ValidateFileRequired,
    ValidateFileSize,
    ValidateFileType,
    ValidateFullName,
    ValidateMinLength,
    ValidateProjectDates,
    ValidateRequired,
} from "../utils/validations";

function BarraNumeros({ formData: formDataProp, funcionarios: funcionariosProp, arquivos: arquivosProp } = {}) {
    const navigate = useNavigate();
    const location = useLocation();

    const etapas = [
        { numero: 1, label: "Obra", rota: "/cadastro-projeto" },
        { numero: 2, label: "Funcionários", rota: "/cadastro-projeto2" },
        { numero: 3, label: "Documentos", rota: "/cadastro-projeto3" },
    ];

    const formData = formDataProp ?? location.state?.formData;
    const funcionarios = funcionariosProp ?? location.state?.funcionarios;
    const arquivos = arquivosProp ?? location.state?.arquivos;

    const isEtapa1Concluida = (data) => {
        if (!data) return false;
        const erros = [
            ValidateRequired(data.nomeProj, "Nome do Projeto"),
            ValidateRequired(data.rua, "Rua"),
            ValidateRequired(data.bairro, "Bairro"),
            ValidateRequired(data.numero, "Número"),
            ValidateRequired(data.tipoConst, "Tipo de Construção"),
            ValidateRequired(data.dataIni, "Data de Início"),
            ValidateProjectDates(data.dataIni, data.dataConc),
            ValidateART(data.numArt),
        ];
        return erros.every((msg) => msg === "");
    };

    const isEtapa2Concluida = (emps) => {
        if (!Array.isArray(emps) || emps.length === 0) return false;
        return emps.every((func) => {
            let erroResult = ValidateRequired(func?.nome, "Nome do Funcionário");
            if (erroResult === "") erroResult = ValidateMinLength(func?.nome || "", 3, "Nome do Funcionário");
            if (erroResult === "") erroResult = ValidateFullName(func?.nome) || "";
            return erroResult === "";
        });
    };

    const isEtapa3Concluida = (filesById) => {
        if (!filesById) return false;
        const projetos = [
            { id: "projArquitetonico", label: "Projeto Arquitetônico" },
            { id: "projEstrutural", label: "Projeto Estrutural" },
            { id: "projHidrossanitario", label: "Projeto Hidrossanitário" },
            { id: "projEletrico", label: "Projeto Elétrico" },
        ];
        return projetos.every((proj) => {
            const arquivo = filesById[proj.id];
            let erro = ValidateFileRequired(arquivo, proj.label);
            if (erro === "") erro = ValidateFileType(arquivo);
            if (erro === "") erro = ValidateFileSize(arquivo, 5);
            return erro === "";
        });
    };

    const etapasConcluidas = new Set([
        ...(isEtapa1Concluida(formData) ? [1] : []),
        ...(isEtapa2Concluida(funcionarios) ? [2] : []),
        ...(isEtapa3Concluida(arquivos) ? [3] : []),
    ]);

    const stateToKeep = {
        ...(formData ? { formData } : {}),
        ...(funcionarios ? { funcionarios } : {}),
        ...(arquivos ? { arquivos } : {}),
    };

    return (
        <div className="relative flex w-fit mx-auto gap-15 mb-5 before:content-[''] before:absolute before:top-5 before:left-5 before:right-6 before:h-0.5 before:bg-[rgba(0,0,0,0.123)]">
            {etapas.map((etapa) => {
                const concluida = etapasConcluidas.has(etapa.numero);
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
                        onClick={() => navigate(etapa.rota, { state: stateToKeep })}
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