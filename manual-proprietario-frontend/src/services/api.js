import axios from 'axios';

// ---------------------------------------------------------------------------
// Instância base do Axios
// ---------------------------------------------------------------------------
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// ---------------------------------------------------------------------------
// REQUEST INTERCEPTOR — injeta o Bearer token em toda requisição autenticada
// ---------------------------------------------------------------------------
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    // Erros que ocorrem antes da requisição ser enviada (ex: falha ao montar config)
    (error) => Promise.reject(error)
);

// ---------------------------------------------------------------------------
// RESPONSE INTERCEPTOR — tratamento global de erros HTTP
// ---------------------------------------------------------------------------
api.interceptors.response.use(
    // Resposta bem-sucedida: passa diretamente
    (response) => response,

    (error) => {
        const status  = error.response?.status;
        const request = error.config;

        // --- 401 Unauthorized: token expirado ou inválido ----------------
        // A flag _isRetry evita loop infinito caso a própria /login retorne 401
        if (status === 401 && !request?._isRetry) {
            localStorage.removeItem('token');

            // Usa um CustomEvent para que o App.jsx (fora do contexto Axios)
            // possa reagir sem depender de window.location (que causa full reload)
            window.dispatchEvent(new CustomEvent('auth:unauthorized'));
        }

        // --- Erros de rede / timeout ------------------------------------
        if (!error.response) {
            console.error('[API] Sem resposta do servidor — verifique a conexão ou se o back-end está ativo.');
        }

        // Continua propagando o erro para o bloco catch de quem chamou
        return Promise.reject(error);
    }
);

export default api;
