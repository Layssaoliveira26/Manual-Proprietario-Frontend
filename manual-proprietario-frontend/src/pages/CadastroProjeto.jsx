import BarraLateral from "../components/BarraLateral"
import MenuInicial from "../components/MenuInicial"


function CadastroProjeto() {
    return (
        <div className="h-svh flex flex-col overflow-hidden">
            <MenuInicial />
            <div className="flex flex-1 overflow-hidden">
                <BarraLateral />
                <main className="w-full overflow-y-auto px-10 py-8">
                    <h3 className="page-title pl-2">Configurar Projeto</h3>
                    <div className="relative flex w-fit mx-auto gap-15 mb-5 before:content-[''] before:absolute before:top-5 before:left-5 before:right-6 before:h-0.5 before:bg-[rgba(0,0,0,0.123)]">
                        <div className="flex flex-col items-center gap-1">
                            <span className="relative z-10 inline-flex h-10 w-10 items-center justify-center rounded-full border-2 border-[rgba(0,0,0,0.123)] bg-white">1</span>
                            <p>Obra</p>
                        </div>
                        <hr className="hidden" />
                        <div className="flex flex-col items-center gap-1">
                            <span className="relative z-10 inline-flex h-10 w-10 items-center justify-center rounded-full border-2 border-[rgba(0,0,0,0.123)] bg-white">2</span>
                            <p>Funcionários</p>
                        </div>
                        <hr className="hidden" />
                        <div className="flex flex-col items-center gap-1">
                            <span className="relative z-10 inline-flex h-10 w-10 items-center justify-center rounded-full border-2 border-[rgba(0,0,0,0.123)] bg-white">3</span>
                            <p>Funcionários</p>
                        </div>
                    </div>
                    <div className="flex flex-col justify-center bg-amber-100">
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
                                <button className="w-full max-w-[150px] py-3 px-4  text-[var(--laranja-principal)] border-[var(--laranja-principal)] border-2 rounded-md font-medium">Cancelar</button>
                                <button className="w-full max-w-[150px] py-3 px-4 bg-[var(--laranja-principal)] text-white rounded-md font-medium">Próximo</button>
                            </div>
                        </form>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default CadastroProjeto