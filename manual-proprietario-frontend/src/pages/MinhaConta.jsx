import { useState } from 'react';
import BarraLateral from "../components/BarraLateral";
import MenuInicial from "../components/MenuInicial";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

function CampoSenha({ label, name, value, onChange, placeholder }) {
    const [visivel, setVisivel] = useState(false);
    return (
        <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">{label}</label>
            <div className="relative">
                <input
                    type={visivel ? "text" : "password"}
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className="w-full border border-gray-300 rounded px-3 pr-10 h-10 text-sm focus:outline-none focus:border-gray-400"
                />
                <button
                    type="button"
                    onClick={() => setVisivel((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
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

function MinhaConta({ onLogout }) {
    const [dadosPessoais, setDadosPessoais] = useState({
        nome:  "Gabriel Ribeiro de Sousa",
        email: "gabrsousa@gmail.com",
        crea:  "1234567",
        cpf:   "000.000.000-00",
    });

    const [senha, setSenha] = useState({
        senhaAtual:     "",
        novaSenha:      "",
        confirmarSenha: "",
    });

    const handleDados = (e) => {
        setDadosPessoais((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSenha = (e) => {
        setSenha((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleEditarDados = () => {
        // integrar com serviço real
        console.log("Salvar dados pessoais:", dadosPessoais);
    };

    const handleSalvarSenha = () => {
        // integrar com serviço real
        console.log("Salvar senha:", senha);
    };

    return (
        <div className="h-svh flex flex-col overflow-hidden">
            <MenuInicial titulo="Minha Conta" />
            <div className="flex flex-1 overflow-hidden">
                <BarraLateral onLogout={onLogout} />
                <main className="w-full overflow-y-auto px-10 py-8">
                    <div className="flex gap-6 items-start">

                        {/* Card: Dados Pessoais */}
                        <div className="flex-1 bg-white border border-gray-200 rounded-lg px-8 py-7 shadow-sm">
                            <p className="text-sm text-(--laranja-principal) font-semibold mb-1">Informações da Conta</p>
                            <h3 className="page-title mb-6">Dados Pessoais</h3>

                            <div className="flex flex-col gap-4">
                                <div className="flex flex-col gap-1">
                                    <label className="text-sm font-medium text-gray-700">Nome completo</label>
                                    <input
                                        name="nome"
                                        value={dadosPessoais.nome}
                                        onChange={handleDados}
                                        placeholder="Nome completo"
                                        className="border border-gray-300 rounded px-3 h-10 text-sm focus:outline-none focus:border-gray-400"
                                    />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-sm font-medium text-gray-700">E-mail</label>
                                    <input
                                        name="email"
                                        value={dadosPessoais.email}
                                        onChange={handleDados}
                                        placeholder="E-mail"
                                        className="border border-gray-300 rounded px-3 h-10 text-sm focus:outline-none focus:border-gray-400"
                                    />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-sm font-medium text-gray-700">CREA</label>
                                    <input
                                        name="crea"
                                        value={dadosPessoais.crea}
                                        onChange={handleDados}
                                        placeholder="CREA"
                                        className="border border-gray-300 rounded px-3 h-10 text-sm focus:outline-none focus:border-gray-400"
                                    />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-sm font-medium text-gray-700">CPF</label>
                                    <input
                                        name="cpf"
                                        value={dadosPessoais.cpf}
                                        onChange={handleDados}
                                        placeholder="000.000.000-00"
                                        className="border border-gray-300 rounded px-3 h-10 text-sm focus:outline-none focus:border-gray-400"
                                    />
                                </div>
                            </div>

                            <button
                                onClick={handleEditarDados}
                                className="mt-6 w-full h-11 rounded text-white text-sm font-semibold bg-(--laranja-principal) hover:opacity-90 transition-all"
                            >
                                Editar alterações
                            </button>
                        </div>

                        {/* Card: Senha */}
                        <div className="flex-1 bg-white border border-gray-200 rounded-lg px-8 py-7 shadow-sm">
                            <p className="text-sm text-(--laranja-principal) font-semibold mb-1">Informações da Conta</p>
                            <h3 className="page-title mb-6">Senha</h3>

                            <div className="flex flex-col gap-4">
                                <CampoSenha
                                    label="Senha atual"
                                    name="senhaAtual"
                                    value={senha.senhaAtual}
                                    onChange={handleSenha}
                                    placeholder="Senha atual"
                                />
                                <CampoSenha
                                    label="Nova senha"
                                    name="novaSenha"
                                    value={senha.novaSenha}
                                    onChange={handleSenha}
                                    placeholder="Nova senha"
                                />
                                <CampoSenha
                                    label="Confirme nova senha"
                                    name="confirmarSenha"
                                    value={senha.confirmarSenha}
                                    onChange={handleSenha}
                                    placeholder="Confirme nova senha"
                                />
                            </div>

                            <button
                                onClick={handleSalvarSenha}
                                disabled={!senha.senhaAtual || !senha.novaSenha || !senha.confirmarSenha}
                                className="mt-6 w-full h-11 rounded text-white text-sm font-semibold bg-(--laranja-principal) hover:opacity-90 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                Salvar senha
                            </button>
                        </div>

                    </div>
                </main>
            </div>
        </div>
    );
}

export default MinhaConta;