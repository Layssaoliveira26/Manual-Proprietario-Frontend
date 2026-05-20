import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import BarraLateral from "../components/BarraLateral";
import MenuInicial from "../components/MenuInicial";
import { LuUpload } from "react-icons/lu";
import { IoDocumentTextOutline } from "react-icons/io5";
import BarraNumeros from "../components/BarraNumeros";
import api from "../services/api"; 
import { ValidateFileRequired, ValidateFileType, ValidateFileSize } from "../utils/validations";

function CadastroProjeto3() {
    const navigate = useNavigate();
    const location = useLocation();
    
    // Captura as informações do projeto que veio das telas anteriores
    const formData = location.state?.formData;
    const funcionarios = location.state?.funcionarios;

    const [arquivos, setArquivos] = useState({});
    const [errors, setErrors] = useState({}); 
    
    const projetos = [
        { id: "projArquitetonico", label: "Projeto Arquitetônico" },
        { id: "projEstrutural", label: "Projeto Estrutural" },
        { id: "projHidrossanitario", label: "Projeto Hidrossanitário" },
        { id: "projEletrico", label: "Projeto Elétrico" },
    ];

    function atualizarArquivo(id, e) {
        const arquivo = e.target.files[0];
        if (!arquivo) return;
        
        setErrors(prev => ({ ...prev, [id]: "" }));
        
        const novosArquivos = { ...arquivos, [id]: arquivo };
        setArquivos(novosArquivos);
    }

    const handleFinalizar = async (e) => {
        e.preventDefault();
        
        // Validação Local
        let novosErros = {};
        projetos.forEach((proj) => {
            const arquivo = arquivos[proj.id];
            let erro = ValidateFileRequired(arquivo, proj.label);
            if (!erro) erro = ValidateFileType(arquivo);
            if (!erro) erro = ValidateFileSize(arquivo, 5);
            if (erro) novosErros[proj.id] = erro;
        });

        setErrors(novosErros);

        const temErro = Object.keys(novosErros).length > 0;
        if (temErro) return;

        if (!formData) {
            alert("Dados do projeto não encontrados. Por favor, reinicie o cadastro.");
            return;
        }

        try {
            // 1. Criação o projeto
            const formatarParaISO = (dataStr) => {
                if (!dataStr || dataStr.trim() === "") return null;
                const data = new Date(dataStr);
                if (isNaN(data.getTime())) return null;
                return data.toISOString();
            };

            const dadosParaEnviar = {
                nomeProjeto: formData.nomeProj,
                descricao: formData.descProj || undefined,
                rua: formData.rua,
                bairro: formData.bairro,
                numero: String(formData.numero),
                complemento: formData.complemento || undefined,
                tipoConstrucao: formData.tipoConst,
                dataInicio: formatarParaISO(formData.dataIni),
                art: formData.numArt || undefined,
                ...(formData.dataConc && { dataConclusao: formatarParaISO(formData.dataConc) })
            };

            const response = await api.post("/projects", dadosParaEnviar);
            const projectId = response.data.data.id;

            // 2. Cadastrar funcionários
            await Promise.all(funcionarios.map(func =>
                api.post(`/projects/${projectId}/employees`, {
                    nomeFunc: func.nome,
                    cargo: func.cargo
                })
            ));

            // 3. Upload dos documentos
            await Promise.all(Object.keys(arquivos).map(async (key) => {
                const form = new FormData();
                const labelPlanta = projetos.find(p => p.id === key)?.label || key;
                form.append("tipoPlanta", labelPlanta);
                form.append("file", arquivos[key]);
                return api.post(`/projects/${projectId}/documents`, form, {
                    headers: { "Content-Type": "multipart/form-data" }
                });
            }));

            alert("Projeto cadastrado com sucesso!");
            navigate("/projetos");
        } catch (error) {
            console.error("Erro ao finalizar cadastro:", error);
            alert(error.response?.data?.message || "Erro ao cadastrar projeto.");
        }
    };

    return (
        <div className="h-svh flex flex-col overflow-hidden">
            <MenuInicial />
            <div className="flex flex-1 overflow-hidden">
                <BarraLateral />
                <main className="w-full overflow-y-auto px-10 py-8">
                    <h3 className="page-title pl-2">Configurar Projeto</h3>
                    <BarraNumeros />
                    
                    {!formData && (
                        <div className="bg-red-50 text-red-700 p-4 rounded-md mb-6 border border-red-200 text-sm">
                            ⚠️ As informações do projeto não foram detectadas. Se você recarregou a página, 
                            precisará voltar ao <Link to="/cadastro-projeto" className="underline font-bold">Início</Link>.
                        </div>
                    )}

                    <div className="flex flex-col justify-center mt-10">
                        <form onSubmit={handleFinalizar}>
                            <div className="flex justify-center text-center gap-6">
                                {projetos.map((proj) => (
                                    <div key={proj.id} className="flex flex-col w-full max-w-1/4 gap-2">
                                        <label htmlFor={proj.id} className="text-(--laranja-principal) font-medium text-sm">
                                            {proj.label}
                                        </label>
                                        <label
                                            htmlFor={proj.id}
                                            className={`flex flex-col items-center justify-center gap-2 w-full h-32 border rounded-lg cursor-pointer transition-all ${
                                                errors[proj.id] ? 'border-red-500 bg-red-50' : 'border-[#dcdcdc] hover:bg-gray-50'
                                            }`}
                                        >
                                            {arquivos[proj.id] ? (
                                                <>
                                                    <IoDocumentTextOutline className="text-(--laranja-principal) text-xl" />

                                                    <span className="text-[10px] text-(--laranja-principal) font-medium px-2 truncate w-full text-center">
                                                        {arquivos[proj.id].name}
                                                    </span>
                                                </>
                                            ) : (
                                                <>
                                                    <LuUpload className={`text-xl ${errors[proj.id] ? 'text-red-500' : 'text-[#aaa]'}`} />
                                                    <span className={`text-xs ${errors[proj.id] ? 'text-red-500' : 'text-[#aaa]'}`}>Importar arquivo</span>
                                                </>
                                            )}
                                            <input
                                                type="file"
                                                id={proj.id}
                                                className="hidden"
                                                onChange={(e) => atualizarArquivo(proj.id, e)}
                                                disabled={!formData}
                                            />
                                        </label>
                                        {errors[proj.id] && (
                                            <span className="text-red-500 text-[10px] leading-tight font-medium">
                                                {errors[proj.id]}
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-center items-center gap-3 mt-40">
                                <Link
                                    to="/cadastro-projeto2"
                                    state={{ formData, funcionarios }}
                                    className="w-full max-w-37.5 py-3 px-4 text-center text-(--laranja-principal) border-(--laranja-principal) border-2 rounded-md font-medium"
                                >
                                    Anterior
                                </Link>
                                <button 
                                    type="submit" 
                                    disabled={!formData}
                                    className={`w-full max-w-37.5 py-3 px-4 text-white rounded-md font-medium transition-all ${
                                        !formData ? 'bg-gray-300 cursor-not-allowed' : 'bg-(--laranja-principal) hover:brightness-95'
                                    }`}
                                >
                                    Finalizar Cadastro
                                </button>
                            </div>
                        </form>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default CadastroProjeto3;