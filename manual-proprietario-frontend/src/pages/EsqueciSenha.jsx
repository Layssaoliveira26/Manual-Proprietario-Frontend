import { useState } from "react";
import { requestPasswordReset } from "../services/forgotPasswordService";
import detalhe from "../assets/svg/detalhe-form.svg";
import logo from "../assets/svg/logo-portal.svg";

function EsqueciSenha() {
    const [email, setEmail] = useState("");

    const handleRequest = async () => {
        try {
            const response = await requestPasswordReset(email);
            // Mesmo que o e-mail não exista, o back-end manda a mensagem de sucesso por segurança
            alert(response.message || "Se o e-mail estiver cadastrado, você receberá um link.");
        } catch (error) {
            alert("Erro ao processar solicitação.");
        }
    };

    return (
        <div className="flex min-h-screen w-full items-center justify-center py-6">
            <div className="form-login pb-6 px-10 rounded-xl shadow-xl">
                <div className="flex justify-end mb-4"><img src={detalhe} alt="" /></div>
                <div className="flex flex-col items-center mb-5">
                    <img src={logo} alt="" />
                    <h3 className="text-2xl font-semibold text-[var(--laranja-principal)]">Recuperar Acesso</h3>
                </div>

                <div className="flex flex-col items-center mt-5">
                    <p className="text-sm text-gray-500 mb-4 text-center">Digite seu e-mail para receber o link de recuperação.</p>
                    <input 
                        type="email" 
                        placeholder="Seu e-mail cadastrado" 
                        onChange={(e) => setEmail(e.target.value)} 
                    />
                    <button type="button" className="btn-telas-iniciais mt-2" onClick={handleRequest}>
                        Enviar Link
                    </button>
                </div>
                <div className="flex justify-start mt-4"><img src={detalhe} alt="" /></div>
            </div>
        </div>
    );
}

export default EsqueciSenha;