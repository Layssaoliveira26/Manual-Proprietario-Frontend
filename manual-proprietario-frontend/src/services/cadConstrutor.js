import api from "./api";

async function cadastrarConstrutor(payload) {
    // Apontando para a rota correta do back-end
    const response = await api.post("/users", payload);
    return response.data;
}

export default cadastrarConstrutor;