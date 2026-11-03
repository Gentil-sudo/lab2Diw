import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { api } from '../services/api.js'
import { formatarData, formatarDinheiro, mascaraPlaca } from '../utils/mascaras.js'
import Alerta from '../components/Alerta.jsx'
import Icone from '../components/Icone.jsx'
import Modal from '../components/Modal.jsx'
import StatusPedido, { STATUS } from '../components/StatusPedido.jsx'

const FILTROS = ['TODOS', ...Object.keys(STATUS)]

function hojeIso(somarDias = 0) {
  const data = new Date()
  data.setDate(data.getDate() + somarDias)
  const mes = String(data.getMonth() + 1).padStart(2, '0')
  const dia = String(data.getDate()).padStart(2, '0')
  return `${data.getFullYear()}-${mes}-${dia}`
}

function diasEntre(inicio, fim) {
  if (!inicio || !fim) return 0
  return Math.round((new Date(fim) - new Date(inicio)) / 86400000)
}

export default function Pedidos() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [pedidos, setPedidos] = useState(null)
  const [automoveis, setAutomoveis] = useState([])
  const [filtro, setFiltro] = useState('TODOS')
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')
  const [editando, setEditando] = useState(null)

  function carregar() {
    api('/pedidos').then(setPedidos).catch((err) => setErro(err.message))
  }

  useEffect(() => {
    carregar()
    api('/automoveis').then(setAutomoveis).catch(() => setAutomoveis([]))
  }, [])

  useEffect(() => {
    const automovelId = searchParams.get('automovel')
    if (automovelId) {
      setEditando({ automovelId, dataInicio: '', dataFim: '' })
      setSearchParams({}, { replace: true })
    }
  }, [searchParams, setSearchParams])

  function aoSalvar(mensagem) {
    setEditando(null)
    setSucesso(mensagem)
    carregar()
  }

  async function cancelar(pedido) {
    if (!confirm(`Cancelar o pedido #${pedido.id} do ${pedido.automovel.marca} ${pedido.automovel.modelo}?`)) {
      return
    }
    setErro('')
    setSucesso('')
    try {
      await api(`/pedidos/${pedido.id}/cancelar`, { method: 'PATCH' })
      setSucesso(`Pedido #${pedido.id} cancelado.`)
      carregar()
    } catch (err) {
      setErro(err.message)
    }
  }

  if (!pedidos) {
    return erro ? <Alerta>{erro}</Alerta> : <div className="carregando" role="status"><span className="spinner escuro" /> Carregando...</div>
  }

  const filtrados = filtro === 'TODOS' ? pedidos : pedidos.filter((p) => p.status === filtro)

  return (
    <>
      <div className="cabecalho-pagina com-acao">
        <div>
          <h1>Meus pedidos <span className="contador">{pedidos.length}</span></h1>
          <p>Acompanhe a análise dos seus pedidos de aluguel.</p>
        </div>
        <button className="botao destaque" onClick={() => { setSucesso(''); setEditando({ automovelId: '', dataInicio: '', dataFim: '' }) }}>
          <Icone nome="mais" tamanho={18} /> Novo pedido
        </button>
      </div>

      {erro && <Alerta>{erro}</Alerta>}
      {sucesso && <Alerta tipo="sucesso">{sucesso}</Alerta>}

      <div className="filtros" role="group" aria-label="Filtrar por status">
        {FILTROS.map((f) => {
          const quantidade = f === 'TODOS' ? pedidos.length : pedidos.filter((p) => p.status === f).length
          return (
            <button key={f} className={filtro === f ? 'filtro ativo' : 'filtro'} aria-pressed={filtro === f}
              onClick={() => setFiltro(f)}>
              {f === 'TODOS' ? 'Todos' : STATUS[f].nome} <span>{quantidade}</span>
            </button>
          )
        })}
      </div>

      {filtrados.length === 0 ? (
        <div className="cartao vazio">
          <Icone nome="documento" tamanho={36} />
          <strong>{pedidos.length === 0 ? 'Você ainda não fez nenhum pedido' : 'Nenhum pedido com esse status'}</strong>
          {pedidos.length === 0 && (
            <>
              <span>Escolha um carro e faça seu primeiro pedido de aluguel.</span>
              <Link to="/automoveis" className="botao secundario">Ver automóveis</Link>
            </>
          )}
        </div>
      ) : (
        <div className="lista-pedidos">
          {filtrados.map((p, i) => (
            <article key={p.id} className="cartao pedido entrada" style={{ animationDelay: `${Math.min(i, 8) * 50}ms` }}>
              <div className="pedido-principal">
                <span className="carro-icone"><Icone nome="carro" tamanho={24} /></span>
                <div className="pedido-info">
                  <div className="pedido-titulo">
                    <h3>{p.automovel.marca} {p.automovel.modelo}</h3>
                    <span className="placa pequena">{mascaraPlaca(p.automovel.placa)}</span>
                  </div>
                  <p className="pedido-periodo">
                    <Icone nome="calendario" tamanho={15} />
                    {formatarData(p.dataInicio)} até {formatarData(p.dataFim)} · {p.dias} {p.dias === 1 ? 'dia' : 'dias'}
                  </p>
                  <small className="sem-dado">Pedido #{p.id} feito em {formatarData(p.dataCriacao)}</small>
                </div>
                <div className="pedido-lado">
                  <StatusPedido status={p.status} />
                  <strong className="pedido-valor">{formatarDinheiro(p.valor)}</strong>
                </div>
              </div>

              <p className="pedido-descricao">{STATUS[p.status].descricao}</p>
              {p.parecer && (
                <div className="parecer">
                  <strong>Parecer de {p.agenteNome}:</strong> {p.parecer}
                </div>
              )}

              {(p.status === 'EM_ANALISE' || p.status === 'APROVADO') && (
                <div className="pedido-acoes">
                  {p.status === 'EM_ANALISE' && (
                    <button className="botao secundario"
                      onClick={() => { setSucesso(''); setEditando({ id: p.id, automovelId: String(p.automovel.id), dataInicio: p.dataInicio, dataFim: p.dataFim }) }}>
                      <Icone nome="editar" tamanho={16} /> Modificar
                    </button>
                  )}
                  <button className="botao perigo" onClick={() => cancelar(p)}>
                    <Icone nome="fechar" tamanho={16} /> Cancelar pedido
                  </button>
                </div>
              )}
            </article>
          ))}
        </div>
      )}

      {editando && (
        <FormPedido inicial={editando} automoveis={automoveis} aoFechar={() => setEditando(null)} aoSalvar={aoSalvar} />
      )}
    </>
  )
}

function FormPedido({ inicial, automoveis, aoFechar, aoSalvar }) {
  const [form, setForm] = useState(inicial)
  const [erro, setErro] = useState(null)
  const [salvando, setSalvando] = useState(false)
  const novo = !inicial.id

  const disponiveis = automoveis.filter((a) => a.valorDiaria)
  const escolhido = disponiveis.find((a) => String(a.id) === String(form.automovelId))
  const dias = diasEntre(form.dataInicio, form.dataFim)
  const minimoFim = form.dataInicio
    ? new Date(new Date(form.dataInicio).getTime() + 86400000).toISOString().slice(0, 10)
    : hojeIso(1)

  async function salvar(e) {
    e.preventDefault()
    setErro(null)
    setSalvando(true)
    try {
      const dados = { automovelId: Number(form.automovelId), dataInicio: form.dataInicio, dataFim: form.dataFim }
      if (novo) {
        await api('/pedidos', { method: 'POST', body: dados })
      } else {
        await api(`/pedidos/${inicial.id}`, { method: 'PUT', body: dados })
      }
      aoSalvar(novo ? 'Pedido enviado! Agora é só aguardar a análise.' : 'Pedido modificado com sucesso!')
    } catch (err) {
      setErro(err)
    } finally {
      setSalvando(false)
    }
  }

  const campos = erro?.campos || {}

  return (
    <Modal titulo={novo ? 'Novo pedido de aluguel' : `Modificar pedido #${inicial.id}`} aoFechar={aoFechar}>
      <form onSubmit={salvar}>
        {erro && <Alerta>{erro.message}</Alerta>}

        <div className="campo">
          <label htmlFor="automovel">Automóvel</label>
          <select id="automovel" value={form.automovelId} required autoFocus
            onChange={(e) => setForm({ ...form, automovelId: e.target.value })}>
            <option value="">Selecione um automóvel</option>
            {disponiveis.map((a) => (
              <option key={a.id} value={a.id}>
                {a.marca} {a.modelo} ({a.ano}) · {mascaraPlaca(a.placa)} · {formatarDinheiro(a.valorDiaria)}/dia
              </option>
            ))}
          </select>
          {campos.automovelId && <small className="erro-campo" role="alert">{campos.automovelId}</small>}
        </div>

        <div className="grade">
          <div className="campo">
            <label htmlFor="inicio">Retirada</label>
            <input id="inicio" type="date" value={form.dataInicio} min={hojeIso()} required
              onChange={(e) => setForm({ ...form, dataInicio: e.target.value })} />
            {campos.dataInicio && <small className="erro-campo" role="alert">{campos.dataInicio}</small>}
          </div>
          <div className="campo">
            <label htmlFor="fim">Devolução</label>
            <input id="fim" type="date" value={form.dataFim} min={minimoFim} required
              onChange={(e) => setForm({ ...form, dataFim: e.target.value })} />
            {campos.dataFim && <small className="erro-campo" role="alert">{campos.dataFim}</small>}
          </div>
        </div>

        <div className="resumo-pedido" aria-live="polite">
          {escolhido && dias > 0 ? (
            <>
              <span>{dias} {dias === 1 ? 'dia' : 'dias'} × {formatarDinheiro(escolhido.valorDiaria)}</span>
              <strong>{formatarDinheiro(dias * escolhido.valorDiaria)}</strong>
            </>
          ) : (
            <span>Escolha o carro e as datas para ver o valor estimado.</span>
          )}
        </div>

        <div className="modal-acoes">
          <button type="button" className="botao secundario" onClick={aoFechar}>Voltar</button>
          <button className="botao destaque" disabled={salvando}>
            {salvando ? <><span className="spinner" /> Enviando...</> : <><Icone nome="check" tamanho={18} /> {novo ? 'Enviar pedido' : 'Salvar alterações'}</>}
          </button>
        </div>
      </form>
    </Modal>
  )
}
