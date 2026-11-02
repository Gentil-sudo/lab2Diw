import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { api } from '../services/api.js'
import Campo from '../components/Campo.jsx'
import RendimentosForm from '../components/RendimentosForm.jsx'

export default function MeusDados() {
  const { usuario, logout } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState(null)
  const [rendimentos, setRendimentos] = useState([])
  const [erro, setErro] = useState(null)
  const [sucesso, setSucesso] = useState('')
  const [salvando, setSalvando] = useState(false)

  useEffect(() => {
    api('/clientes/me')
      .then((dados) => {
        setForm(dados)
        setRendimentos(dados.rendimentos)
      })
      .catch(setErro)
  }, [])

  async function salvar(e) {
    e.preventDefault()
    setErro(null)
    setSucesso('')
    setSalvando(true)
    try {
      const dados = await api(`/clientes/${usuario.id}`, {
        method: 'PUT',
        body: {
          rg: form.rg,
          cpf: form.cpf,
          nome: form.nome,
          endereco: form.endereco,
          profissao: form.profissao,
          rendimentos: rendimentos.map((r) => ({ entidadeEmpregadora: r.entidadeEmpregadora, valor: Number(r.valor) })),
        },
      })
      setForm(dados)
      setRendimentos(dados.rendimentos)
      setSucesso('Dados atualizados com sucesso!')
    } catch (err) {
      setErro(err)
    } finally {
      setSalvando(false)
    }
  }

  async function excluirConta() {
    if (!confirm('Tem certeza que deseja excluir sua conta? Essa ação não pode ser desfeita.')) {
      return
    }
    try {
      await api(`/clientes/${usuario.id}`, { method: 'DELETE' })
      logout()
      navigate('/login')
    } catch (err) {
      setErro(err)
    }
  }

  if (!form) {
    return erro ? <div className="alerta erro">{erro.message}</div> : <p>Carregando...</p>
  }

  const campos = erro?.campos || {}

  return (
    <>
      <h2>Meus dados</h2>

      <form className="cartao" onSubmit={salvar}>
        {erro && <div className="alerta erro">{erro.message}</div>}
        {sucesso && <div className="alerta sucesso">{sucesso}</div>}

        <div className="grade">
          <Campo label="Nome" value={form.nome} erro={campos.nome} required
            onChange={(e) => setForm({ ...form, nome: e.target.value })} />
          <Campo label="Profissão" value={form.profissao || ''} erro={campos.profissao}
            onChange={(e) => setForm({ ...form, profissao: e.target.value })} />
          <Campo label="CPF" value={form.cpf} erro={campos.cpf} required
            onChange={(e) => setForm({ ...form, cpf: e.target.value })} />
          <Campo label="RG" value={form.rg} erro={campos.rg} required
            onChange={(e) => setForm({ ...form, rg: e.target.value })} />
        </div>
        <Campo label="Endereço" value={form.endereco} erro={campos.endereco} required
          onChange={(e) => setForm({ ...form, endereco: e.target.value })} />
        <Campo label="Login" value={form.login} disabled />

        <RendimentosForm rendimentos={rendimentos} onChange={setRendimentos} />

        <div className="acoes">
          <button className="botao" disabled={salvando}>{salvando ? 'Salvando...' : 'Salvar alterações'}</button>
          <button type="button" className="botao perigo" onClick={excluirConta}>Excluir conta</button>
        </div>
      </form>
    </>
  )
}
