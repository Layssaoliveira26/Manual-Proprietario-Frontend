import api from "./api";

async function login(payload) {
    // Apontando para a rota de login que você criou no back-end
    const response = await api.post("/auth/login", payload);
    return response.data;
}

export default login;