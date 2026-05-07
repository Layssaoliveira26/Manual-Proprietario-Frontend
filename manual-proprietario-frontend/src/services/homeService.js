import api from "./api";

const statusTraduzido = {
    "EM_CONSTRUCAO": "Em construção",
    "ENTREGUE": "Entregue",
    "DESATIVADO": "Desativado",
    "PENDENTE": "Pendente"
};

export const buscarDadosDashboard = async () => {
    try {
        console.log(">>> Solicitando projetos ao servidor...");
        
        const resposta = await api.get('/projects');
    
        const projetosBrutos = resposta.data?.data || [];

        const projetosFormatados = projetosBrutos.map(proj => ({

            id: proj.idProjeto || proj.id,
            
            projeto: proj.nomeProjeto || proj.nome || "Projeto sem nome",
            
            responsavel: proj.construtor?.user?.nome || "Você",
            
            status: statusTraduzido[proj.status] || proj.status, 

            // Formata data
            ultimaAtualizacao: proj.ultimaAtualizacao 
                ? new Date(proj.ultimaAtualizacao).toLocaleDateString('pt-BR') 
                : "Sem data"
        }));

        const manuaisFormatados = []; 

        console.log(">>> Dashboard processado. Itens:", projetosFormatados.length);

        return {
            projetos: projetosFormatados,
            manuais: manuaisFormatados
        };

    } catch (error) {
        // Captura erro de conexão ou erro enviado pelo Back
        const mensagemErro = error.response?.data?.message || error.message;
        console.error(">>> Falha na integração do Dashboard:", mensagemErro);
        
        // Retorna listas vazias para a tela não quebrar
        return { 
            projetos: [], 
            manuais: [] 
        };
    }
};