import api from "./api";

async function login(payload) {
    
    const response = await api.post("/auth/login", payload);
    return response.data;
}

export default login;