import api from "./api";

async function cadastrarProprietario({ nome, email, crea, senha, confirmSenha}) {

    const response = await api.post("/api/cadastro-construtor", {
        nome,
        email,
        crea,
        senha, 
        confirmSenha,
    })

    return response.data;

}

export default cadastrarProprietario