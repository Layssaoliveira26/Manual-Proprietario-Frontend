export const ValidateLoginFields = (email, password) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !password) {
        return "Campo ausente ou inválido";
    }
    if(!emailRegex.test(email)) {
        return "Email inválido ou sem formato padrão"
    }

    return null;
}

export const ValidateFullName = (name) => {
    if(!name) {
        return "O campo nome é obrigatório";
    }
    const parts = name.trim().split(" ");
    if(parts.length < 2) {
        return "O sistema exige no mínimo nome e sobrenome."
    }
}

export const ValidateCPF = (cpf) => {
    if (!cpf) {
        return "O CPF é obrigatório."
    }
    const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
    if(!cpfRegex.test(cpf)) {
        return "CPF inválido ou sem máscara (000.000.000-00)."
    }
    return "";
}

export const ValidateCREA = (crea, role) => {
    if (role === "proprietario" && !crea) {
        return "O sistema detecta que a obrigatoriedade não foi atendida."
    }
    return "";
}

export const ValidateStrongPassword = (password) => {
    if (!password) {
        return "A senha é obrigatória"
    }
    const hasMinLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const hasSequence = /123|abc|012/.test(password);

    if(!hasMinLength || !hasUpperCase || !hasLowerCase || !hasSymbol) {
        return "A senha deve ter 8+ dígitos, maiúscula, minúscula e símbolo."
    }
    if(hasSequence) {
        return "A senha não pode conter sequências óbvias"
    }
    return "";
}

export const ValidatePasswordMatch = (password, confirmation) => {
    if (password !== confirmation) {
        return "A confirmação da Nova Senha não confere."
    }
    return "";
}
