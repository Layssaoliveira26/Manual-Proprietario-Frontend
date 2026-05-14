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
import CadastroProjeto from './pages/CadastroProjeto';
import CadastroProjeto2 from './pages/CadastroProjeto2';
import CadastroProjeto3 from './pages/CadastroProjeto3';
import { jwtDecode } from 'jwt-decode';

function App() {
   const [user, setUser] = useState(() => {
    const token = localStorage.getItem("token");
    if (!token) return null;

    try {
      const decoded = jwtDecode(token);
      // Verifica se o token não expirou
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
          element={user ? <Home /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/CONSTRUTOR" 
          element={user ? <Home /> : <Navigate to="/login" />} 
        />

        <Route
          path="/manuais"
          element={user ? <Manuais /> : <Navigate to="/login" />}
        />
        <Route
          path="/projetos"
          element={user ? <Projetos /> : <Navigate to="/login" />}
        />
        <Route
          path="/cadastro-projeto"
          element={user ? <CadastroProjeto /> : <Navigate to="/login" />}
        />
        <Route
          path="/cadastro-projeto2"
          element={user ? <CadastroProjeto2 /> : <Navigate to="/login" />}
        />
        <Route
          path="/cadastro-projeto3" 
          element={user ? <CadastroProjeto3 /> : <Navigate to="/login" />}
        />

        {/* Rotas não encontradas */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;