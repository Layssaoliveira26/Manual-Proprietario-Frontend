import api from "./api";

async function cadastrarConstrutor({ nome, email, cpf, crea, senha, confirmSenha}) {

    const response = await api.post("/api/cadastro-construtor", {
        nome,
        email,
        cpf,
        crea,
        senha, 
        confirmSenha,
    })

    return response.data;

}

export default cadastrarConstrutor