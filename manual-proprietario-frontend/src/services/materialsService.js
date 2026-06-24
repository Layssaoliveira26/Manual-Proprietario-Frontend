import api from './api';
import { formatarData } from './projectsService';

// ---------------------------------------------------------------------------
// Constantes de domínio — áreas de material disponíveis no sistema
// Exportadas daqui para que AdicionarMaterial e EditarMaterial não dependam
// mais do arquivo de mocks.
// ---------------------------------------------------------------------------
export const AREAS = ['Todos', 'Revestimentos', 'Pinturas', 'Louças e metais', 'Luminárias'];
export const AREAS_SEM_TODOS = AREAS.filter((a) => a !== 'Todos');

// ---------------------------------------------------------------------------
// Normalização
// ---------------------------------------------------------------------------

/**
 * Normaliza um material bruto retornado pela API para o shape
 * que os componentes de listagem e edição esperam.
 *
 * Formato esperado de `raw` (vindo de GET /projects/:id/materials):
 * {
 *   id:           string,
 *   nomeMaterial: string,
 *   marca:        string | null,
 *   referencia:   string | null,
 *   area:         string,           // ex: "Revestimentos"
 *   updatedAt:    string (ISO),
 *   comodos: [                      // agrupamento já enviado pelo back-end
 *     { nomeComodo: string, ... },
 *     ...
 *   ]
 * }
 */
export function normalizarMaterial(raw) {
    // Monta a string de cômodos a partir do array agrupado
    const comodos = Array.isArray(raw.comodos) ? raw.comodos : [];
    const nomesComodos = comodos
        .map((c) => c.nomeComodo ?? c.nome ?? '')
        .filter(Boolean);

    return {
        id:               raw.id,
        nomeMaterial:     raw.nomeMaterial  ?? raw.nome          ?? '—',
        marca:            raw.marca         ?? '—',
        referencia:       raw.referencia    ?? '—',
        lote:             raw.lote          ?? '',
        tamanho:          raw.tamanho       ?? '',
        tipo:             raw.tipo          ?? '',
        cor:              raw.cor           ?? '',
        descricao:        raw.descricao     ?? '',
        area:             raw.area          ?? '—',
        // Array original de cômodos (mantido para EditarMaterial pré-selecionar)
        comodosArray:     comodos,
        // String formatada para exibição na tabela ("Cozinha, Sala de estar")
        comodos:          nomesComodos.length > 0 ? nomesComodos.join(', ') : '—',
        ultimaAtualizacao: formatarData(raw.updatedAt ?? raw.ultimaAtualizacao),
    };
}

// ---------------------------------------------------------------------------
// Funções de acesso à API
// ---------------------------------------------------------------------------

/**
 * Lista todos os materiais de um projeto específico.
 * Endpoint: GET /projects/:projectId/materials
 *
 * O back-end retorna cada material com a propriedade `comodos` (array)
 * descrevendo onde o material foi alocado — já agrupado.
 *
 * @param {string} projectId
 * @returns {Promise<object[]>} — array de materiais normalizados
 */
export async function listarMateriaisPorProjeto(projectId) {
    const response = await api.get(`/projects/${projectId}/materials`);

    // Suporta tanto { data: { materiais: [] } } quanto { data: [] }
    const payload = response.data?.data;
    const raw = Array.isArray(payload)
        ? payload
        : Array.isArray(payload?.materiais)
            ? payload.materiais
            : [];

    if (raw.length === 0 && payload !== undefined && !Array.isArray(payload) && !payload?.materiais) {
        console.warn('[materialsService] Formato inesperado em GET /projects/:id/materials:', response.data);
    }

    return raw.map(normalizarMaterial);
}

/**
 * Busca um material específico pelo seu ID dentro de um projeto.
 * Endpoint: GET /projects/:projectId/materials/:materialId
 *
 * @param {string} projectId
 * @param {string} materialId
 * @returns {Promise<object>} — material normalizado
 */
export async function buscarMaterialPorId(projectId, materialId) {
    const response = await api.get(`/projects/${projectId}/materials/${materialId}`);
    const raw = response.data?.data;
    if (!raw) throw new Error('Material não encontrado');
    return normalizarMaterial(raw);
}
