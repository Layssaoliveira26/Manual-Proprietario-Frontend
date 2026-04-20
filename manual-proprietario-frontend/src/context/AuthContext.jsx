// src/context/AuthContext.jsx
import { createContext, useContext, useState } from 'react';
 
const AuthContext = createContext(null);
 
//pode ser chamado dinamicamnte em app ou outro
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
 
  const login = (userData) => setUser(userData);
  const logout = () => setUser(null);
 
  return (
    //qualquer parte da aplicação pode acessar user, login e logout(sem precisar ficar passando por props)
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
 
//apenas para simplificar o uso/consumo desse contexto, para não precisar ficar escrevendo "useContext(AuthContext)"
export const useAuth = () => useContext(AuthContext);
