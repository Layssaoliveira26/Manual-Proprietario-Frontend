import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom"; 
import BarraLateral from "../components/BarraLateral";
import MenuInicial from "../components/MenuInicial";
import BarraNumeros from "../components/BarraNumeros";
import { LuTrash2 } from "react-icons/lu";
import api from "../services/api"; 
import { ValidateRequired, ValidateFullName, ValidateMinLength } from "../utils/validations";

function CadastroProjeto2() {
    const navigate = useNavigate();
    const location = useLocation();
    
    // Captura o ID que veio da Tela 1. Se o Victor recarregar a página (F5), ele perde o state.
    const projectId = location.state?.projectId;

    const [funcionarios, setFuncionarios] = useState([{ nome: "", cargo: "Pedreiro" }]);
    const [errors, setErrors] = useState([]);

    const adicionarCampos = (e) => {
        e.preventDefault();
        setFuncionarios([...funcionarios, { nome: "", cargo: "Pedreiro" }]);
    };

    const handleInputChange = (index, event) => {
        const values = [...funcionarios];
        values[index][event.target.name] = event.target.value;
        setFuncionarios(values);
        
        // Limpa o erro da linha enquanto digita
        if (errors[index]) {
            const novosErros = [...errors];
            novosErros[index].nome = "";
            setErrors(novosErros);
        }
    };

    const removerFuncionario = (indexParaRemover, e) => {
        e.preventDefault(); 
        if (funcionarios.length === 1) return;

        const novaLista = funcionarios.filter((_, index) => index !== indexParaRemover);
        setFuncionarios(novaLista);

        const novosErros = errors.filter((_, index) => index !== indexParaRemover);
        setErrors(novosErros);
    };

    const handleNext = async () => {
        // 1. Validação Local
        const errosValidados = funcionarios.map((func) => {
            let erroResult = ValidateRequired(func.nome, "Nome do Funcionário");
            if (erroResult === "") erroResult = ValidateMinLength(func.nome, 3, "Nome do Funcionário");
            if (erroResult === "") erroResult = ValidateFullName(func.nome) || "";
            return { nome: erroResult };
        });

        setErrors(errosValidados);

        const temErro = errosValidados.some(erro => erro.nome !== "");
        if (temErro) return;

        if (!projectId) {
            alert("ID do projeto não encontrado. Volte ao Passo 1.");
            return;
        }

        try {
            const chamadas = funcionarios.map(func => 
                api.post(`/projects/${projectId}/employees`, {
                    nomeFunc: func.nome,
                    cargo: func.cargo
                })
            );

            await Promise.all(chamadas);

            navigate("/cadastro-projeto3", { state: { projectId } });

        } catch (error) {
            console.error("Erro ao salvar funcionários:", error);
            alert(error.response?.data?.message || "Erro ao salvar equipe.");
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
                    
                    <div className="flex flex-col justify-center mt-6">
                        <form>
                            {!projectId && (
                                <div className="bg-amber-50 p-4 rounded-md mb-6 border border-amber-200">
                                    <p className="text-amber-800 text-sm">
                                        ⚠️ <strong>Atenção:</strong> Você está sem o ID do projeto. 
                                        Se recarregou a página, volte ao <Link to="/cadastro-projeto" className="underline">Passo 1</Link>.
                                    </p>
                                </div>
                            )}

                            {funcionarios.map((func, index) => (
                                <div key={index} className="flex flex-col lg:flex-row gap-6 w-full mb-6 items-start">
                                    <div className="flex flex-col w-full">
                                        <label className="font-semibold text-sm">Nome do Funcionário*</label>
                                        <input 
                                            type="text" 
                                            name="nome"
                                            value={func.nome}
                                            onChange={(e) => handleInputChange(index, e)}
                                            placeholder="Nome e Sobrenome" 
                                            className={`w-full mt-2 px-4 py-3 border rounded-lg text-sm outline-none ${errors[index]?.nome ? 'border-red-500' : 'border-[#dcdcdc]'}`}
                                        />
                                        {errors[index]?.nome && <span className="text-red-500 text-xs mt-1 font-medium">{errors[index].nome}</span>}
                                    </div>

                                    <div className="flex flex-col w-full lg:max-w-xs">
                                        <label className="font-semibold text-sm">Cargo</label>
                                        <div className="flex items-center gap-3">
                                            <select 
                                                name="cargo"
                                                value={func.cargo}
                                                onChange={(e) => handleInputChange(index, e)}
                                                className="w-full mt-2 px-4 py-3 border border-[#dcdcdc] rounded-lg text-sm outline-none bg-white"
                                            >
                                                <option value="Pedreiro">Pedreiro</option>
                                                <option value="Mestre de Obras">Mestre de Obras</option>
                                                <option value="Eletricista">Eletricista</option>
                                            </select>

                                            {funcionarios.length > 1 && (
                                                <button 
                                                    type="button"
                                                    onClick={(e) => removerFuncionario(index, e)}
                                                    className="mt-2 p-3 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                                                >
                                                    <LuTrash2 size={20} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}

                            <div className="flex justify-center mt-4">
                                <button 
                                    className="px-6 py-2 text-[var(--laranja-principal)] border-[var(--laranja-principal)] border-2 rounded-md font-bold hover:bg-[var(--laranja-principal)] hover:text-white transition-all" 
                                    onClick={adicionarCampos}
                                >
                                    + Adicionar Funcionário
                                </button>
                            </div>

                            <div className="flex justify-center items-center gap-4 mt-16">
                                <Link to="/cadastro-projeto" className="w-40 py-3 text-center text-[var(--laranja-principal)] border-[var(--laranja-principal)] border-2 rounded-md font-semibold">
                                    Anterior
                                </Link>
                                <button 
                                    type="button" 
                                    onClick={handleNext}
                                    className="w-40 py-3 bg-[var(--laranja-principal)] text-white rounded-md font-semibold"
                                >
                                    Próximo
                                </button>
                            </div>
                        </form>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default CadastroProjeto2;