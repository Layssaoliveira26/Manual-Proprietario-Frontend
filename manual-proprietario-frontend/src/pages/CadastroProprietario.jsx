import detalhe from "../assets/svg/detalhe-form.svg";
import logo from "../assets/svg/logo-portal.svg";

function CadastroProprietario() {
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
                    <input type="text" placeholder="Nome Completo" />
                    <input type="email" placeholder="Email" />
                    <input type="text" placeholder="Número do CREA" />
                    <input type="password" placeholder="Senha" />
                    <input type="password" placeholder="Confirmar senha" />

                    <button type="submit" className="btn-telas-iniciais">
                        Cadastrar
                    </button>
                </div>

                <div className="extra-form mt-3 text-center">
                    <p className="text-gray-400">
                        Já possui conta?{" "}
                        <span className="text-[var(--laranja-principal)] cursor-pointer">
                            Login
                        </span>
                    </p>
                </div>

                <div className="flex justify-start mt-4">
                    <img src={detalhe} alt="" />
                </div>

            </div>
        </div>
    );
}

export default CadastroProprietario;