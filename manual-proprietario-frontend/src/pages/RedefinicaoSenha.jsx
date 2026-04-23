import { useState } from "react";
import login from "../services/authService";
import { useNavigate, Link } from "react-router-dom";

function RedefinirSenha() {
    const [password, setPassword] = useState("");
        const [confirmPassword, setConfirmPassword] = useState("");

    const navigate = useNavigate();

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

                <div className="flex flex-col items-center mt-5">
                    
                    <input 
                        type="password"
                        placeholder="Nova Senha"
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <input 
                        type="password"
                        placeholder="Confirmar nova senha"
                        value={password}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />

                    <button 
                        type="button"
                        className="btn-telas-iniciais mt-2"
                        // onClick={}
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

export default RedefinirSenha