import BarraLateral from "../components/BarraLateral"
import MenuInicial from "../components/MenuInicial"
import BarraNumeros from "../components/BarraNumeros";
import {Link} from "react-router-dom";


function CadastroProjeto() {
    return (
        <div className="h-svh flex flex-col overflow-hidden">
            <MenuInicial />
            <div className="flex flex-1 overflow-hidden">
                <BarraLateral />
                <main className="w-full overflow-y-auto px-10 py-8">
                    <h3 className="page-title pl-2">Configurar Projeto</h3>
                    <BarraNumeros />
                    <div className="flex flex-col justify-center">
                        <form action="">
                            <div className="">
                                <label for="nomeProj" className="">Nome do Projeto*</label>
                                <input type="text" placeholder="nome" className="w-full min-w-0 mt-3 mb-3 px-4 py-3.5 border border-[#dcdcdc] rounded-lg text-sm text-[#333] outline-none"/>
                            </div>
                            <div>
                                <label for="descProj">Descrição</label>
                                <input type="text" placeholder="Descrição do projeto" className="w-full min-w-0 mt-3 mb-3 px-4 py-3.5 border border-[#dcdcdc] rounded-lg text-sm text-[#333] outline-none"/>
                            </div>
                            <div className="flex flex-col lg:flex-row gap-10 w-full">
                                <div className="flex flex-col w-full">
                                    <label for="rua">Rua*</label>
                                    <input type="text" placeholder="Av.Exemplo" className="w-full min-w-0 mt-3 mb-3 px-4 py-3.5 border border-[#dcdcdc] rounded-lg text-sm text-[#333] outline-none"/>
                                </div>
                                <div className="flex flex-col w-full">
                                    <label for="bairro">Bairro*</label>
                                    <input type="text" placeholder="Bairro" className="w-full min-w-0 mt-3 mb-3 px-4 py-3.5 border border-[#dcdcdc] rounded-lg text-sm text-[#333] outline-none"/>
                                </div>
                            </div>
                            <div className="flex flex-col lg:flex-row gap-10 w-full">
                                <div className="flex flex-col w-full">
                                    <label for="rua">Número*</label>
                                    <input type="number" placeholder="Número" className="w-full min-w-0 mt-3 mb-3 px-4 py-3.5 border border-[#dcdcdc] rounded-lg text-sm text-[#333] outline-none"/>
                                </div>
                                <div className="flex flex-col w-full">
                                    <label for="complemento">Complemento</label>
                                    <input type="text" placeholder="Apto" className="w-full min-w-0 mt-3 mb-3 px-4 py-3.5 border border-[#dcdcdc] rounded-lg text-sm text-[#333] outline-none"/>
                                </div>
                                <div className="flex flex-col w-full">
                                    <label for="tipoConst">Tipo de Construção*</label>
                                    <select name="" id="" className="w-full min-w-0 mt-3 mb-3 px-4 py-3.5 border border-[#dcdcdc] rounded-lg text-sm text-[#333] outline-none">
                                        <option value="">Teste</option>
                                    </select>
                                </div> 
                            </div>
                            <div className="flex flex-col lg:flex-row gap-10 w-full">
                                <div className="flex flex-col w-full">
                                    <label for="dataIni">Data de início*</label>
                                    <input type="date" placeholder="dd/mm/aaaa" className="w-full min-w-0 mt-3 mb-3 px-4 py-3.5 border border-[#dcdcdc] rounded-lg text-sm text-[#333] outline-none"/>
                                </div>
                                <div className="flex flex-col w-full">
                                    <label for="dataConc">Data de conclusão estimada</label>
                                    <input type="date" placeholder="dd/mm/aaaa" className="w-full min-w-0 mt-3 mb-3 px-4 py-3.5 border border-[#dcdcdc] rounded-lg text-sm text-[#333] outline-none"/>
                                </div>
                                <div className="flex flex-col w-full">
                                    <label for="numArt">Número do ART</label>
                                    <input type="número" placeholder="número" className="w-full min-w-0 mt-3 mb-3 px-4 py-3.5 border border-[#dcdcdc] rounded-lg text-sm text-[#333] outline-none"/>
                                </div> 
                            </div>
                            <div className="flex justify-center items-center gap-3">
                                <Link
                                    to="/projetos"
                                    className="w-full max-w-37.5 py-3 px-4 text-center text-(--laranja-principal) border-(--laranja-principal) border-2 rounded-md font-medium"
                                >
                                    Cancelar
                                </Link>
                                <button type="button" className="w-full max-w-37.5 py-3 px-4 bg-(--laranja-principal) text-white rounded-md font-medium"><Link to="/cadastro-projeto2">Próximo</Link></button>
                            </div>
                        </form>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default CadastroProjeto