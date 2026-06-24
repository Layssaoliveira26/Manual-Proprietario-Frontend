import api from './api';

// ---------------------------------------------------------------------------
// Autenticação
// ---------------------------------------------------------------------------

/**
 * Realiza o login do usuário.
 * @param {{ email: string, password: string, profile: string }} payload
 * @returns {Promise<{ token: string, user: object }>}
 */
async function login(payload) {
    const response = await api.post('/auth/login', payload);
    return response.data;
}

// ---------------------------------------------------------------------------
// Perfil — Minha Conta
// ---------------------------------------------------------------------------

/**
 * Busca o perfil do usuário autenticado.
 * Endpoint: GET /users/me
 *
 * Resposta esperada:
 * {
 *   status: "success",
 *   data: {
 *     user: {
 *       id:      string,
 *       nome:    string,
 *       email:   string,
 *       cpf:     string,   // sempre mascarado pelo back-end: "***.456.789-**"
 *       profile: "CONSTRUTOR" | "PROPRIETARIO",
 *       crea:    string | null  // presente apenas para CONSTRUTOR
 *     }
 *   }
 * }
 *
 * @returns {Promise<object>} — objeto user normalizado
 */
export async function getProfile() {
    const response = await api.get('/users/me');
    const user = response.data?.data?.user;
    if (!user) throw new Error('Perfil não encontrado na resposta da API');
    return user;
}

/**
 * Atualiza os dados pessoais do usuário autenticado.
 * Endpoint: PATCH /users/me/profile
 *
 * Campos aceitos pelo back-end:
 *   - nome  (string, opcional)
 *   - email (string, opcional)
 *   - crea  (string, opcional — ignorado para PROPRIETARIO pelo back-end)
 *
 * @param {{ nome?: string, email?: string, crea?: string }} data
 * @returns {Promise<object>} — user atualizado
 */
export async function updateProfile(data) {
    const response = await api.patch('/users/me/profile', data);
    const user = response.data?.data?.user;
    return user ?? response.data;
}

/**
 * Altera a senha do usuário autenticado.
 * Endpoint: PATCH /users/me/password
 *
 * O back-end valida a senha atual via bcrypt antes de salvar o hash da nova.
 *
 * @param {{ senhaAtual: string, novaSenha: string }} data
 * @returns {Promise<object>}
 */
export async function changePassword(data) {
    const response = await api.patch('/users/me/password', data);
    return response.data;
}

export default login;