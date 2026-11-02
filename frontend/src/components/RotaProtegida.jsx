import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

// Envolve as páginas que precisam de login. Se não estiver logado, vai pro login.
// Se a página for só de um perfil (ex.: só cliente) e o usuário for outro, volta pro início.
export default function RotaProtegida({ perfis, children }) {
  const { usuario } = useAuth()

  if (!usuario) {
    return <Navigate to="/login" replace />
  }
  if (perfis && !perfis.includes(usuario.perfil)) {
    return <Navigate to="/" replace />
  }
  return children
}
