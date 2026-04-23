import { useState } from 'react';
import CadastroProprietario from "./pages/CadastroProprietario"
import CadastroConstrutor from './pages/CadastroConstrutor';
import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';

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
            user ? <Navigate to={`/${user.role}`} /> : <Navigate to= "/login"/> 
          }
        />

        <Route
          path="/login" 
          element={<Login onLogin={handleLogin} />}
        />

        <Route
          path="/cadastro-proprietario"
          element={<CadastroProprietario/>}
        />

        <Route
          path="/cadastro-construtor"
          element={<CadastroConstrutor/>}
        />

      </Routes>
    </BrowserRouter>
  )
}

export default App
