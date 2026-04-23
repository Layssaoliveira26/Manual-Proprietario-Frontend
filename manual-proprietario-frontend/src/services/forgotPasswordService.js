import api from "./api";

// 1. Para solicitar o link (Tela de Esqueci Senha)
export const requestPasswordReset = async (email) => {
    const response = await api.post("/auth/forgot-password", { email });
    return response.data;
};

// 2. Para cadastrar a nova senha (Tela de Redefinir Senha)
export const resetPassword = async (token, password, confirmPassword) => {
    const response = await api.post("/auth/reset-password", { 
        token, 
        password, 
        confirmPassword 
    });
    return response.data;
};