import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import Campo from '../components/Campo.jsx'

export default function Login() {
  const { usuario, login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ login: '', senha: '' })
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)

  if (usuario) {
    return <Navigate to="/" replace />
  }

  async function entrar(e) {
    e.preventDefault()
    setErro('')
    setCarregando(true)
    try {
      await login(form.login, form.senha)
      navigate('/')
    } catch (err) {
      setErro(err.message)
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className="tela-acesso">
      <form className="cartao acesso" onSubmit={entrar}>
        <h1>🚗 Aluguel de Carros</h1>
        <p className="dica">Entre com seu usuário e senha</p>

        {erro && <div className="alerta erro">{erro}</div>}

        <Campo label="Login" value={form.login} required autoFocus
          onChange={(e) => setForm({ ...form, login: e.target.value })} />
        <Campo label="Senha" type="password" value={form.senha} required
          onChange={(e) => setForm({ ...form, senha: e.target.value })} />

        <button className="botao" disabled={carregando}>
          {carregando ? 'Entrando...' : 'Entrar'}
        </button>
        <p className="rodape-form">
          Não tem conta? <Link to="/cadastro">Cadastre-se</Link>
        </p>
      </form>
    </div>
  )
}
