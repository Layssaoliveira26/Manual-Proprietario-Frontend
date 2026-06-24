import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BarraLateral from "../components/BarraLateral";
import MenuInicial from "../components/MenuInicial";
import { AREAS_SEM_TODOS } from '../services/materialsService';

const COMODOS_POR_ANDAR = {
    "Térreo":         ["Sala de estar", "Cozinha", "Lavabo", "Escritório", "Sala de Jantar", "Banheiro"],
    "Primeiro Andar": ["Quarto 1", "Quarto 2", "Suíte", "Banheiro", "Escritório", "Lavanderia"],
    "Segundo Andar":  ["Quarto 1", "Quarto 2", "Suíte", "Banheiro", "Varanda"],
    "Subsolo":        ["Garagem", "Depósito", "Sala técnica"],
    "Último Andar":   ["Cobertura", "Área gourmet", "Piscina"],
};

const ANDARES = Object.keys(COMODOS_POR_ANDAR);

function AdicionarMaterial({ onLogout }) {
    const { id } = useParams();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        nome: "",
        referencia: "",
        lote: "",
        marca: "",
        tamanho: "",
        tipo: "",
        cor: "",
        descricao: "",
    });

    const [areaSelecionada, setAreaSelecionada] = useState(null);
    const [andarSelecionado, setAndarSelecionado] = useState("Térreo");
    const [comodosSelecionados, setComodosSelecionados] = useState([]);

    const handleField = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const toggleComodo = (comodo) => {
        setComodosSelecionados((prev) =>
            prev.includes(comodo) ? prev.filter((c) => c !== comodo) : [...prev, comodo]
        );
    };

    const handleAndar = (e) => {
        setAndarSelecionado(e.target.value);
        setComodosSelecionados([]);
    };

    const handleSubmit = () => {
        console.log({ ...form, area: areaSelecionada, comodos: comodosSelecionados, andar: andarSelecionado });
        navigate(`/materiais/${id}`);
    };

    const comodos = COMODOS_POR_ANDAR[andarSelecionado] ?? [];

    return (
        <div className="h-svh flex flex-col overflow-hidden">
            <MenuInicial />
            <div className="flex flex-1 overflow-hidden">
                <BarraLateral onLogout={onLogout} />
                <main className="w-full overflow-y-auto px-10 py-8">

                    {/* Seção: Informações do Material */}
                    <section className="mb-10">
                        <p className="text-sm text-(--laranja-principal) font-semibold mb-1">Novo Material</p>
                        <h3 className="page-title mb-6">Informações do Material</h3>

                        {/* Linha 1: Nome, Referência, Lote */}
                        <div className="flex gap-4 mb-4">
                            <div className="flex flex-col gap-1 flex-[2]">
                                <label className="text-sm font-medium text-gray-700">
                                    Nome do Material<span className="text-red-500">*</span>
                                </label>
                                <input
                                    name="nome"
                                    value={form.nome}
                                    onChange={handleField}
                                    placeholder="Ex: Porcelanato Carrara 60×60"
                                    className="border border-gray-300 rounded px-3 h-10 text-sm focus:outline-none focus:border-gray-400"
                                />
                            </div>
                            <div className="flex flex-col gap-1 flex-1">
                                <label className="text-sm font-medium text-gray-700">Referência</label>
                                <input
                                    name="referencia"
                                    value={form.referencia}
                                    onChange={handleField}
                                    placeholder="Ex: CAR-80-POL"
                                    className="border border-gray-300 rounded px-3 h-10 text-sm focus:outline-none focus:border-gray-400"
                                />
                            </div>
                            <div className="flex flex-col gap-1 flex-1">
                                <label className="text-sm font-medium text-gray-700">Lote</label>
                                <input
                                    name="lote"
                                    value={form.lote}
                                    onChange={handleField}
                                    placeholder="Ex: L2024-001"
                                    className="border border-gray-300 rounded px-3 h-10 text-sm focus:outline-none focus:border-gray-400"
                                />
                            </div>
                        </div>

                        {/* Linha 2: Marca, Tamanho, Tipo, Cor */}
                        <div className="flex gap-4 mb-4">
                            {[
                                { name: "marca",   label: "Marca",   placeholder: "Ex: Portobello" },
                                { name: "tamanho", label: "Tamanho", placeholder: "Ex: 60×60cm"    },
                                { name: "tipo",    label: "Tipo",    placeholder: "Ex: Polido"     },
                                { name: "cor",     label: "Cor",     placeholder: "Ex: Branco Marmore" },
                            ].map(({ name, label, placeholder }) => (
                                <div key={name} className="flex flex-col gap-1 flex-1">
                                    <label className="text-sm font-medium text-gray-700">{label}</label>
                                    <input
                                        name={name}
                                        value={form[name]}
                                        onChange={handleField}
                                        placeholder={placeholder}
                                        className="border border-gray-300 rounded px-3 h-10 text-sm focus:outline-none focus:border-gray-400"
                                    />
                                </div>
                            ))}
                        </div>

                        {/* Descrição */}
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-gray-700">Descrição</label>
                            <textarea
                                name="descricao"
                                value={form.descricao}
                                onChange={handleField}
                                placeholder="Descreva o material"
                                rows={4}
                                className="border border-gray-300 rounded px-3 py-2 text-sm resize-none focus:outline-none focus:border-gray-400"
                            />
                        </div>
                    </section>

                    <hr className="border-gray-200 mb-10" />

                    {/* Seção: Área */}
                    <section className="mb-10">
                        <h3 className="page-title mb-1">Área</h3>
                        <p className="text-sm text-gray-400 mb-4">Selecione a área onde o material foi utilizado</p>
                        <div className="flex gap-3 flex-wrap">
                            {AREAS_SEM_TODOS.map((area) => {
                                const ativo = areaSelecionada === area;
                                return (
                                    <button
                                        key={area}
                                        onClick={() => setAreaSelecionada(area)}
                                        className={`px-5 h-9 rounded-sm text-sm font-semibold border-2 transition-all ${
                                            ativo
                                                ? "bg-(--laranja-principal) border-(--laranja-principal) text-white"
                                                : "border-gray-300 text-gray-600 hover:border-gray-400"
                                        }`}
                                    >
                                        {area}
                                    </button>
                                );
                            })}
                        </div>
                    </section>

                    <hr className="border-gray-200 mb-10" />

                    {/* Seção: Cômodo por andar */}
                    <section className="mb-12">
                        <h3 className="page-title mb-1">Cômodo por andar</h3>

                        {/* Select de andar */}
                        <div className="flex flex-col gap-1 mb-5 w-48">
                            <label className="text-sm font-medium text-gray-700">Andar</label>
                            <select
                                value={andarSelecionado}
                                onChange={handleAndar}
                                className="border border-gray-300 rounded px-3 h-10 text-sm bg-white focus:outline-none focus:border-gray-400"
                            >
                                {ANDARES.map((a) => (
                                    <option key={a} value={a}>{a}</option>
                                ))}
                            </select>
                        </div>

                        {/* Grid de checkboxes */}
                        <div className="grid grid-cols-4 gap-x-6 gap-y-3">
                            {comodos.map((comodo) => {
                                const marcado = comodosSelecionados.includes(comodo);
                                return (
                                    <label
                                        key={comodo}
                                        className="flex items-center gap-2 cursor-pointer text-sm text-gray-700 select-none"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={marcado}
                                            onChange={() => toggleComodo(comodo)}
                                            className="w-4 h-4 accent-(--laranja-principal) cursor-pointer"
                                        />
                                        {comodo}
                                    </label>
                                );
                            })}
                        </div>
                    </section>

                    {/* Botões */}
                    <div className="flex justify-end gap-3 pb-8">
                        <button
                            onClick={() => navigate(`/materiais/${id}`)}
                            className="px-6 h-10 rounded-sm border-2 border-gray-300 text-gray-600 text-sm font-semibold hover:border-gray-400 transition-all"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={!form.nome || !areaSelecionada}
                            className="px-6 h-10 rounded-sm text-sm font-semibold text-white bg-(--laranja-principal) border-2 border-(--laranja-principal) hover:opacity-90 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            Adicionar
                        </button>
                    </div>

                </main>
            </div>
        </div>
    );
}

export default AdicionarMaterial;