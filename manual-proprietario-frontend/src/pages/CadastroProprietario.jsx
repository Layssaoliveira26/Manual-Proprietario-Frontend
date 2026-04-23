import { useState } from "react";
import detalhe from "../assets/svg/detalhe-form.svg";
import logo from "../assets/svg/logo-portal.svg";
import { useNavigate } from "react-router-dom";
import cadastrarProprietario from "../services/cadProprietario";

function CadastroProprietario() {

    const [ nome, setNome ] = useState("");
    const [ email, setEmail ] = useState("");
    const [ cpf, setCpf ] = useState("");
    const [ senha, setSenha ] = useState("");
    const [ confirmSenha, setConfirmSenha ] = useState("");
    const navigate = useNavigate();

    const cadastrarProp = async () => {
        try {
            const data = await cadastrarProprietario({ nome, email, cpf, senha, confirmSenha });

            navigate("/login");
        } catch(error) {
            console.error("Erro no cadastro", error)
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
                    <p>{nome} </p>
                    <input type="email" placeholder="Email" onChange={ e => setEmail(e.target.value)}/>
                    <p>{email} </p>
                    <input type="text" placeholder="Número do CPF" onChange={ e => setCpf(e.target.value)}/>
                    <p>{cpf} </p>
                    <input type="password" placeholder="Senha" onChange={ e => setSenha(e.target.value)}/>
                    <p>{senha} </p>
                    <input type="password" placeholder="Confirmar senha" onChange={ e => setConfirmSenha(e.target.value)}/>
                    <p>{confirmSenha} </p>

                    <button type="submit" className="btn-telas-iniciais" onClick={cadastrarProp}>
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