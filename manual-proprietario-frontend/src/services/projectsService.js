import api from './api';

// ---------------------------------------------------------------------------
// Helpers de normalização
// ---------------------------------------------------------------------------

const STATUS_MAP = {
    EM_CONSTRUCAO: 'Em construção',
    ENTREGUE:      'Entregue',
    DESATIVADO:    'Desativado',
    PENDENTE:      'Pendente',
};

/**
 * Converte o status vindo da API (ex: "EM_CONSTRUCAO") para o label
 * exibido na interface (ex: "Em construção").
 */
export function traduzirStatus(status) {
    return STATUS_MAP[status] ?? status ?? '—';
}

/**
 * Formata uma string ISO de data para dd/mm/aaaa no fuso UTC,
 * evitando o off-by-one que ocorre ao usar o fuso local do navegador.
 */
export function formatarData(isoString) {
    if (!isoString) return '—';
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return '—';
    return d.toLocaleDateString('pt-BR', { timeZone: 'UTC' });
}

/**
 * Normaliza um projeto bruto (formato da API) para o shape
 * que os componentes da listagem esperam.
 *
 * @param {object} raw — objeto projeto retornado por GET /projects
 * @returns {object}
 */
export function normalizarProjeto(raw) {
    return {
        id:               raw.id,
        nomeProjeto:      raw.nomeProjeto      ?? '—',
        responsavel:      raw.responsavel      ?? '—',
        statusRaw:        raw.status           ?? '',
        status:           traduzirStatus(raw.status),
        ultimaAtualizacao: formatarData(raw.ultimaAtualizacao ?? raw.updatedAt),
    };
}

// ---------------------------------------------------------------------------
// Funções de acesso à API
// ---------------------------------------------------------------------------

/**
 * Lista todos os projetos do usuário logado.
 * Endpoint: GET /projects
 * Aceita um parâmetro de busca opcional que é repassado como query string.
 *
 * @param {string} [search=''] — termo de busca
 * @returns {Promise<object[]>} — array de projetos normalizados
 */
export async function listarProjetos(search = '') {
    const params = search ? { search } : {};
    const response = await api.get('/projects', { params });

    // Formato padrão da API: { status: "success", data: [...] }
    const raw = response.data?.data;

    if (!Array.isArray(raw)) {
        console.warn('[projectsService] Formato inesperado em GET /projects:', response.data);
        return [];
    }

    return raw.map(normalizarProjeto);
}
