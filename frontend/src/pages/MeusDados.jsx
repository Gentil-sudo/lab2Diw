import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { api } from '../services/api.js'
import { dinheiroParaNumero, mascaraCep, mascaraCpf, numeroParaDinheiro } from '../utils/mascaras.js'
import Alerta from '../components/Alerta.jsx'
import Campo from '../components/Campo.jsx'
import EnderecoForm, { ENDERECO_VAZIO } from '../components/EnderecoForm.jsx'
import Icone from '../components/Icone.jsx'
import RendimentosForm from '../components/RendimentosForm.jsx'

export default function MeusDados() {
  const { usuario, logout } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState(null)
  const [endereco, setEndereco] = useState(ENDERECO_VAZIO)
  const [rendimentos, setRendimentos] = useState([])
  const [erro, setErro] = useState(null)
  const [sucesso, setSucesso] = useState('')
  const [salvando, setSalvando] = useState(false)

  function preencher(dados) {
    const enderecoSalvo = { ...ENDERECO_VAZIO, ...dados.endereco }
    setForm({ ...dados, cpf: mascaraCpf(dados.cpf) })
    setEndereco({ ...enderecoSalvo, cep: mascaraCep(enderecoSalvo.cep || '') })
    setRendimentos(dados.rendimentos.map((r) => ({ ...r, valor: numeroParaDinheiro(r.valor) })))
  }

  useEffect(() => {
    api('/clientes/me').then(preencher).catch(setErro)
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
          endereco,
          profissao: form.profissao,
          rendimentos: rendimentos.map((r) => ({ entidadeEmpregadora: r.entidadeEmpregadora, valor: dinheiroParaNumero(r.valor) })),
        },
      })
      preencher(dados)
      setSucesso('Dados atualizados com sucesso!')
    } catch (err) {
      setErro(err)
    } finally {
      setSalvando(false)
      window.scrollTo({ top: 0, behavior: 'smooth' })
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
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  if (!form) {
    return erro ? <Alerta>{erro.message}</Alerta> : <Carregando />
  }

  const campos = erro?.campos || {}

  return (
    <>
      <div className="cabecalho-pagina">
        <h1>Meus dados</h1>
        <p>Mantenha seu cadastro atualizado. Os rendimentos são usados na análise financeira dos pedidos.</p>
      </div>

      {erro && <Alerta>{erro.message}</Alerta>}
      {sucesso && <Alerta tipo="sucesso">{sucesso}</Alerta>}

      <form onSubmit={salvar}>
        <section className="cartao secao">
          <div className="secao-info">
            <span className="secao-icone"><Icone nome="usuario" tamanho={20} /></span>
            <h3>Dados pessoais</h3>
            <p>Suas informações de identificação.</p>
          </div>
          <div className="secao-campos">
            <Campo label="Nome completo" value={form.nome} erro={campos.nome} required
              onChange={(e) => setForm({ ...form, nome: e.target.value })} />
            <div className="grade">
              <Campo label="CPF" value={form.cpf} erro={campos.cpf} required inputMode="numeric" maxLength={14}
                onChange={(e) => setForm({ ...form, cpf: mascaraCpf(e.target.value) })} />
              <Campo label="RG" value={form.rg} erro={campos.rg} required maxLength={20}
                onChange={(e) => setForm({ ...form, rg: e.target.value })} />
            </div>
            <div className="grade">
              <Campo label="Profissão" value={form.profissao || ''} erro={campos.profissao}
                onChange={(e) => setForm({ ...form, profissao: e.target.value })} />
              <Campo label="Login" value={form.login} disabled />
            </div>
          </div>
        </section>

        <section className="cartao secao">
          <div className="secao-info">
            <span className="secao-icone"><Icone nome="inicio" tamanho={20} /></span>
            <h3>Endereço</h3>
            <p>Digite o CEP para preencher o restante automaticamente.</p>
          </div>
          <div className="secao-campos">
            <EnderecoForm endereco={endereco} onChange={setEndereco} campos={campos} />
          </div>
        </section>

        <section className="cartao secao">
          <div className="secao-info">
            <span className="secao-icone"><Icone nome="carteira" tamanho={20} /></span>
            <h3>Rendimentos</h3>
            <p>Informe até 3 fontes de renda e o valor mensal de cada uma.</p>
          </div>
          <div className="secao-campos">
            <RendimentosForm rendimentos={rendimentos} onChange={setRendimentos} />
          </div>
        </section>

        <div className="barra-acoes">
          <button className="botao destaque" disabled={salvando}>
            {salvando ? <><span className="spinner" /> Salvando...</> : <><Icone nome="check" tamanho={18} /> Salvar alterações</>}
          </button>
        </div>
      </form>

      <section className="cartao secao zona-perigo">
        <div className="secao-info">
          <span className="secao-icone perigo"><Icone nome="lixeira" tamanho={20} /></span>
          <h3>Excluir conta</h3>
          <p>Remove seu cadastro do sistema. Só é possível se você ainda não fez pedidos.</p>
        </div>
        <div className="secao-campos centralizado">
          <button type="button" className="botao perigo" onClick={excluirConta}>
            <Icone nome="lixeira" tamanho={18} /> Excluir minha conta
          </button>
        </div>
      </section>
    </>
  )
}

function Carregando() {
  return (
    <div className="carregando" role="status">
      <span className="spinner escuro" /> Carregando...
    </div>
  )
}
