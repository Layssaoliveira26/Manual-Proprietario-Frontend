import api from "./api";

async function cadastrarProprietario({ nome, email, cpf, senha, confirmSenha}) {

    const response = await api.post("/api/cadastro-construtor", {
        nome,
        email,
        cpf,
        senha, 
        confirmSenha,
    })

    return response.data;

}

export default cadastrarProprietario