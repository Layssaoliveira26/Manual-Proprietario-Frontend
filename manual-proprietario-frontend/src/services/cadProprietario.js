import api from "./api";

// Agora ele recebe o 'payload' já formatado da tela
async function cadastrarProprietario(payload) {

    // Mudamos a rota de "/api/cadastro-proprietario" para a oficial do seu back-end: "/users"
    const response = await api.post("/users", payload);

    return response.data;
}

export default cadastrarProprietario;