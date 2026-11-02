import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { api } from '../services/api.js'
import Campo from '../components/Campo.jsx'
import RendimentosForm from '../components/RendimentosForm.jsx'

const CLIENTE_VAZIO = { login: '', senha: '', rg: '', cpf: '', nome: '', endereco: '', profissao: '' }
const AGENTE_VAZIO = { login: '', senha: '', nome: '', cnpj: '', tipo: 'EMPRESA' }

export default function Cadastro() {
  const { usuario, login } = useAuth()
  const navigate = useNavigate()
  const [tipo, setTipo] = useState('CLIENTE')
  const [cliente, setCliente] = useState(CLIENTE_VAZIO)
  const [rendimentos, setRendimentos] = useState([])
  const [agente, setAgente] = useState(AGENTE_VAZIO)
  const [erro, setErro] = useState(null)
  const [carregando, setCarregando] = useState(false)

  if (usuario) {
    return <Navigate to="/" replace />
  }

  // Manda o cadastro pro back-end e, se der certo, já faz o login
  // com o mesmo usuário e senha, pra pessoa não ter que digitar de novo.
  async function cadastrar(e) {
    e.preventDefault()
    setErro(null)
    setCarregando(true)
    try {
      if (tipo === 'CLIENTE') {
        const rendimentosConvertidos = rendimentos.map((r) => ({ ...r, valor: Number(r.valor) }))
        await api('/auth/cadastro/cliente', {
          method: 'POST',
          body: { ...cliente, rendimentos: rendimentosConvertidos },
        })
        await login(cliente.login, cliente.senha)
      } else {
        await api('/auth/cadastro/agente', { method: 'POST', body: agente })
        await login(agente.login, agente.senha)
      }
      navigate('/')
    } catch (err) {
      setErro(err)
    } finally {
      setCarregando(false)
    }
  }

  const campos = erro?.campos || {}

  return (
    <div className="tela-acesso">
      <form className="cartao acesso largo" onSubmit={cadastrar}>
        <h1>Criar conta</h1>

        <div className="abas">
          <button type="button" className={tipo === 'CLIENTE' ? 'ativa' : ''} onClick={() => setTipo('CLIENTE')}>
            Sou cliente
          </button>
          <button type="button" className={tipo === 'AGENTE' ? 'ativa' : ''} onClick={() => setTipo('AGENTE')}>
            Sou empresa / banco
          </button>
        </div>

        {erro && <div className="alerta erro">{erro.message}</div>}

        {tipo === 'CLIENTE' ? (
          <>
            <div className="grade">
              <Campo label="Nome" value={cliente.nome} erro={campos.nome} required
                onChange={(e) => setCliente({ ...cliente, nome: e.target.value })} />
              <Campo label="Profissão" value={cliente.profissao} erro={campos.profissao}
                onChange={(e) => setCliente({ ...cliente, profissao: e.target.value })} />
              <Campo label="CPF" value={cliente.cpf} erro={campos.cpf} required placeholder="000.000.000-00"
                onChange={(e) => setCliente({ ...cliente, cpf: e.target.value })} />
              <Campo label="RG" value={cliente.rg} erro={campos.rg} required
                onChange={(e) => setCliente({ ...cliente, rg: e.target.value })} />
            </div>
            <Campo label="Endereço" value={cliente.endereco} erro={campos.endereco} required
              onChange={(e) => setCliente({ ...cliente, endereco: e.target.value })} />

            <RendimentosForm rendimentos={rendimentos} onChange={setRendimentos} />
            {campos.rendimentos && <small className="erro-campo">{campos.rendimentos}</small>}

            <div className="grade">
              <Campo label="Login" value={cliente.login} erro={campos.login} required
                onChange={(e) => setCliente({ ...cliente, login: e.target.value })} />
              <Campo label="Senha" type="password" value={cliente.senha} erro={campos.senha} required minLength={6}
                onChange={(e) => setCliente({ ...cliente, senha: e.target.value })} />
            </div>
          </>
        ) : (
          <>
            <label className="campo">
              <span>Tipo de agente</span>
              <select value={agente.tipo} onChange={(e) => setAgente({ ...agente, tipo: e.target.value })}>
                <option value="EMPRESA">Empresa</option>
                <option value="BANCO">Banco</option>
              </select>
            </label>
            <div className="grade">
              <Campo label="Nome" value={agente.nome} erro={campos.nome} required
                onChange={(e) => setAgente({ ...agente, nome: e.target.value })} />
              <Campo label="CNPJ" value={agente.cnpj} erro={campos.cnpj} required placeholder="00.000.000/0000-00"
                onChange={(e) => setAgente({ ...agente, cnpj: e.target.value })} />
              <Campo label="Login" value={agente.login} erro={campos.login} required
                onChange={(e) => setAgente({ ...agente, login: e.target.value })} />
              <Campo label="Senha" type="password" value={agente.senha} erro={campos.senha} required minLength={6}
                onChange={(e) => setAgente({ ...agente, senha: e.target.value })} />
            </div>
          </>
        )}

        <button className="botao" disabled={carregando}>
          {carregando ? 'Cadastrando...' : 'Cadastrar'}
        </button>
        <p className="rodape-form">
          Já tem conta? <Link to="/login">Entrar</Link>
        </p>
      </form>
    </div>
  )
}
