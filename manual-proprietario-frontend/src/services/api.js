import axios from "axios"

//Criação de uma instância do axios com configurações padrões 
//que serão utilizadas por multiplas requisições
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
});

//Definindo o interceptor(função que, nesse caso, executa antes da requisição sair)
//de modo que complementa o config(objeto com todas as configurações da requisição)
//incluindo na parte de headers a Authorization
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        return config;
    }
})

//Definindo o interceptor(função que, nesse caso, executa depois da resposta chegar)
//caso seja resposta, devolve ela.  Caso seja erro, analisa se é código 401
//caso sim, limpa o token e volta pro login
//e no continua retornando erro
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if(error.response?.status === 401) {
            localStorage.removeItem('token');
            window.location.href('/login');
        }
        return Promise.reject(error);
    }
);

export default api;
