import { Navigate, Outlet } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

/**
 * Lê e valida o token JWT do localStorage.
 * Retorna { role, email } se válido, ou null se ausente/expirado/inválido.
 */
function getAuthenticatedUser() {
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

/**
 * ProtectedRoute
 *
 * Props:
 *  - allowedRoles: string[] — lista de roles que podem acessar a rota.
 *                              Se omitido ou vazio, qualquer usuário autenticado pode acessar.
 *
 * Comportamento:
 *  - Não autenticado          → redireciona para /login
 *  - Autenticado, role válida → renderiza os filhos (<Outlet />)
 *  - Autenticado, role inválida → redireciona para /<ROLE_DO_USUARIO> (rota base do perfil)
 */
function ProtectedRoute({ allowedRoles = [] }) {
  const user = getAuthenticatedUser();

  // 1. Não está autenticado
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 2. A rota exige roles específicas E o perfil do usuário não está na lista
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to={`/${user.role}`} replace />;
  }

  // 3. Autorizado — renderiza a rota filha
  return <Outlet />;
}

export default ProtectedRoute;
