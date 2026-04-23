import { useState } from "react";
import detalhe from "../assets/svg/detalhe-form.svg";
import logo from "../assets/svg/logo-portal.svg";
import { useNavigate, Link } from "react-router-dom";
import cadastrarConstrutor from "../services/cadConstrutor";
import {ValidateFullName, ValidateLoginFields, ValidateCPF, ValidateCREA, ValidateStrongPassword, ValidatePasswordMatch } from "../utils/validations";
import { maskCPF } from "../utils/masks";

function CadastroConstrutor() {
    const [ nome, setNome ] = useState("");
    const [ email, setEmail ] = useState("");
    const [ cpf, setCpf ] = useState("");
    const [ crea, setCrea ] = useState("");
    const [ senha, setSenha ] = useState("");
    const [ confirmSenha, setConfirmSenha ] = useState("");
    const [ errorMessage, setErrorMessage] = useState("");

    const navigate = useNavigate();

    const cadastrarConst = async () => {
        setErrorMessage("");
        
        // Validações locais (Layssa)
        const erroNome = ValidateFullName(nome);
        if (erroNome) return setErrorMessage(erroNome);
        
        const erroEmail = ValidateLoginFields(email, "placeholder");
        if (erroEmail && erroEmail.includes("Email")) return setErrorMessage(erroEmail);
        
        const erroCpf = ValidateCPF(cpf);
        if (erroCpf) return setErrorMessage(erroCpf);
        
        const erroCrea = ValidateCREA(crea, "construtor");
        if (erroCrea) return setErrorMessage(erroCrea);
        
        const erroSenha = ValidateStrongPassword(senha);
        if (erroSenha) return setErrorMessage(erroSenha);
        
        const erroMatch = ValidatePasswordMatch(senha, confirmSenha);
        if (erroMatch) return setErrorMessage(erroMatch);

        try {
            const payload = {
                name: nome,
                email: email,
                cpf: cpf.replace(/\D/g, ""), // Limpa pontos e traços para o back-end
                crea: crea,
                password: senha,
                confirmPassword: confirmSenha,
                profile: "CONSTRUTOR"
            };

            await cadastrarConstrutor(payload);
            alert("Construtor cadastrado com sucesso!");
            navigate("/login");
        } catch(error) {
            // Unindo os mundos: Pega a mensagem real do erro do back e joga no box de erro da tela
            const mensagemErro = error.response?.data?.message || "Erro ao realizar cadastro no servidor.";
            setErrorMessage(mensagemErro);
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
                    {errorMessage && (
                        <p className="text-red-500 text-sm mb-4 font-bold bg-red-50 p-2 rounded border border-red-200 text-center w-full">
                            {errorMessage}
                        </p>
                    )}
                    <img src={logo} alt="" className="mb-2" />
                    <h3 className="text-2xl font-semibold text-[var(--laranja-principal)]">
                        Manual do Proprietário
                    </h3>
                </div>

                <div className="campos-form">
                    <input type="text" placeholder="Nome Completo" value={nome} onChange={ e => setNome(e.target.value)}/>
                    <input type="email" placeholder="Email" value={email} onChange={ e => setEmail(e.target.value)}/>
                    
                    {/* Input com máscara de CPF */}
                    <input 
                        type="text" 
                        placeholder="Número do CPF" 
                        value={cpf} 
                        onChange={(e) => setCpf(maskCPF(e.target.value))}
                    />
                    
                    <input type="text" placeholder="Número do CREA" value={crea} onChange={ e => setCrea(e.target.value)}/>
                    <input type="password" placeholder="Senha" value={senha} onChange={ e => setSenha(e.target.value)}/>
                    <input type="password" placeholder="Confirmar senha" value={confirmSenha} onChange={ e => setConfirmSenha(e.target.value)}/>

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