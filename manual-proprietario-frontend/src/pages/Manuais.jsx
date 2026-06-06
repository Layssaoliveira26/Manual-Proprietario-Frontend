import BarraLateral from "../components/BarraLateral";
import MenuInicial from "../components/MenuInicial";
import { MdOutlineEngineering } from "react-icons/md";
import { IoEyeOutline } from "react-icons/io5";
import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

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
	if (!dataString) return "";
	const data = new Date(dataString);
	if (isNaN(data.getTime())) return dataString;
	const dia = String(data.getDate()).padStart(2, '0');
	const mes = String(data.getMonth() + 1).padStart(2, '0');
	const ano = data.getFullYear();
	return `${dia}/${mes}/${ano}`;
}

function Manuais({ onLogout }) {

	const [projetos, setProjetos] = useState([]); 
	const [searchTerm, setSearchTerm] = useState("");
	const [carregando, setCarregando] = useState(true);
	const navigate = useNavigate();
	
    useEffect(() => {
		let ativo = true;

        const fetchProjects = async () => {
            try {
				setCarregando(true);

				const response = await api.get('/projects', {
					params: searchTerm ? { search: searchTerm } : {},
				});

				if (!ativo) {
					return;
				}

				const result = response.data;

				if (result.status === 'success' && result.data) {
					setProjetos(result.data);
                }

            } catch (err) {
                console.error('Error fetching projects:', err);
			} finally {
				if (ativo) {
					setCarregando(false);
				}
            }
        };

        fetchProjects();

		return () => {
			ativo = false;
		};
	}, [searchTerm]);


	return (
		<div className="h-svh flex flex-col overflow-hidden">
			<MenuInicial onSearchChange={setSearchTerm} />
			<div className="flex flex-1 overflow-hidden">
				<BarraLateral onLogout={onLogout}/>
				<main className="w-full overflow-y-auto px-10 py-8">

					<h3 className="page-title pl-2">Manuais Recentes</h3>
					<div className="w-full overflow-x-auto overflow-y-visible p-2">
						<table className="tb-manuais w-full">
							<colgroup>
                                <col className="w-[28%]" />
                                <col className="w-[24%]" />
                                <col className="w-[18%]" />
                                <col className="w-[30%]" />
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

								{carregando ? (
									<tr>
										<td colSpan={4} className="py-10 px-6 text-center">
											Carregando manuais...
										</td>
									</tr>
								) : projetos && projetos.length > 0 ? (
									projetos.map((manual) => (
										<tr key={manual.id}>
											<td className="py-5 px-6">{manual.nomeProjeto}</td>
											<td className="py-5 px-6">{manual.responsavel}</td>
											<td className="py-5">
												<div className={getClasseStatus(manual.status)}>
													{formateStatus(manual.status)}
												</div>
											</td>
											<td className="py-5 ">
												<div className="flex items-center justify-center gap-15 text-center">
													<span className="text-center">{formatarData(manual.ultimaAtualizacao)}</span>
													<IoEyeOutline className="w-5 h-5 cursor-pointer" onClick={() => navigate(`/manuais/${manual.id}`)} />
												</div>
											</td>
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
