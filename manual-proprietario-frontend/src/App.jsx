import { useState } from 'react';
import CadastroProprietario from "./pages/CadastroProprietario"
import CadastroConstrutor from './pages/CadastroConstrutor';
import RedefinirSenha from './pages/RedefinicaoSenha';
import EsqueciSenha from './pages/EsqueciSenha';
import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import Manuais from './pages/Manuais';
import Projetos from './pages/Projetos';
import Materiais from './pages/Materiais';
import MateriaisDetalhes from './pages/MateriaisDetalhes';
import AdicionarMaterial from './pages/AdicionarMaterial';
import EditarMaterial from './pages/EditarMaterial';
import MinhaConta from './pages/MinhaConta';
import CadastroProjeto from './pages/CadastroProjeto';
import CadastroProjeto2 from './pages/CadastroProjeto2';
import CadastroProjeto3 from './pages/CadastroProjeto3';
import { jwtDecode } from 'jwt-decode';
import ManualDetalhe from './pages/ManuaisDetalhes';
import ManualComodo from './pages/ManualComodo';
import ProjetosDetalhes from './pages/ProjetosDetalhes';
import ProjetosComodo from './pages/ProjetosComodo';
import AlteracoesProjeto from './pages/AlteracoesProjeto';
import AlteracoesComodos from './pages/AlteracoesComodos';

function App() {
   const [user, setUser] = useState(() => {
    const token = localStorage.getItem("token");
    if (!token) return null;

    try {
      const decoded = jwtDecode(token);
      if (decoded.exp * 1000 < Date.now()) {
        localStorage.removeItem("token");
        return null;
      }
      return { role: decoded.profile, email: decoded.email };
    } catch {
      localStorage.removeItem("token");
      return null;
    }
  });
  
  const handleLogin = (userData) => {
    setUser(userData);
  }
  
  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Rota Raiz */}
        <Route
          path="/"
          element={
            user ? <Navigate to={`/${user.role}`} /> : <Navigate to="/login"/> 
          }
        />

        {/* Rotas Públicas */}
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/cadastro-proprietario" element={<CadastroProprietario/>} />
        <Route path="/cadastro-construtor" element={<CadastroConstrutor/>} />
        <Route path="/esqueci-senha" element={<EsqueciSenha />} />
        <Route path="/redefinir-senha" element={<RedefinirSenha/>} />

        {/* Rotas Protegidas */}
        <Route 
          path="/PROPRIETARIO" 
          element={user ? <Home onLogout={handleLogout}/> : <Navigate to="/login" />} 
        />
        <Route 
          path="/CONSTRUTOR" 
          element={user ? <Home onLogout={handleLogout}/> : <Navigate to="/login" />} 
        />

        <Route
          path="/manuais"
          element={user ? <Manuais onLogout={handleLogout}/> : <Navigate to="/login" />}
        />
        <Route
          path="/manuais/:id"
          element={user ? <ManualDetalhe onLogout={handleLogout}/> : <Navigate to="/login" />}
        />
        <Route
          path="/manuais/:id/comodo/:idComodo"
          element={user ? <ManualComodo onLogout={handleLogout}/> : <Navigate to="/login" />}
        />
        <Route
          path="/projetos"
          element={user ? <Projetos onLogout={handleLogout}/> : <Navigate to="/login" />}
        />
        <Route
          path="/projetos/:id"
          element={user ? <ProjetosDetalhes onLogout={handleLogout}/> : <Navigate to="/login" />}
        />
        <Route
          path="/projetos/:id/comodo/:idComodo"
          element={user ? <ProjetosComodo onLogout={handleLogout}/> : <Navigate to="/login" />}
        />
        <Route
          path="/projetos/:id/comodo/:idComodo/alteracoes"
          element={user ? <AlteracoesComodos onLogout={handleLogout}/> : <Navigate to="/login" />}
        />
        <Route
          path="/projetos/:id/alteracoes"
          element={user ? <AlteracoesProjeto onLogout={handleLogout}/> : <Navigate to="/login" />}
        />

        {/* Rotas de Materiais */}
        <Route
          path="/materiais"
          element={user ? <Materiais onLogout={handleLogout}/> : <Navigate to="/login" />}
        />
        <Route
          path="/materiais/:id"
          element={user ? <MateriaisDetalhes onLogout={handleLogout}/> : <Navigate to="/login" />}
        />
        <Route
          path="/materiais/:id/adicionar"
          element={user ? <AdicionarMaterial onLogout={handleLogout}/> : <Navigate to="/login" />}
        />
        <Route
          path="/materiais/:id/editar/:materialId"
          element={user ? <EditarMaterial onLogout={handleLogout}/> : <Navigate to="/login" />}
        />
        <Route
          path="/minha-conta"
          element={user ? <MinhaConta onLogout={handleLogout}/> : <Navigate to="/login" />}
        />

        <Route
          path="/cadastro-projeto"
          element={user ? <CadastroProjeto onLogout={handleLogout}/> : <Navigate to="/login" />}
        />
        <Route
          path="/cadastro-projeto2"
          element={user ? <CadastroProjeto2 onLogout={handleLogout}/> : <Navigate to="/login" />}
        />
        <Route
          path="/cadastro-projeto3" 
          element={user ? <CadastroProjeto3 onLogout={handleLogout}/> : <Navigate to="/login" />}
        />

        {/* Rotas não encontradas */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;