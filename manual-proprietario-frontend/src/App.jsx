import { useState } from 'react';
import TelaLogin from "./pages/Login";
import CadastroProprietario from "./pages/CadastroProprietario"
import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

function App() {

const [user, setUser] = useState(null);

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
          element={<TelaLogin/>}
        />

        <Route
          path="/cadastro-proprietario"
          element={<CadastroProprietario/>}
        />

      </Routes>
    </BrowserRouter>
  )
}

export default App
