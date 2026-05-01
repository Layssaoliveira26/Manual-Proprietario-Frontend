import api from "./api";

async function cadastrarProprietario(payload) {

    const response = await api.post("/users", payload);

    return response.data;
}

export default cadastrarProprietario;