import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import Alerta from '../components/Alerta.jsx'
import Campo from '../components/Campo.jsx'
import Icone from '../components/Icone.jsx'
import TelaAcesso from '../components/TelaAcesso.jsx'

// Contas de demonstração (já cadastradas no banco de produção) para facilitar a avaliação.
const CONTAS_TESTE = [
  { perfil: 'Cliente', icone: 'usuario', login: 'teste.cliente', senha: '123456' },
  { perfil: 'Empresa', icone: 'empresa', login: 'teste.empresa', senha: '123456' },
  { perfil: 'Banco', icone: 'banco', login: 'teste.banco', senha: '123456' },
]

export default function Login() {
  const { usuario, login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ login: '', senha: '' })
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)

  if (usuario) {
    return <Navigate to="/" replace />
  }

  async function fazerLogin(credenciais) {
    setErro('')
    setCarregando(credenciais.login)
    try {
      await login(credenciais.login, credenciais.senha)
      navigate('/')
    } catch (err) {
      setErro(err.message)
    } finally {
      setCarregando(false)
    }
  }

  function entrar(e) {
    e.preventDefault()
    fazerLogin(form)
  }

  function entrarComTeste(conta) {
    setForm({ login: conta.login, senha: conta.senha })
    fazerLogin(conta)
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

        <button className="botao destaque grande" disabled={!!carregando}>
          {carregando === form.login && !CONTAS_TESTE.some((c) => c.login === carregando)
            ? <><span className="spinner" /> Entrando...</>
            : <>Entrar <Icone nome="setaDireita" tamanho={18} /></>}
        </button>
        <p className="rodape-form">
          Ainda não tem conta? <Link to="/cadastro">Cadastre-se</Link>
        </p>

        <div className="acesso-rapido">
          <div className="acesso-rapido-titulo">
            <span>Acesso rápido para testes</span>
          </div>
          <div className="acesso-rapido-botoes">
            {CONTAS_TESTE.map((conta) => (
              <button
                key={conta.login}
                type="button"
                className="botao secundario"
                disabled={!!carregando}
                onClick={() => entrarComTeste(conta)}
                title={`Entrar como ${conta.login} (senha ${conta.senha})`}
              >
                {carregando === conta.login
                  ? <span className="spinner escuro" />
                  : <Icone nome={conta.icone} tamanho={16} />}
                {conta.perfil}
              </button>
            ))}
          </div>
          <small className="acesso-rapido-dica">
            Senha de todas as contas: <code>123456</code>. O primeiro acesso pode levar até 50s (servidor gratuito).
          </small>
        </div>
      </form>
    </TelaAcesso>
  )
}
