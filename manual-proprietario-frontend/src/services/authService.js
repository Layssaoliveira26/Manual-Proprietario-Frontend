import api from "./api";

async function login({ email, password, role }) {

    const response = await api.post("/api/login", {
        email,
        password,
        role,
    })

    return response.data;
}

export default login