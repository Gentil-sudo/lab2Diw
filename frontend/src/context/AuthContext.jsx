import { createContext, useContext, useState } from 'react'
import { api } from '../services/api.js'

const AuthContext = createContext(null)

// Guarda quem está logado e deixa isso disponível pra qualquer tela.
// O usuário também vai pro localStorage, assim o login continua
// mesmo se a pessoa der F5 na página.
export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(() => JSON.parse(localStorage.getItem('usuario')))

  async function login(login, senha) {
    const dados = await api('/auth/login', { method: 'POST', body: { login, senha } })
    localStorage.setItem('usuario', JSON.stringify(dados))
    setUsuario(dados)
    return dados
  }

  function logout() {
    localStorage.removeItem('usuario')
    setUsuario(null)
  }

  return (
    <AuthContext.Provider value={{ usuario, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
