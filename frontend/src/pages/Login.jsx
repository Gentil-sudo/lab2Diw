import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import Alerta from '../components/Alerta.jsx'
import Campo from '../components/Campo.jsx'
import Icone from '../components/Icone.jsx'
import TelaAcesso from '../components/TelaAcesso.jsx'

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
    <TelaAcesso>
      <form className="form-acesso" onSubmit={entrar}>
        <h2>Bem-vindo de volta</h2>
        <p className="dica">Entre com seu usuário e senha para continuar.</p>

        {erro && <Alerta>{erro}</Alerta>}

        <Campo label="Login" value={form.login} required autoFocus autoComplete="username"
          onChange={(e) => setForm({ ...form, login: e.target.value })} />
        <Campo label="Senha" type="password" value={form.senha} required autoComplete="current-password"
          onChange={(e) => setForm({ ...form, senha: e.target.value })} />

        <button className="botao destaque grande" disabled={carregando}>
          {carregando ? <><span className="spinner" /> Entrando...</> : <>Entrar <Icone nome="setaDireita" tamanho={18} /></>}
        </button>
        <p className="rodape-form">
          Ainda não tem conta? <Link to="/cadastro">Cadastre-se</Link>
        </p>
      </form>
    </TelaAcesso>
  )
}
