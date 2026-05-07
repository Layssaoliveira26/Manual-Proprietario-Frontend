import { useState } from "react";
import login from "../services/authService";
import { ValidateLoginFields } from "../utils/validations";
import { useNavigate, Link } from "react-router-dom";

function Login({ onLogin }) {
    const [role, setRole] = useState("proprietario");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [crea, setCrea] = useState(""); 
    const [errorMessage, setErrorMessage] = useState("");

    const navigate = useNavigate();

    const logar = async () => {
    setErrorMessage("");

    const erro = ValidateLoginFields(email, password);
    if (erro) {
        setErrorMessage(erro);
        return;
    }

    try {
        // Criar o profile e o payload ANTES de chamar o login
        const profileEnviado = role.toUpperCase(); 
        const payload = {
            email: email.trim().toLowerCase(),
            password: password,
            profile: profileEnviado
        };

        if (profileEnviado === "CONSTRUTOR") {
            payload.crea = crea;
        }

        console.log(">>> Enviando dados para o Back:", payload);

        // Uma única chamada ao serviço
        const response = await login(payload);
        console.log(">>> Resposta completa do Back:", response);

        const token = response.data?.token || response.token;

        if (token) {
            localStorage.setItem("token", token);
            console.log(">>> Sucesso! Token salvo no LocalStorage.");

            if (onLogin) {
                onLogin({ email, role: profileEnviado }); 
            }
            
            // Navega para /CONSTRUTOR ou /PROPRIETARIO
            navigate(`/${profileEnviado}`);
        } else {
            console.error(">>> Token não encontrado. Chaves disponíveis:", 
                response.data ? Object.keys(response.data) : "Objeto data vazio");
            setErrorMessage("Erro: Estrutura de resposta inválida.");
        }

    } catch (error) {
        const mensagemDoBack = error.response?.data?.message || "Erro ao conectar com o servidor.";
        setErrorMessage(mensagemDoBack);
        console.error("Erro detalhado:", error.response?.data || error.message);
    }
};
    return (
        <div className="flex min-h-screen w-full items-center justify-center py-6">
            <div className="form-login pb-6 px-10 rounded-xl shadow-xl">

                <div className="flex justify-end mb-4">
                    <img src="/src/assets/svg/detalhe-form.svg" alt="" />
                </div>

                <div className="flex flex-col items-center mb-5">
                    <img src="/src/assets/svg/logo-portal.svg" alt="" />
                    <h3 className="text-2xl font-semibold text-[var(--laranja-principal)]">
                        Manual do Proprietário
                    </h3>
                </div>

                <div className="flex bg-[var(--cor-form)] p-1 justify-center rounded-sm">
                    <button 
                        className={`py-2 px-8 rounded-sm font-medium transition ${
                            role === "proprietario"
                                ? "btn-laranja text-white"
                                : "btn-branco text-[var(--laranja-principal)]"
                        }`}
                        onClick={() => setRole("proprietario")}
                        type="button"
                    >
                        Proprietário
                    </button>

                    <button 
                        className={`py-2 px-8 rounded-sm ml-1 font-medium transition ${
                            role === "construtor"
                                ? "btn-laranja text-white"
                                : "btn-branco text-[var(--laranja-principal)]"
                        }`}
                        onClick={() => setRole("construtor")}
                        type="button"
                    >
                        Construtor
                    </button>
                </div>

                <div className="flex flex-col items-center mt-5">

                    {/* Exibição da mensagem de erro da Layssa */}
                    {errorMessage && (
                        <p className="text-red-500 text-sm mb-4 font-bold text-center">
                            {errorMessage}
                        </p>
                    )}

                    <input 
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="padrao"
                    />

                    {role === "construtor" && (
                        <input 
                            type="text"
                            placeholder="Número do CREA"
                            value={crea}
                            onChange={(e) => setCrea(e.target.value)}
                            maxLength={11}
                            className="padrao"
                        />
                    )}

                    <input 
                        type="password"
                        placeholder="Senha"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="padrao"
                    />

                    <button 
                        type="button"
                        className="btn-telas-iniciais mt-2"
                        onClick={logar}
                    >
                        Entrar
                    </button>
                </div>

                <div className="mt-6 text-center">
                    <Link 
                        to="/esqueci-senha" 
                        className="block text-[var(--laranja-principal)] mb-2 cursor-pointer hover:underline"
                    >
                        Esqueceu a senha?
                    </Link>

                    <p className="text-gray-400">
                        Ainda não tem conta?{" "}
                        <Link 
                            to={
                                role === "proprietario"
                                    ? "/cadastro-proprietario"
                                    : "/cadastro-construtor"
                            }
                            className="text-[var(--laranja-principal)]"
                        >
                            Cadastre-se
                        </Link>
                    </p>
                </div>

                <div className="flex justify-start mt-4">
                    <img src="/src/assets/svg/detalhe-form.svg" alt="" />
                </div>
            </div>
        </div>
    );
}

export default Login;