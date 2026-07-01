import { useState, useEffect } from 'react';
import BarraLateral from '../components/BarraLateral';
import MenuInicial from '../components/MenuInicial';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { getProfile, updateProfile, changePassword } from '../services/authService';

// ---------------------------------------------------------------------------
// Sub-componente: campo de senha com toggle de visibilidade
// ---------------------------------------------------------------------------
function CampoSenha({ label, name, value, onChange, placeholder, disabled }) {
    const [visivel, setVisivel] = useState(false);
    return (
        <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">{label}</label>
            <div className="relative">
                <input
                    type={visivel ? 'text' : 'password'}
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    disabled={disabled}
                    className="w-full border border-gray-300 rounded px-3 pr-10 h-10 text-sm focus:outline-none focus:border-gray-400 disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed"
                />
                <button
                    type="button"
                    onClick={() => setVisivel((v) => !v)}
                    disabled={disabled}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-40"
                >
                    {visivel
                        ? <AiOutlineEyeInvisible className="w-5 h-5" />
                        : <AiOutlineEye className="w-5 h-5" />
                    }
                </button>
            </div>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Sub-componente: banner de feedback (sucesso ou erro)
// ---------------------------------------------------------------------------
function Feedback({ tipo, mensagem }) {
    if (!mensagem) return null;
    const estilos = tipo === 'sucesso'
        ? 'bg-green-50 border border-green-200 text-green-700'
        : 'bg-red-50 border border-red-200 text-red-700';
    return (
        <p className={`mt-4 px-4 py-2.5 rounded text-sm font-medium ${estilos}`}>
            {mensagem}
        </p>
    );
}

// ---------------------------------------------------------------------------
// Componente principal
// ---------------------------------------------------------------------------
function MinhaConta({ onLogout }) {

    // --- perfil carregado da API ---
    const [perfil,          setPerfil]         = useState(null);
    const [carregandoPerfil, setCarregandoPerfil] = useState(true);
    const [erroPerfil,      setErroPerfil]     = useState(null);

    // --- formulário de dados pessoais ---
    const [dados,        setDados]        = useState({ nome: '', email: '', crea: '' });
    const [salvandoDados, setSalvandoDados] = useState(false);
    const [feedbackDados, setFeedbackDados] = useState({ tipo: '', msg: '' });

    // --- formulário de senha ---
    const [senha,        setSenha]        = useState({ senhaAtual: '', novaSenha: '', confirmarSenha: '' });
    const [salvandoSenha, setSalvandoSenha] = useState(false);
    const [feedbackSenha, setFeedbackSenha] = useState({ tipo: '', msg: '' });

    // -----------------------------------------------------------------------
    // Fetch inicial do perfil
    // -----------------------------------------------------------------------
    useEffect(() => {
        let ativo = true;

        const fetchPerfil = async () => {
            try {
                setCarregandoPerfil(true);
                setErroPerfil(null);

                const user = await getProfile();

                if (!ativo) return;

                setPerfil(user);
                // Pré-preenche o formulário com os dados reais
                setDados({
                    nome:  user.nome  ?? '',
                    email: user.email ?? '',
                    crea:  user.crea  ?? '',
                });
            } catch (err) {
                if (!ativo) return;
                console.error('[MinhaConta] Erro ao buscar perfil:', err);
                setErroPerfil('Não foi possível carregar os dados do perfil.');
            } finally {
                if (ativo) setCarregandoPerfil(false);
            }
        };

        fetchPerfil();
        return () => { ativo = false; };
    }, []);

    // -----------------------------------------------------------------------
    // Handlers de formulário
    // -----------------------------------------------------------------------
    const handleDados = (e) =>
        setDados((prev) => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSenha = (e) =>
        setSenha((prev) => ({ ...prev, [e.target.name]: e.target.value }));

    // -----------------------------------------------------------------------
    // Salvar dados pessoais — PATCH /users/me/profile
    // -----------------------------------------------------------------------
    const handleSalvarDados = async () => {
        setSalvandoDados(true);
        setFeedbackDados({ tipo: '', msg: '' });

        try {
            // Monta payload apenas com os campos que o back-end aceita
            const payload = { nome: dados.nome, email: dados.email };
            // crea: só envia se o perfil for CONSTRUTOR (back-end ignora para PROPRIETARIO,
            // mas omitir evita tráfego desnecessário)
            if (perfil?.profile === 'CONSTRUTOR') {
                payload.crea = dados.crea;
            }

            const userAtualizado = await updateProfile(payload);

            // Atualiza o estado local com os dados confirmados pela API
            if (userAtualizado) {
                setPerfil((prev) => ({ ...prev, ...userAtualizado }));
                setDados((prev) => ({
                    ...prev,
                    nome:  userAtualizado.nome  ?? prev.nome,
                    email: userAtualizado.email ?? prev.email,
                    crea:  userAtualizado.crea  ?? prev.crea,
                }));
            }

            setFeedbackDados({ tipo: 'sucesso', msg: 'Dados atualizados com sucesso!' });
        } catch (err) {
            const msg = err.response?.data?.message ?? 'Erro ao salvar. Tente novamente.';
            setFeedbackDados({ tipo: 'erro', msg });
        } finally {
            setSalvandoDados(false);
        }
    };

    // -----------------------------------------------------------------------
    // Alterar senha — PATCH /users/me/password
    // -----------------------------------------------------------------------
    const handleSalvarSenha = async () => {
        setFeedbackSenha({ tipo: '', msg: '' });

        // Validação local: confirmar senha
        if (senha.novaSenha !== senha.confirmarSenha) {
            setFeedbackSenha({ tipo: 'erro', msg: 'A nova senha e a confirmação não coincidem.' });
            return;
        }

        setSalvandoSenha(true);
        try {
            await changePassword({
                senhaAtual: senha.senhaAtual,
                novaSenha:  senha.novaSenha,
            });

            setFeedbackSenha({ tipo: 'sucesso', msg: 'Senha alterada com sucesso!' });
            // Limpa os campos após sucesso
            setSenha({ senhaAtual: '', novaSenha: '', confirmarSenha: '' });
        } catch (err) {
            const msg = err.response?.data?.message ?? 'Erro ao alterar senha. Verifique a senha atual.';
            setFeedbackSenha({ tipo: 'erro', msg });
        } finally {
            setSalvandoSenha(false);
        }
    };

    const isConstrutor = perfil?.profile === 'CONSTRUTOR';
    const senhaInvalida = !senha.senhaAtual || !senha.novaSenha || !senha.confirmarSenha;

    // -----------------------------------------------------------------------
    // Estado: carregando perfil inicial
    // -----------------------------------------------------------------------
    if (carregandoPerfil) {
        return (
            <div className="h-svh flex flex-col overflow-hidden">
                <MenuInicial titulo="Minha Conta" />
                <div className="flex flex-1 overflow-hidden">
                    <BarraLateral onLogout={onLogout} />
                    <main className="w-full flex items-center justify-center">
                        <p className="text-gray-400 text-sm">Carregando dados do perfil...</p>
                    </main>
                </div>
            </div>
        );
    }

    // -----------------------------------------------------------------------
    // Estado: erro ao carregar perfil
    // -----------------------------------------------------------------------
    if (erroPerfil) {
        return (
            <div className="h-svh flex flex-col overflow-hidden">
                <MenuInicial titulo="Minha Conta" />
                <div className="flex flex-1 overflow-hidden">
                    <BarraLateral onLogout={onLogout} />
                    <main className="w-full flex items-center justify-center">
                        <p className="text-red-500 font-medium text-sm">{erroPerfil}</p>
                    </main>
                </div>
            </div>
        );
    }

    // -----------------------------------------------------------------------
    // Render principal
    // -----------------------------------------------------------------------
    return (
        <div className="h-svh flex flex-col overflow-hidden">
            <MenuInicial titulo="Minha Conta" />
            <div className="flex flex-1 overflow-hidden">
                <BarraLateral onLogout={onLogout} />
                <main className="w-full overflow-y-auto px-10 py-8">
                    <div className="flex gap-6 items-start">

                        {/* ═══════════════════════════════════════════════
                            Card: Dados Pessoais
                        ═══════════════════════════════════════════════ */}
                        <div className="flex-1 bg-white border border-gray-200 rounded-lg px-8 py-7 shadow-sm">
                            <p className="text-sm text-(--laranja-principal) font-semibold mb-1">
                                Informações da Conta
                            </p>
                            <h3 className="page-title mb-6">Dados Pessoais</h3>

                            <div className="flex flex-col gap-4">

                                {/* Nome */}
                                <div className="flex flex-col gap-1">
                                    <label className="text-sm font-medium text-gray-700">
                                        Nome completo
                                    </label>
                                    <input
                                        name="nome"
                                        value={dados.nome}
                                        onChange={handleDados}
                                        placeholder="Nome completo"
                                        className="border border-gray-300 rounded px-3 h-10 text-sm focus:outline-none focus:border-gray-400"
                                    />
                                </div>

                                {/* E-mail */}
                                <div className="flex flex-col gap-1">
                                    <label className="text-sm font-medium text-gray-700">
                                        E-mail
                                    </label>
                                    <input
                                        name="email"
                                        type="email"
                                        value={dados.email}
                                        onChange={handleDados}
                                        placeholder="E-mail"
                                        className="border border-gray-300 rounded px-3 h-10 text-sm focus:outline-none focus:border-gray-400"
                                    />
                                </div>

                                {/* CREA — exclusivo do Construtor */}
                                {isConstrutor && (
                                    <div className="flex flex-col gap-1">
                                        <label className="text-sm font-medium text-gray-700">
                                            CREA
                                        </label>
                                        <input
                                            name="crea"
                                            value={dados.crea}
                                            onChange={handleDados}
                                            placeholder="Ex: CREA-SP 123456/D"
                                            className="border border-gray-300 rounded px-3 h-10 text-sm focus:outline-none focus:border-gray-400"
                                        />
                                    </div>
                                )}

                                {/* CPF — sempre somente leitura (mascarado pelo back-end) */}
                                <div className="flex flex-col gap-1">
                                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                        CPF
                                    </label>
                                    <input
                                        value={perfil?.cpf ?? ''}
                                        readOnly
                                        disabled
                                        className="border border-gray-200 rounded px-3 h-10 text-sm bg-gray-50 text-gray-400 cursor-not-allowed"
                                    />
                                </div>

                                {/* Perfil — informativo */}
                                <div className="flex flex-col gap-1">
                                    <label className="text-sm font-medium text-gray-700">
                                        Perfil
                                    </label>
                                    <input
                                        value={isConstrutor ? 'Construtor' : 'Proprietário'}
                                        readOnly
                                        disabled
                                        className="border border-gray-200 rounded px-3 h-10 text-sm bg-gray-50 text-gray-400 cursor-not-allowed"
                                    />
                                </div>

                            </div>

                            {/* Feedback de dados */}
                            <Feedback tipo={feedbackDados.tipo} mensagem={feedbackDados.msg} />

                            <button
                                onClick={handleSalvarDados}
                                disabled={salvandoDados}
                                className="mt-6 w-full h-11 rounded text-white text-sm font-semibold bg-(--laranja-principal) hover:opacity-90 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {salvandoDados ? 'Salvando...' : 'Salvar alterações'}
                            </button>
                        </div>

                        {/* ═══════════════════════════════════════════════
                            Card: Alterar Senha
                        ═══════════════════════════════════════════════ */}
                        <div className="flex-1 bg-white border border-gray-200 rounded-lg px-8 py-7 shadow-sm">
                            <p className="text-sm text-(--laranja-principal) font-semibold mb-1">
                                Informações da Conta
                            </p>
                            <h3 className="page-title mb-6">Senha</h3>

                            <div className="flex flex-col gap-4">
                                <CampoSenha
                                    label="Senha atual"
                                    name="senhaAtual"
                                    value={senha.senhaAtual}
                                    onChange={handleSenha}
                                    placeholder="Senha atual"
                                    disabled={salvandoSenha}
                                />
                                <CampoSenha
                                    label="Nova senha"
                                    name="novaSenha"
                                    value={senha.novaSenha}
                                    onChange={handleSenha}
                                    placeholder="Nova senha"
                                    disabled={salvandoSenha}
                                />
                                <CampoSenha
                                    label="Confirme nova senha"
                                    name="confirmarSenha"
                                    value={senha.confirmarSenha}
                                    onChange={handleSenha}
                                    placeholder="Confirme nova senha"
                                    disabled={salvandoSenha}
                                />
                            </div>

                            {/* Feedback de senha */}
                            <Feedback tipo={feedbackSenha.tipo} mensagem={feedbackSenha.msg} />

                            <button
                                onClick={handleSalvarSenha}
                                disabled={senhaInvalida || salvandoSenha}
                                className="mt-6 w-full h-11 rounded text-white text-sm font-semibold bg-(--laranja-principal) hover:opacity-90 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                {salvandoSenha ? 'Salvando...' : 'Salvar senha'}
                            </button>
                        </div>

                    </div>
                </main>
            </div>
        </div>
    );
}

export default MinhaConta;