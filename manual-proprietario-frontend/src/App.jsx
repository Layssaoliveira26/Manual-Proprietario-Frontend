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

function App() {
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => {
    setUser(userData);
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            user ? <Navigate to={`/${user.role}`} /> : <Navigate to="/login"/> 
          }
        />

        <Route path="/login" element={<Login onLogin={handleLogin} />} />

        {/* Rotas que correspondem aos perfis do banco */}
        <Route path="/CONSTRUTOR" element={user ? <Home /> : <Navigate to="/login" />} />
        <Route path="/PROPRIETARIO" element={user ? <Home /> : <Navigate to="/login" />} />

        <Route path="/cadastro-proprietario" element={<CadastroProprietario/>} />
        <Route path="/cadastro-construtor" element={<CadastroConstrutor/>} />
        <Route path="/redefinir-senha" element={<RedefinirSenha/>} />
        <Route path="/esqueci-senha" element={<EsqueciSenha />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App