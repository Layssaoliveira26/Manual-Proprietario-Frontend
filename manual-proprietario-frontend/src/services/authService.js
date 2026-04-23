import api from "./api";

async function login({ email, password, role, crea }) {

    const response = await api.post("/api/login", {
        email,
        password,
        role,
        crea
    })

    return response.data;
}

export default login