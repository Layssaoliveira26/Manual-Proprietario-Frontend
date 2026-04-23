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

        // Validação local do Front-end (Layssa)
        const erro = ValidateLoginFields(email, password);
        if (erro) {
            setErrorMessage(erro);
            return;
        }

        try {
            const profile = role.toUpperCase(); 

            const payload = {
                email: email,
                password: password,
                profile: profile
            };

            if (profile === "CONSTRUTOR") {
                payload.crea = crea;
            }

            // Chamada para a sua integração
            const data = await login(payload);

            const token = data.data?.user?.token;
            if (token) {
                localStorage.setItem("token", token);
            }

            if (onLogin) {
                onLogin({ email, role });
            }

            navigate(`/${role}`);
        } catch (error) {
            // Unindo o erro do Back com o estado de erro do Front
            const mensagemDoBack = error.response?.data?.message || "E-mail ou senha inválidos.";
            setErrorMessage(mensagemDoBack);
            console.error("Erro no login:", error);
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
                    />

                    {role === "construtor" && (
                        <input 
                            type="text"
                            placeholder="Número do CREA"
                            value={crea}
                            onChange={(e) => setCrea(e.target.value)}
                        />
                    )}

                    <input 
                        type="password"
                        placeholder="Senha"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
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