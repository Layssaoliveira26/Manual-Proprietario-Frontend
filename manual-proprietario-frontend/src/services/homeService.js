import api from "./api";

const statusTraduzido = {
    "EM_CONSTRUCAO": "Em construção",
    "ENTREGUE": "Entregue",
    "DESATIVADO": "Desativado",
    "PENDENTE": "Pendente"
};

export const buscarDadosDashboard = async () => {
    try {
        const resposta = await api.get('/projects');
        const projetosBrutos = resposta.data?.data || [];

        const projetosFormatados = projetosBrutos.map(proj => ({
            id: proj.id,
            projeto: proj.nomeProjeto ?? "Projeto sem nome",
            responsavel: proj.responsavel ?? "Não informado",
            status: statusTraduzido[proj.status] || proj.status,
            ultimaAtualizacao: proj.ultimaAtualizacao
                ? new Date(proj.ultimaAtualizacao).toLocaleDateString('pt-BR')
                : "Sem data"
        }));

        return {
            projetos: projetosFormatados,
            manuais: projetosFormatados.map(p => ({ ...p, manual: p.projeto }))
        };

    } catch (error) {
        console.error("buscarDadosDashboard:", error.response?.data?.message ?? error.message);
        throw error;
    }
};