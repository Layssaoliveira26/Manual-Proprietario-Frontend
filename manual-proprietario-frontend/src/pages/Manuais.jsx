import BarraLateral from "../components/BarraLateral";
import MenuInicial from "../components/MenuInicial";
import { MdOutlineEngineering } from "react-icons/md";
import { manuaisMock } from "../mocks/manuais";
import { useEffect, useState } from "react";

function getClasseStatus(status) {
	switch (status) {
		case "ENTREGUE":
			return "td-entregue";
		case "EM_CONSTRUCAO":
			return "td-construcao";
		case "DESATIVADO":
			return "td-desativado";
		default:
			return undefined;
	}
}

function formateStatus(status) {
	switch (status) {
		case "ENTREGUE":
			return "Entregue";
		case "EM_CONSTRUCAO":
			return "Em construção";
		case "DESATIVADO":
			return "Desativado";
		default:
			return undefined;
	}
}

function formatarData(dataString) {
	const data = new Date(dataString);
	const dia = String(data.getDate()).padStart(2, '0');
	const mes = String(data.getMonth() + 1).padStart(2, '0');
	const ano = data.getFullYear();
	return `${dia}/${mes}/${ano}`;
}




function Manuais() {

	const [projetos, setProjetos] = useState([]); 

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const token = localStorage.getItem('token');
                
                const response = await fetch('http://localhost:3000/projects', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });

                const result = await response.json();

                if (result.status === 'success' && result.data) {
                    setProjetos(result.data); 
                }

            } catch (err) {
                console.error('Error fetching projects:', err);
            }
        };

        fetchProjects();
    }, []);


	return (
		<div className="h-svh flex flex-col overflow-hidden">
			<MenuInicial />
			<div className="flex flex-1 overflow-hidden">
				<BarraLateral />
				<main className="w-full overflow-y-auto px-10 py-8">

					<h3 className="page-title pl-2">Manuais Recentes</h3>
					<div className="w-full overflow-x-auto overflow-y-visible p-2">
						<table className="tb-manuais w-full">
							<colgroup>
								<col className="w-1/4" />
								<col className="w-1/4" />
								<col className="w-1/4" />
								<col className="w-1/4" />
							</colgroup>
							<thead>
								<tr className="cabecalho bg-(--laranja-principal) text-white text-sm text-left rounded-2xl font-semibold ">
									<th className="py-4 px-6">MANUAL</th>
									<th className="py-4 px-6">RESPONSÁVEL</th>
									<th className="py-4 px-6">STATUS</th>
									<th className="py-4 px-6">ÚLTIMA ATUALIZAÇÃO</th>
								</tr>
							</thead>
							<tbody>

								{projetos && projetos.length > 0 ? (
									projetos.map((projetos) => (
										<tr key={projetos.id}>
											<td className="py-5 px-6">{projetos.nomeProjeto}</td>
											<td className="py-5 px-6">{projetos.responsavel}</td>
											<td className="py-5 px-6">
												<div className={getClasseStatus(projetos.status)}>
													{formateStatus(projetos.status)}
												</div>
											</td>
											<td className="py-5 px-6">{formatarData(projetos.ultimaAtualizacao)}</td>
										</tr>
									))
								) : (
									<tr>
										<td colSpan={4} className="py-10 px-6">
											<div className="w-full flex flex-col items-center text-center mt-14 mb-14">
												<MdOutlineEngineering className="w-40 h-40 text-[#455a641e]" />
												<h4>Você não possui nenhum manual</h4>
											</div>
										</td>
									</tr>
								)}


							</tbody>
						</table>
					</div>
				</main>
			</div>
		</div>
	);
}

export default Manuais;
