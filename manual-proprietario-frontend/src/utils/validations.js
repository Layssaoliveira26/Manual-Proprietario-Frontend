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
/* Valida se um campo obrigatório foi preenchido. */
export const ValidateRequired = (value, fieldName) => {
    if (!value || (typeof value === 'string' && value.trim() === "")) {
        return `O campo ${fieldName} é obrigatório.`;
    }
    return "";
};

/* Valida a lógica das datas do projeto. */
export const ValidateProjectDates = (dataInicio, dataConclusao) => {
    if (!dataInicio) {
        return "A data de início é obrigatória.";
    }

    if (dataInicio && dataConclusao) {
        const inicio = new Date(dataInicio);
        const conclusao = new Date(dataConclusao);

        if (conclusao < inicio) {
            return "A conclusão estimada não pode ser anterior ao início.";
        }
    }
    return "";
};

/* Valida o número do ART */
export const ValidateART = (art) => {
    if (!art) {
        return "O número do ART é obrigatório.";
    }
    // Regex para garantir que o ART tenha apenas números (ajuste se seu ART tiver letras)
    const artRegex = /^\d+$/;
    if (!artRegex.test(art)) {
        return "O ART deve conter apenas algarismos numéricos.";
    }
    return "";
};

/* Campo com no mínimo 3 caractere */
export const ValidateMinLength = (value, min, fieldName) => {
    if (value && value.trim().length < min) {
        return `O campo ${fieldName} deve ter no mínimo ${min} caracteres.`;
    }
    return "";
};

/* Valida se o arquivo foi enviado */
export const ValidateFileRequired = (file, fieldName) => {
    if (!file) {
        return `O arquivo de ${fieldName} é obrigatório.`;
    }
    return "";
};

/* Valida a extensão do arquivo */
export const ValidateFileType = (file, allowedExtensions = ['pdf', 'jpg', 'png', 'dwg']) => {
    if (!file) return "";
    const extension = file.name.split('.').pop().toLowerCase();
    if (!allowedExtensions.includes(extension)) {
        return `Formato inválido (${extension}). Use: ${allowedExtensions.join(', ')}`;
    }
    return "";
};

/* Valida o tamanho do arquivo */
export const ValidateFileSize = (file, maxSizeMB = 5) => {
    if (!file) return "";
    const sizeInMB = file.size / (1024 * 1024);
    if (sizeInMB > maxSizeMB) {
        return `O arquivo deve ser menor que ${maxSizeMB}MB.`;
    }
    return "";
};

/* Compara se a data escolhida é maior (está no futuro) em relação a hoje e verifica a obrigatoriedade */
export const ValidatePastOrTodayDate = (dateString) => {
    if (!dateString) {
        return "A data é obrigatória.";
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [ano, mes, dia] = dateString.split('-');
    const selectedDate = new Date(ano, mes - 1, dia);
    selectedDate.setHours(0, 0, 0, 0);

    if (selectedDate > today) {
        return "A alteração não pode ter uma data futura.";
    }
    return "";
};