import BarraLateral from "../components/BarraLateral";
import MenuInicial from "../components/MenuInicial";
import { MdOutlineEngineering } from "react-icons/md";
import { manuaisMock } from "../mocks/manuais";

function getClasseStatus(status) {
	switch (status) {
		case "Entregue":
			return "td-entregue";
		case "Em construção":
			return "td-construcao";
		case "Desativado":
			return "td-desativado";
		default:
			return undefined;
	}
}

function Manuais() {
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
								<tr className="cabecalho bg-(--laranja-principal) text-white text-sm text-left rounded-2xl font-semibold">
									<th className="py-4 px-6">MANUAL</th>
									<th className="py-4 px-6">RESPONSÁVEL</th>
									<th className="py-4 px-6">STATUS</th>
									<th className="py-4 px-6">ÚLTIMA ATUALIZAÇÃO</th>
								</tr>
							</thead>
							<tbody>
								{manuaisMock && manuaisMock.length > 0 ? (
									manuaisMock.map((manual) => (
										<tr key={manual.id}>
											<td className="py-5 px-6">{manual.manual}</td>
											<td className="py-5 px-6">{manual.responsavel}</td>
											<td className="py-5 px-6">
												<div className={getClasseStatus(manual.status)}>
													{manual.status}
												</div>
											</td>
											<td className="py-5 px-6">{manual.ultimaAtualizacao}</td>
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
