import { listarProjetos } from './projectsService';

/**
 * Busca os dados para o dashboard (Home).
 * Retorna projetos e manuais separados, pois a tela os exibe em tabelas distintas.
 *
 * Nota: enquanto a API não expõe um endpoint dedicado a manuais (/manuals),
 * manuais e projetos apontam para a mesma origem (/projects). Quando o endpoint
 * de manuais for criado basta substituir a chamada abaixo.
 *
 * @param {string} [searchTerm='']
 * @returns {Promise<{ projetos: object[], manuais: object[] }>}
 */
export async function buscarDadosDashboard(searchTerm = '') {
    const projetos = await listarProjetos(searchTerm);

    // Manuais: mesmo endpoint por enquanto — cada projeto carrega seu manual.
    // O shape esperado pela tabela de manuais em Home.jsx usa "manual" como
    // label do nome, então fazemos o alias aqui para não alterar o JSX.
    const manuais = projetos.map((p) => ({
        ...p,
        manual: p.nomeProjeto,   // alias: campo exibido na coluna MANUAL
    }));

    return { projetos, manuais };
}