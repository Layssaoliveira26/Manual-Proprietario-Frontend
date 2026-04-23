import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { resetPassword } from "../services/forgotPasswordService";
import { ValidateStrongPassword, ValidatePasswordMatch } from "../utils/validations";
import detalhe from "../assets/svg/detalhe-form.svg";
import logo from "../assets/svg/logo-portal.svg";

function RedefinirSenha() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    // Pega o token da URL: .../redefinir-senha?token=VALOR
    const token = searchParams.get("token");

    const handleReset = async () => {
        setErrorMessage("");

        // 1. Validações locais (Layssa)
        const erroSenha = ValidateStrongPassword(password);
        if (erroSenha) return setErrorMessage(erroSenha);
        
        const erroMatch = ValidatePasswordMatch(password, confirmPassword);
        if (erroMatch) return setErrorMessage(erroMatch);

        // 2. Verificação do Token
        if (!token) {
            setErrorMessage("Token inválido ou ausente. Solicite um novo e-mail.");
            return;
        }

        try {
            // 3. Chamada para o Back-end (Sua integração)
            await resetPassword(token, password, confirmPassword);
            alert("Senha alterada com sucesso! Faça login agora.");
            navigate("/login");
        } catch (error) {
            const msg = error.response?.data?.message || "Erro ao redefinir senha.";
            setErrorMessage(msg);
        }
    };

    return (
        <div className="flex min-h-screen w-full items-center justify-center py-6">
            <div className="form-login pb-6 px-10 rounded-xl shadow-xl">
                <div className="flex justify-end mb-4"><img src={detalhe} alt="" /></div>
                
                <div className="flex flex-col items-center mb-5">
                    {errorMessage && (
                        <p className="text-red-500 text-sm mb-4 font-bold bg-red-50 p-2 rounded border border-red-200 text-center w-full">
                            {errorMessage}
                        </p>
                    )}
                    <img src={logo} alt="" />
                    <h3 className="text-2xl font-semibold text-[var(--laranja-principal)]">
                        Manual do Proprietário
                    </h3>
                </div>

                <div className="flex flex-col items-center mt-5">
                    <input 
                        type="password" 
                        placeholder="Nova Senha" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)} 
                    />
                    <input 
                        type="password" 
                        placeholder="Confirmar nova senha" 
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)} 
                    />
                    
                    <button 
                        type="button" 
                        className="btn-telas-iniciais mt-2" 
                        onClick={handleReset}
                    >
                        Alterar
                    </button>
                </div>
                <div className="flex justify-start mt-4"><img src={detalhe} alt="" /></div>
            </div>
        </div>
    );
}

export default RedefinirSenha;