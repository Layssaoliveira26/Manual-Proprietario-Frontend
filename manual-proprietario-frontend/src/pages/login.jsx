function Login() {

    return (
        <div className="flex h-screen w-full items-center justify-center">
            <div class="form-login pb-5 px-10 border-solid rounded-xl shadow-xl">
                <div class="flex justify-end">
                    <img src="src\assets\svg\detalhe-form.svg" alt="" />
                </div>
                
                <div class="flex flex-col justify-center items-center mb-5">
                    <img src="src\assets\svg\logo-portal.svg" alt="" />
                    <h3 class="font-manrope text-2xl font-semibold text-[var(--laranja-principal)]">Manual do Proprietário</h3>
                </div>
                
                
                <div class="escolha-role flex bg-[var(--cor-fundo)] p-1 justify-center rounded-sm">
                    <button className="btn-laranja py-2 px-8 rounded-sm font-medium text-[var(--cor-fundo)]">Proprietário</button>
                    <button className="btn-branco py-2 px-8 rounded-sm ml-0.5 font-medium text-[var(--laranja-principal)] font ">Construtor</button>
                </div>
                <div class="campos-form mt-5">
                    <input type="email" name="" placeholder="Email"/>
                    <input type="password" name="" placeholder="Senha"/>
                    <button type="submit" className="btn-telas-iniciais">Entrar</button>
                </div>
                <div class="extra-form mt-6 text-center">
                    <p class="p-troca-senha text-[var(--laranja-principal)] mb-2">Esqueceu a senha?</p>
                    <p className="text-gray-400">Ainda não tem conta? <span className="text-[var(--laranja-principal)]">Cadastre-se</span></p> 
                </div>
                <div class="flex justify-start">
                    <img src="src\assets\svg\detalhe-form.svg" alt="" />
                </div>
                
            </div>
        </div>
        
    )
}

export default Login