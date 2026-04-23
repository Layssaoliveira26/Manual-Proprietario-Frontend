import { useState } from "react";
import login from "../services/authService";
import { useNavigate, Link } from "react-router-dom";
import { ValidateStrongPassword, ValidatePasswordMatch} from "../utils/validations";

function RedefinirSenha() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const navigate = useNavigate();

    const handleReset = async () => {
        setErrorMessage("");

        const erroSenha = ValidateStrongPassword(password);
        if (erroSenha) return setErrorMessage(erroSenha);
        const erroMatch = ValidatePasswordMatch(password, confirmPassword);
        if (erroMatch) return setErrorMessage(erroMatch);

        try {
            alert("Senha alterada com sucesso!");
            navigate("/login");
        }
        catch (error) {
            setErrorMessage("Erro ao redefinir senha.");
        }
    }
    return (
        <div className="flex min-h-screen w-full items-center justify-center py-6">
            <div className="form-login pb-6 px-10 rounded-xl shadow-xl">

                <div className="flex justify-end mb-4">
                    <img src="/src/assets/svg/detalhe-form.svg" alt="" />
                </div>

                <div className="flex flex-col items-center mb-5">
                    {errorMessage && (
                        <p className="text-red-500 text-sm mb-4 font-bold bg-red-50 p-2 rounded border border-red-200 text-center w-full">
                            {errorMessage}
                        </p>
                    )}
                    <img src="/src/assets/svg/logo-portal.svg" alt="" />
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

                <div className="flex justify-start mt-4">
                    <img src="/src/assets/svg/detalhe-form.svg" alt="" />
                </div>

            </div>
        </div>
    );
}

export default RedefinirSenha;