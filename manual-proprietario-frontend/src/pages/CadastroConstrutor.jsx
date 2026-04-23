import { useState } from "react";
import detalhe from "../assets/svg/detalhe-form.svg";
import logo from "../assets/svg/logo-portal.svg";
import { useNavigate, Link } from "react-router-dom";
import cadastrarConstrutor from "../services/cadConstrutor";

function CadastroConstrutor() {
    const [ nome, setNome ] = useState("");
    const [ email, setEmail ] = useState("");
    const [ cpf, setCpf ] = useState("");
    const [ crea, setCrea ] = useState("");
    const [ senha, setSenha ] = useState("");
    const [ confirmSenha, setConfirmSenha ] = useState("");
    const navigate = useNavigate();

    const cadastrarConst = async () => {
        try {
            // Traduzindo os dados para o padrão do Back-end
            const payload = {
                name: nome,
                email: email,
                cpf: cpf,
                crea: crea,
                password: senha,
                confirmPassword: confirmSenha,
                profile: "CONSTRUTOR"
            };

            await cadastrarConstrutor(payload);
            navigate("/login");
        } catch(error) {
            // Mostra o erro do back-end na tela (ex: erro do Zod)
            const mensagemErro = error.response?.data?.message || "Erro desconhecido ao cadastrar";
            alert("Erro: " + mensagemErro);
            console.error("Erro no cadastro", error);
        }
    }

    return (
        <div className="flex min-h-screen w-full items-center justify-center py-6">
            <div className="items-start form-login mt-0 pt-0 pb-6 px-10 rounded-xl shadow-xl ">
                <div className="flex justify-end mb-4">
                    <img src={detalhe} alt="" />
                </div>

                <div className="flex flex-col items-center mb-6">
                    <img src={logo} alt="" className="mb-2" />
                    <h3 className="text-2xl font-semibold text-[var(--laranja-principal)]">
                        Manual do Proprietário
                    </h3>
                </div>

                <div className="campos-form">
                    <input type="text" placeholder="Nome Completo" onChange={ e => setNome(e.target.value)}/>
                    <input type="email" placeholder="Email" onChange={ e => setEmail(e.target.value)}/>
                    <input type="text" placeholder="Número do CPF" onChange={ e => setCpf(e.target.value)}/>
                    <input type="text" placeholder="Número do CREA" onChange={ e => setCrea(e.target.value)}/>
                    <input type="password" placeholder="Senha" onChange={ e => setSenha(e.target.value)}/>
                    <input type="password" placeholder="Confirmar senha" onChange={ e => setConfirmSenha(e.target.value)}/>

                    <button type="submit" className="btn-telas-iniciais" onClick={cadastrarConst}>
                        Cadastrar
                    </button>
                </div>

                <div className="extra-form mt-3 text-center">
                    <p className="text-gray-400">
                        Já possui conta?{" "}
                        <Link to="/login" className="text-[var(--laranja-principal)] cursor-pointer">
                            Login
                        </Link>
                    </p>
                </div>

                <div className="flex justify-start mt-4">
                    <img src={detalhe} alt="" />
                </div>
            </div>
        </div>
    );
}

export default CadastroConstrutor;