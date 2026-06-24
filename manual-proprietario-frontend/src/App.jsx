import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

import ProtectedRoute from './components/ProtectedRoute';

// Páginas públicas
import Login               from './pages/Login';
import CadastroProprietario from './pages/CadastroProprietario';
import CadastroConstrutor  from './pages/CadastroConstrutor';
import EsqueciSenha        from './pages/EsqueciSenha';
import RedefinirSenha      from './pages/RedefinicaoSenha';

// Páginas compartilhadas (Proprietário + Construtor)
import Home              from './pages/Home';
import Manuais           from './pages/Manuais';
import ManualDetalhe     from './pages/ManuaisDetalhes';
import ManualComodo      from './pages/ManualComodo';
import Materiais         from './pages/Materiais';
import MateriaisDetalhes from './pages/MateriaisDetalhes';
import MinhaConta        from './pages/MinhaConta';

// Páginas exclusivas do Construtor
import Projetos           from './pages/Projetos';
import ProjetosDetalhes   from './pages/ProjetosDetalhes';
import ProjetosComodo     from './pages/ProjetosComodo';
import AlteracoesProjeto  from './pages/AlteracoesProjeto';
import AlteracoesComodos  from './pages/AlteracoesComodos';
import AdicionarMaterial  from './pages/AdicionarMaterial';
import EditarMaterial     from './pages/EditarMaterial';
import CadastroProjeto    from './pages/CadastroProjeto';
import CadastroProjeto2   from './pages/CadastroProjeto2';
import CadastroProjeto3   from './pages/CadastroProjeto3';

import './App.css';

// ---------------------------------------------------------------------------
// Roles disponíveis — centralizados para evitar "magic strings" espalhadas
// ---------------------------------------------------------------------------
const ROLES = {
  PROPRIETARIO: 'PROPRIETARIO',
  CONSTRUTOR:   'CONSTRUTOR',
};

// ---------------------------------------------------------------------------
// Utilitário: lê o JWT e devolve o usuário (ou null se inválido/expirado)
// ---------------------------------------------------------------------------
function getUserFromToken() {
  const token = localStorage.getItem('token');
  if (!token) return null;
  try {
    const decoded = jwtDecode(token);
    if (decoded.exp * 1000 < Date.now()) {
      localStorage.removeItem('token');
      return null;
    }
    return { role: decoded.profile, email: decoded.email };
  } catch {
    localStorage.removeItem('token');
    return null;
  }
}

// ---------------------------------------------------------------------------
// App
// ---------------------------------------------------------------------------
function App() {
  const [user, setUser] = useState(() => getUserFromToken());

  const handleLogin  = (userData) => setUser(userData);
  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  // Escuta o CustomEvent disparado pelo interceptor do Axios quando a API
  // retorna 401. Garante que o logout ocorra dentro do ciclo React,
  // sem precisar de window.location.href (que causaria full reload).
  useEffect(() => {
    const onUnauthorized = () => handleLogout();
    window.addEventListener('auth:unauthorized', onUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', onUnauthorized);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <BrowserRouter>
      <Routes>

        {/* ---------------------------------------------------------------- */}
        {/* Rota raiz — redireciona conforme o perfil                        */}
        {/* ---------------------------------------------------------------- */}
        <Route
          path="/"
          element={
            user
              ? <Navigate to={`/${user.role}`} replace />
              : <Navigate to="/login"           replace />
          }
        />

        {/* ---------------------------------------------------------------- */}
        {/* Rotas públicas — acessíveis sem autenticação                     */}
        {/* ---------------------------------------------------------------- */}
        <Route path="/login"               element={<Login onLogin={handleLogin} />} />
        <Route path="/cadastro-proprietario" element={<CadastroProprietario />} />
        <Route path="/cadastro-construtor"   element={<CadastroConstrutor />} />
        <Route path="/esqueci-senha"         element={<EsqueciSenha />} />
        <Route path="/redefinir-senha"       element={<RedefinirSenha />} />

        {/* ---------------------------------------------------------------- */}
        {/* Rotas compartilhadas — qualquer usuário autenticado              */}
        {/* ---------------------------------------------------------------- */}
        <Route element={<ProtectedRoute />}>

          {/* Dashboards de perfil */}
          <Route path="/PROPRIETARIO" element={<Home onLogout={handleLogout} />} />
          <Route path="/CONSTRUTOR"   element={<Home onLogout={handleLogout} />} />

          {/* Manuais */}
          <Route path="/manuais"                        element={<Manuais         onLogout={handleLogout} />} />
          <Route path="/manuais/:id"                    element={<ManualDetalhe   onLogout={handleLogout} />} />
          <Route path="/manuais/:id/comodo/:idComodo"   element={<ManualComodo    onLogout={handleLogout} />} />

          {/* Materiais (leitura — compartilhada) */}
          <Route path="/materiais"    element={<Materiais         onLogout={handleLogout} />} />
          <Route path="/materiais/:id" element={<MateriaisDetalhes onLogout={handleLogout} />} />

          {/* Conta */}
          <Route path="/minha-conta" element={<MinhaConta onLogout={handleLogout} />} />

        </Route>

        {/* ---------------------------------------------------------------- */}
        {/* Rotas exclusivas do Construtor                                   */}
        {/* ---------------------------------------------------------------- */}
        <Route element={<ProtectedRoute allowedRoles={[ROLES.CONSTRUTOR]} />}>

          {/* Projetos */}
          <Route path="/projetos"                                      element={<Projetos          onLogout={handleLogout} />} />
          <Route path="/projetos/:id"                                  element={<ProjetosDetalhes  onLogout={handleLogout} />} />
          <Route path="/projetos/:id/comodo/:idComodo"                 element={<ProjetosComodo    onLogout={handleLogout} />} />
          <Route path="/projetos/:id/comodo/:idComodo/alteracoes"      element={<AlteracoesComodos onLogout={handleLogout} />} />
          <Route path="/projetos/:id/alteracoes"                       element={<AlteracoesProjeto onLogout={handleLogout} />} />

          {/* Materiais — operações de escrita */}
          <Route path="/materiais/:id/adicionar"          element={<AdicionarMaterial onLogout={handleLogout} />} />
          <Route path="/materiais/:id/editar/:materialId" element={<EditarMaterial    onLogout={handleLogout} />} />

          {/* Cadastro de projeto (wizard) */}
          <Route path="/cadastro-projeto"  element={<CadastroProjeto  onLogout={handleLogout} />} />
          <Route path="/cadastro-projeto2" element={<CadastroProjeto2 onLogout={handleLogout} />} />
          <Route path="/cadastro-projeto3" element={<CadastroProjeto3 onLogout={handleLogout} />} />

        </Route>

        {/* ---------------------------------------------------------------- */}
        {/* Catch-all — qualquer rota desconhecida vai para a raiz           */}
        {/* ---------------------------------------------------------------- */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;