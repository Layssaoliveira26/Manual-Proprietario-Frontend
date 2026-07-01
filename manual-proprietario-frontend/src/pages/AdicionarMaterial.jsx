import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BarraLateral from "../components/BarraLateral";
import MenuInicial from "../components/MenuInicial";
import { criarMaterial, AREAS_SEM_TODOS } from '../services/materialsService';
import { ValidateRequired } from '../utils/validations'; 
import api from '../services/api';

function AdicionarMaterial({ onLogout }) {
    const { id } = useParams();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        nomeMaterial: "",
        referencia: "",
        lote: "",
        marca: "",
        tamanho: "",
        tipoMaterial: "",
        cor: "",
        descricaoMaterial: "",
    });

    const [andares, setAndares] = useState([]);
    const [andarSelecionado, setAndarSelecionado] = useState(null);
    const [comodosSelecionados, setComodosSelecionados] = useState([]);
    const [areaSelecionada, setAreaSelecionada] = useState(null);

    const [carregando, setCarregando] = useState(true);
    const [enviando, setEnviando] = useState(false);
    const [erros, setErros] = useState({});

    // Busca andares
    useEffect(() => {
        const fetchAndares = async () => {
            try {
                const response = await api.get(`/projects/${id}/rooms`);
                const data = response.data?.data || [];
                setAndares(data);
                if (data.length > 0) {
                    setAndarSelecionado(data[0].id);
                }
            } catch (err) {
                console.error('Erro ao buscar andares:', err);
                setErros({ geral: 'Erro ao carregar cômodos' });
            } finally {
                setCarregando(false);
            }
        };

        fetchAndares();
    }, [id]);

    const handleField = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const toggleComodo = (idComodo, idAndar) => {
        setComodosSelecionados((prev) => {
            const existe = prev.some((c) => c.idComodo === idComodo && c.idAndar === idAndar);
            if (existe) {
                return prev.filter((c) => !(c.idComodo === idComodo && c.idAndar === idAndar));
            } else {
                return [...prev, { idComodo, idAndar }];
            }
        });
    };

    const handleAndar = (andarId) => {
        setAndarSelecionado(andarId);
        setComodosSelecionados([]);
    };

    const validar = () => {
        const novoErros = {};

        // Valida nome do material
        const erroNome = ValidateRequired(form.nomeMaterial, 'Nome do Material');
        if (erroNome) novoErros.nomeMaterial = erroNome;

        // Valida área
        if (!areaSelecionada) {
            novoErros.area = 'Selecione uma área';
        }

        // Valida cômodos
        if (comodosSelecionados.length === 0) {
            novoErros.comodos = 'Selecione pelo menos um cômodo';
        }

        setErros(novoErros);
        return Object.keys(novoErros).length === 0;
    };

    const handleSubmit = async () => {
        if (!validar()) return;

        const areaMap = {
            'Revestimentos': 'REVESTIMENTOS',
            'Pinturas': 'PINTURAS',
            'Louças e metais': 'LOUCAS_E_METAIS',
            'Luminárias': 'LUMINARIAS',
        };

        const payload = {
            nomeMaterial: form.nomeMaterial,
            area: areaMap[areaSelecionada],
            referencia: form.referencia || " ",
            lote: form.lote || " ",
            marca: form.marca || " ",
            tamanho: form.tamanho || " ",
            tipoMaterial: form.tipoMaterial || " ",
            cor: form.cor || " ",
            descricaoMaterial: form.descricaoMaterial || " ",
            comodos: comodosSelecionados,
        };

        console.log("Payload enviado:", payload);

        try {
            setEnviando(true);
            setErros({});

            await criarMaterial(id, payload);

            navigate(`/materiais/${id}`, { state: { sucessoMaterial: true, nomeDoMaterial: form.nomeMaterial} });
            
        } catch (err) {
            console.error('Erro ao criar material:', err);
            setErros({ geral: err.message || 'Erro ao criar material' });
        } finally {
            setEnviando(false);
        }
    };

    const andarAtual = andares.find((a) => a.id === andarSelecionado);
    const comodos = andarAtual?.comodos ?? [];

    if (carregando) {
        return (
            <div className="h-svh flex flex-col overflow-hidden">
                <MenuInicial />
                <div className="flex flex-1 overflow-hidden">
                    <BarraLateral onLogout={onLogout} />
                    <main className="w-full overflow-y-auto px-10 py-8 flex items-center justify-center">
                        <div className="text-gray-600 font-semibold">Carregando cômodos...</div>
                    </main>
                </div>
            </div>
        );
    }

    return (
        <div className="h-svh flex flex-col overflow-hidden">
            <MenuInicial />
            <div className="flex flex-1 overflow-hidden">
                <BarraLateral onLogout={onLogout} />
                <main className="w-full overflow-y-auto px-10 py-8">

                    {erros.geral && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                            {erros.geral}
                        </div>
                    )}

                    {/* Seção: Informações do Material */}
                    <section className="mb-10">
                        <p className="text-sm text-(--laranja-principal) font-semibold mb-1">Novo Material</p>
                        <h3 className="page-title mb-6">Informações do Material</h3>

                        {/* Nome Material */}
                        <div className="flex gap-4 mb-4">
                            <div className="flex flex-col gap-1 flex-[2]">
                                <label className="text-sm font-medium text-gray-700">
                                    Nome do Material<span className="text-red-500">*</span>
                                </label>
                                <input
                                    name="nomeMaterial"
                                    value={form.nomeMaterial}
                                    onChange={handleField}
                                    placeholder="Ex: Porcelanato Carrara 60×60"
                                    className={`border rounded px-3 h-10 text-sm focus:outline-none ${
                                        erros.nomeMaterial ? 'border-red-500' : 'border-gray-300 focus:border-gray-400'
                                    }`}
                                />
                                {erros.nomeMaterial && (
                                    <span className="text-xs text-red-500">{erros.nomeMaterial}</span>
                                )}
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

                        {/* Marca, Tamanho, Tipo, Cor */}
                        <div className="flex gap-4 mb-4">
                            {[
                                { name: "marca",         label: "Marca",   placeholder: "Ex: Portobello" },
                                { name: "tamanho",       label: "Tamanho", placeholder: "Ex: 60×60cm"    },
                                { name: "tipoMaterial",  label: "Tipo",    placeholder: "Ex: Polido"     },
                                { name: "cor",           label: "Cor",     placeholder: "Ex: Branco Marmore" },
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
                                name="descricaoMaterial"
                                value={form.descricaoMaterial}
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
                        {erros.area && <p className="text-xs text-red-500 mb-2">{erros.area}</p>}
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
                        {erros.comodos && <p className="text-xs text-red-500 mb-2">{erros.comodos}</p>}

                        <div className="flex flex-col gap-1 mb-5 w-48">
                            <label className="text-sm font-medium text-gray-700">Andar</label>
                            <select
                                value={andarSelecionado || ''}
                                onChange={(e) => handleAndar(parseInt(e.target.value))}
                                className="border border-gray-300 rounded px-3 h-10 text-sm bg-white focus:outline-none focus:border-gray-400"
                            >
                                {andares.map((a) => (
                                    <option key={a.id} value={a.id}>{a.nome}</option>
                                ))}
                            </select>
                        </div>

                        {comodos.length > 0 ? (
                            <div className="grid grid-cols-4 gap-x-6 gap-y-3">
                                {comodos.map((comodo) => {
                                    const marcado = comodosSelecionados.some(
                                        (c) => c.idComodo === comodo.id && c.idAndar === andarSelecionado
                                    );
                                    return (
                                        <label
                                            key={comodo.id}
                                            className="flex items-center gap-2 cursor-pointer text-sm text-gray-700 select-none"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={marcado}
                                                onChange={() => toggleComodo(comodo.id, andarSelecionado)}
                                                className="w-4 h-4 accent-(--laranja-principal) cursor-pointer"
                                            />
                                            {comodo.nome}
                                        </label>
                                    );
                                })}
                            </div>
                        ) : (
                            <p className="text-gray-500">Nenhum cômodo neste andar</p>
                        )}
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
                            disabled={enviando}
                            className="px-6 h-10 rounded-sm text-sm font-semibold text-white bg-(--laranja-principal) border-2 border-(--laranja-principal) hover:opacity-90 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            {enviando ? 'Salvando...' : 'Adicionar'}
                        </button>
                    </div>

                </main>
            </div>
        </div>
    );
}

export default AdicionarMaterial;