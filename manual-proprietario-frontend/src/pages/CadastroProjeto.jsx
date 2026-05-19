import { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; 
import BarraLateral from "../components/BarraLateral";
import MenuInicial from "../components/MenuInicial";
import BarraNumeros from "../components/BarraNumeros";
import { ValidateRequired, ValidateProjectDates, ValidateART } from "../utils/validations";
import api from "../services/api";

function CadastroProjeto() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        nomeProj: "",
        descProj: "",
        rua: "",
        bairro: "",
        numero: "",
        complemento: "",
        tipoConst: "",
        dataIni: "",
        dataConc: "",
        numArt: ""
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleNext = async (e) => {
        if (e) e.preventDefault();
        // Validação Local
        const novosErros = {
            nomeProj: ValidateRequired(formData.nomeProj, "Nome do Projeto"),
            rua: ValidateRequired(formData.rua, "Rua"),
            bairro: ValidateRequired(formData.bairro, "Bairro"),
            numero: ValidateRequired(formData.numero, "Número"),
            tipoConst: ValidateRequired(formData.tipoConst, "Tipo de Construção"),
            dataIni: ValidateRequired(formData.dataIni, "Data de Início"),
            dataConc: ValidateProjectDates(formData.dataIni, formData.dataConc),
            numArt: ValidateART(formData.numArt)
        };

        setErrors(novosErros);

        const existeErro = Object.values(novosErros).some(msg => msg !== "");
        if (existeErro) {
            return;
        }
             

        // back
        try {
            const formatarParaISO = (dataStr) => {
                if (!dataStr || dataStr.trim() === "") return null;
                    const data = new Date(dataStr);
                
                // Verifica se a data é válida antes de converter para ISO
                if (isNaN(data.getTime())) {
                    console.error("Data inválida detectada:", dataStr);
                    return null;
                }
                
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
                // Só envia dataConclusao se houver valor, para não bugar o Zod
                ...(formData.dataConc && { dataConclusao: formatarParaISO(formData.dataConc) })
            };

            const response = await api.post("/projects", dadosParaEnviar);

            const projectId = response.data.data.id;

            navigate("/cadastro-projeto2", { state: { projectId } });

        } catch (error) {
            if (error.response?.status === 400) {
                // Erros de validação do Zod que passaram pelo front
                console.error("Erro Zod:", error.response.data.errors);
                alert("Erro nos dados: " + error.response.data.errors[0].message);
            } else {
                console.error("DEBUG COMPLETO:", error);
                console.error("Erro na API:", error.response?.data?.message);
                alert(error.response?.data?.message || "Erro ao conectar com o servidor.");
            }
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
                    <div className="flex flex-col justify-center">
                        <form>
                            <div className="flex flex-col">
                                <label htmlFor="nomeProj">Nome do Projeto*</label>
                                <input 
                                    name="nomeProj"
                                    value={formData.nomeProj}
                                    onChange={handleChange}
                                    type="text" 
                                    placeholder="nome" 
                                    className={`w-full mt-3 mb-1 px-4 py-3.5 border rounded-lg text-sm outline-none ${errors.nomeProj ? 'border-red-500' : 'border-[#dcdcdc]'}`}
                                />
                                {errors.nomeProj && <span className="text-red-500 text-xs mb-2">{errors.nomeProj}</span>}
                            </div>

                            <div className="flex flex-col lg:flex-row gap-10 w-full mt-2">
                                <div className="flex flex-col w-full">
                                    <label htmlFor="rua">Rua*</label>
                                    <input 
                                        name="rua"
                                        value={formData.rua}
                                        onChange={handleChange}
                                        type="text" 
                                        className={`mt-3 mb-1 px-4 py-3.5 border rounded-lg text-sm outline-none ${errors.rua ? 'border-red-500' : 'border-[#dcdcdc]'}`}
                                    />
                                    {errors.rua && <span className="text-red-500 text-xs mb-2">{errors.rua}</span>}
                                </div>
                                <div className="flex flex-col w-full">
                                    <label htmlFor="bairro">Bairro*</label>
                                    <input 
                                        name="bairro"
                                        value={formData.bairro}
                                        onChange={handleChange}
                                        type="text" 
                                        className={`mt-3 mb-1 px-4 py-3.5 border rounded-lg text-sm outline-none ${errors.bairro ? 'border-red-500' : 'border-[#dcdcdc]'}`}
                                    />
                                    {errors.bairro && <span className="text-red-500 text-xs mb-2">{errors.bairro}</span>}
                                </div>
                            </div>

                            <div className="flex flex-col lg:flex-row gap-10 w-full mt-2">
                                <div className="flex flex-col w-1/3">
                                    <label htmlFor="numero">Número*</label>
                                    <input 
                                        name="numero"
                                        value={formData.numero}
                                        onChange={handleChange}
                                        type="number" 
                                        className={`mt-3 mb-1 px-4 py-3.5 border rounded-lg text-sm outline-none ${errors.numero ? 'border-red-500' : 'border-[#dcdcdc]'}`}
                                    />
                                    {errors.numero && <span className="text-red-500 text-xs mb-2">{errors.numero}</span>}
                                </div>
                                <div className="flex flex-col w-1/3">
                                    <label htmlFor="complemento">Complemento</label>
                                    <input name="complemento" value={formData.complemento} onChange={handleChange} type="text" className="mt-3 mb-3 px-4 py-3.5 border border-[#dcdcdc] rounded-lg text-sm outline-none"/>
                                </div>
                                <div className="flex flex-col w-1/3">
                                    <label htmlFor="tipoConst">Tipo de Construção*</label>
                                    <select 
                                        name="tipoConst"
                                        value={formData.tipoConst}
                                        onChange={handleChange}
                                        className={`mt-3 mb-1 px-4 py-3.5 border rounded-lg text-sm outline-none ${errors.tipoConst ? 'border-red-500' : 'border-[#dcdcdc]'}`}
                                    >
                                        <option value="">Selecione...</option>
                                        <option value="Residencial">Residencial</option>
                                        <option value="Comercial">Comercial</option>
                                    </select>
                                    {errors.tipoConst && <span className="text-red-500 text-xs mb-2">{errors.tipoConst}</span>}
                                </div> 
                            </div>

                            <div className="flex flex-col lg:flex-row gap-10 w-full mt-2">
                                <div className="flex flex-col w-full">
                                    <label htmlFor="dataIni">Data de início*</label>
                                    <input 
                                        name="dataIni"
                                        value={formData.dataIni}
                                        onChange={handleChange}
                                        type="date" 
                                        className={`mt-3 mb-1 px-4 py-3.5 border rounded-lg text-sm outline-none ${errors.dataIni ? 'border-red-500' : 'border-[#dcdcdc]'}`}
                                    />
                                    {errors.dataIni && <span className="text-red-500 text-xs mb-2">{errors.dataIni}</span>}
                                </div>
                                <div className="flex flex-col w-full">
                                    <label htmlFor="dataConc">Data de conclusão estimada</label>
                                    <input 
                                        name="dataConc"
                                        value={formData.dataConc}
                                        onChange={handleChange}
                                        type="date" 
                                        className={`mt-3 mb-1 px-4 py-3.5 border rounded-lg text-sm outline-none ${errors.dataConc ? 'border-red-500' : 'border-[#dcdcdc]'}`}
                                    />
                                    {errors.dataConc && <span className="text-red-500 text-xs mb-2">{errors.dataConc}</span>}
                                </div>
                                <div className="flex flex-col w-full">
                                    <label htmlFor="numArt">Número do ART*</label>
                                    <input 
                                        name="numArt"
                                        value={formData.numArt}
                                        onChange={handleChange}
                                        type="text" 
                                        className={`mt-3 mb-1 px-4 py-3.5 border rounded-lg text-sm outline-none ${errors.numArt ? 'border-red-500' : 'border-[#dcdcdc]'}`}
                                    />
                                    {errors.numArt && <span className="text-red-500 text-xs mb-2">{errors.numArt}</span>}
                                </div> 
                            </div>

                            {/* Botões */}
                            <div className="flex justify-center items-center gap-3 mt-8">
                                <Link to="/projetos" className="w-full max-w-37.5 py-3 px-4 text-center text-(--laranja-principal) border-(--laranja-principal) border-2 rounded-md font-medium">
                                    Cancelar
                                </Link>
                                <button 
                                    type="button" 
                                    onClick={handleNext}
                                    className="w-full max-w-37.5 py-3 px-4 bg-(--laranja-principal) text-white rounded-md font-medium"
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

export default CadastroProjeto;