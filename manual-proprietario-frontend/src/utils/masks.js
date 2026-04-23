export const maskCPF = (value) => {
    //tira o que é numero e limita a 11 dígitos
    let numericValue = value.replace(/\D/g, "").slice(0, 11); 

    //formatação
    return numericValue
        .replace(/(\d{3})(\d)/, "$1.$2") // Coloca o primeiro ponto
        .replace(/(\d{3})(\d)/, "$1.$2") // Coloca o segundo ponto
        .replace(/(\d{3})(\d{1,2})$/, "$1-$2"); // Coloca o traço
};