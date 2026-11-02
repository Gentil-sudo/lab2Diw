import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { api } from '../services/api.js'
import { mascaraCnpj, mascaraCpf } from '../utils/mascaras.js'
import Alerta from '../components/Alerta.jsx'
import Campo from '../components/Campo.jsx'
import Icone from '../components/Icone.jsx'
import RendimentosForm from '../components/RendimentosForm.jsx'
import TelaAcesso from '../components/TelaAcesso.jsx'

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

  function trocarTipo(novoTipo) {
    setTipo(novoTipo)
    setErro(null)
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
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } finally {
      setCarregando(false)
    }
  }

  const campos = erro?.campos || {}

  return (
    <TelaAcesso>
      <form className="form-acesso largo" onSubmit={cadastrar}>
        <h2>Criar conta</h2>
        <p className="dica">Escolha o tipo de conta e preencha seus dados.</p>

        <div className="abas" role="tablist" aria-label="Tipo de conta">
          <button type="button" role="tab" aria-selected={tipo === 'CLIENTE'}
            className={tipo === 'CLIENTE' ? 'ativa' : ''} onClick={() => trocarTipo('CLIENTE')}>
            <Icone nome="usuario" tamanho={18} /> Sou cliente
          </button>
          <button type="button" role="tab" aria-selected={tipo === 'AGENTE'}
            className={tipo === 'AGENTE' ? 'ativa' : ''} onClick={() => trocarTipo('AGENTE')}>
            <Icone nome="empresa" tamanho={18} /> Sou empresa / banco
          </button>
        </div>

        {erro && <Alerta>{erro.message}</Alerta>}

        {tipo === 'CLIENTE' ? (
          <>
            <h3 className="secao-titulo">Dados pessoais</h3>
            <Campo label="Nome completo" value={cliente.nome} erro={campos.nome} required autoComplete="name"
              onChange={(e) => setCliente({ ...cliente, nome: e.target.value })} />
            <div className="grade">
              <Campo label="CPF" value={cliente.cpf} erro={campos.cpf} required
                placeholder="000.000.000-00" inputMode="numeric" maxLength={14}
                onChange={(e) => setCliente({ ...cliente, cpf: mascaraCpf(e.target.value) })} />
              <Campo label="RG" value={cliente.rg} erro={campos.rg} required maxLength={20}
                onChange={(e) => setCliente({ ...cliente, rg: e.target.value })} />
            </div>
            <div className="grade">
              <Campo label="Endereço" value={cliente.endereco} erro={campos.endereco} required autoComplete="street-address"
                onChange={(e) => setCliente({ ...cliente, endereco: e.target.value })} />
              <Campo label="Profissão" value={cliente.profissao} erro={campos.profissao}
                onChange={(e) => setCliente({ ...cliente, profissao: e.target.value })} />
            </div>

            <RendimentosForm rendimentos={rendimentos} onChange={setRendimentos} />
            {campos.rendimentos && <small className="erro-campo" role="alert">{campos.rendimentos}</small>}

            <h3 className="secao-titulo">Acesso</h3>
            <div className="grade">
              <Campo label="Login" value={cliente.login} erro={campos.login} required autoComplete="username"
                onChange={(e) => setCliente({ ...cliente, login: e.target.value })} />
              <Campo label="Senha" type="password" value={cliente.senha} erro={campos.senha} required minLength={6}
                placeholder="Mínimo 6 caracteres" autoComplete="new-password"
                onChange={(e) => setCliente({ ...cliente, senha: e.target.value })} />
            </div>
          </>
        ) : (
          <>
            <h3 className="secao-titulo">Dados da instituição</h3>
            <div className="opcoes-tipo" role="radiogroup" aria-label="Tipo de agente">
              <label className={agente.tipo === 'EMPRESA' ? 'opcao marcada' : 'opcao'}>
                <input type="radio" name="tipo" value="EMPRESA" checked={agente.tipo === 'EMPRESA'}
                  onChange={() => setAgente({ ...agente, tipo: 'EMPRESA' })} />
                <span className="opcao-icone"><Icone nome="empresa" tamanho={20} /></span>
                <strong>Empresa</strong>
                <small>Locadoras e empresas parceiras</small>
              </label>
              <label className={agente.tipo === 'BANCO' ? 'opcao marcada' : 'opcao'}>
                <input type="radio" name="tipo" value="BANCO" checked={agente.tipo === 'BANCO'}
                  onChange={() => setAgente({ ...agente, tipo: 'BANCO' })} />
                <span className="opcao-icone"><Icone nome="banco" tamanho={20} /></span>
                <strong>Banco</strong>
                <small>Também pode conceder crédito</small>
              </label>
            </div>
            <div className="grade">
              <Campo label="Nome" value={agente.nome} erro={campos.nome} required autoComplete="organization"
                onChange={(e) => setAgente({ ...agente, nome: e.target.value })} />
              <Campo label="CNPJ" value={agente.cnpj} erro={campos.cnpj} required
                placeholder="00.000.000/0000-00" inputMode="numeric" maxLength={18}
                onChange={(e) => setAgente({ ...agente, cnpj: mascaraCnpj(e.target.value) })} />
            </div>

            <h3 className="secao-titulo">Acesso</h3>
            <div className="grade">
              <Campo label="Login" value={agente.login} erro={campos.login} required autoComplete="username"
                onChange={(e) => setAgente({ ...agente, login: e.target.value })} />
              <Campo label="Senha" type="password" value={agente.senha} erro={campos.senha} required minLength={6}
                placeholder="Mínimo 6 caracteres" autoComplete="new-password"
                onChange={(e) => setAgente({ ...agente, senha: e.target.value })} />
            </div>
          </>
        )}

        <button className="botao destaque grande" disabled={carregando}>
          {carregando ? <><span className="spinner" /> Criando conta...</> : 'Criar conta'}
        </button>
        <p className="rodape-form">
          Já tem conta? <Link to="/login">Entrar</Link>
        </p>
      </form>
    </TelaAcesso>
  )
}
