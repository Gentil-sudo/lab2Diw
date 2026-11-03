import { useEffect, useState } from 'react'
import { api } from '../services/api.js'
import {
  dinheiroParaNumero, formatarData, formatarDinheiro, iniciais, mascaraDinheiro, mascaraPlaca, numeroParaDinheiro,
} from '../utils/mascaras.js'
import Alerta from '../components/Alerta.jsx'
import Icone from '../components/Icone.jsx'
import Modal from '../components/Modal.jsx'
import StatusPedido, { STATUS } from '../components/StatusPedido.jsx'

const FILTROS = ['EM_ANALISE', 'APROVADO', 'REPROVADO', 'CONTRATADO', 'CANCELADO', 'TODOS']

function hojeIso() {
  const data = new Date()
  return `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, '0')}-${String(data.getDate()).padStart(2, '0')}`
}

export default function AnalisePedidos() {
  const [pedidos, setPedidos] = useState(null)
  const [filtro, setFiltro] = useState('EM_ANALISE')
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')
  const [ajustando, setAjustando] = useState(null)
  const [avaliando, setAvaliando] = useState(null)

  function carregar() {
    api('/pedidos').then(setPedidos).catch((err) => setErro(err.message))
  }

  useEffect(carregar, [])

  function aoConcluir(mensagem) {
    setAjustando(null)
    setAvaliando(null)
    setSucesso(mensagem)
    carregar()
  }

  if (!pedidos) {
    return erro ? <Alerta>{erro}</Alerta> : <div className="carregando" role="status"><span className="spinner escuro" /> Carregando...</div>
  }

  const filtrados = filtro === 'TODOS' ? pedidos : pedidos.filter((p) => p.status === filtro)

  return (
    <>
      <div className="cabecalho-pagina">
        <h1>Análise de pedidos</h1>
        <p>Avalie financeiramente os pedidos dos clientes. Pedidos aprovados seguem para a execução do contrato.</p>
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
          <Icone nome="escudo" tamanho={36} />
          <strong>{filtro === 'EM_ANALISE' ? 'Nenhum pedido aguardando análise' : 'Nenhum pedido com esse status'}</strong>
          <span>Os pedidos feitos pelos clientes aparecem aqui.</span>
        </div>
      ) : (
        <div className="lista-pedidos">
          {filtrados.map((p, i) => (
            <article key={p.id} className="cartao pedido entrada" style={{ animationDelay: `${Math.min(i, 8) * 50}ms` }}>
              <div className="pedido-principal">
                <div className="avatar grande" aria-hidden="true">{iniciais(p.clienteNome)}</div>
                <div className="pedido-info">
                  <div className="pedido-titulo">
                    <h3>{p.clienteNome}</h3>
                    <small className="sem-dado">Pedido #{p.id} · {formatarData(p.dataCriacao)}</small>
                  </div>
                  <p className="pedido-periodo">
                    <Icone nome="carro" tamanho={15} />
                    {p.automovel.marca} {p.automovel.modelo}
                    <span className="placa pequena">{mascaraPlaca(p.automovel.placa)}</span>
                  </p>
                  <p className="pedido-periodo">
                    <Icone nome="calendario" tamanho={15} />
                    {formatarData(p.dataInicio)} até {formatarData(p.dataFim)} · {p.dias} {p.dias === 1 ? 'dia' : 'dias'}
                  </p>
                </div>
                <div className="pedido-lado">
                  <StatusPedido status={p.status} />
                  <strong className="pedido-valor">{formatarDinheiro(p.valor)}</strong>
                </div>
              </div>

              {p.parecer && (
                <div className="parecer">
                  <strong>Parecer de {p.agenteNome}</strong>
                  {p.dataAvaliacao && <small className="sem-dado"> em {formatarData(p.dataAvaliacao)}</small>}: {p.parecer}
                </div>
              )}

              {p.status === 'EM_ANALISE' && (
                <div className="pedido-acoes">
                  <button className="botao secundario" onClick={() => { setSucesso(''); setAjustando(p) }}>
                    <Icone nome="editar" tamanho={16} /> Ajustar
                  </button>
                  <button className="botao destaque" onClick={() => { setSucesso(''); setAvaliando(p) }}>
                    <Icone nome="escudo" tamanho={16} /> Avaliar
                  </button>
                </div>
              )}
            </article>
          ))}
        </div>
      )}

      {ajustando && <FormAjuste pedido={ajustando} aoFechar={() => setAjustando(null)} aoConcluir={aoConcluir} />}
      {avaliando && <FormAvaliacao pedido={avaliando} aoFechar={() => setAvaliando(null)} aoConcluir={aoConcluir} />}
    </>
  )
}

function FormAjuste({ pedido, aoFechar, aoConcluir }) {
  const [form, setForm] = useState({
    dataInicio: pedido.dataInicio,
    dataFim: pedido.dataFim,
    valor: numeroParaDinheiro(pedido.valor),
  })
  const [erro, setErro] = useState(null)
  const [salvando, setSalvando] = useState(false)

  async function salvar(e) {
    e.preventDefault()
    setErro(null)
    setSalvando(true)
    try {
      await api(`/pedidos/${pedido.id}/ajustar`, {
        method: 'PATCH',
        body: { ...form, valor: dinheiroParaNumero(form.valor) },
      })
      aoConcluir(`Pedido #${pedido.id} ajustado.`)
    } catch (err) {
      setErro(err)
    } finally {
      setSalvando(false)
    }
  }

  const campos = erro?.campos || {}

  return (
    <Modal titulo={`Ajustar pedido #${pedido.id}`} aoFechar={aoFechar}>
      <form onSubmit={salvar}>
        {erro && <Alerta>{erro.message}</Alerta>}
        <p className="dica">
          {pedido.automovel.marca} {pedido.automovel.modelo} · diária de {formatarDinheiro(pedido.automovel.valorDiaria || 0)}
        </p>
        <div className="grade">
          <div className="campo">
            <label htmlFor="ajuste-inicio">Retirada</label>
            <input id="ajuste-inicio" type="date" value={form.dataInicio} min={hojeIso()} required
              onChange={(e) => setForm({ ...form, dataInicio: e.target.value })} />
          </div>
          <div className="campo">
            <label htmlFor="ajuste-fim">Devolução</label>
            <input id="ajuste-fim" type="date" value={form.dataFim} min={form.dataInicio} required
              onChange={(e) => setForm({ ...form, dataFim: e.target.value })} />
          </div>
        </div>
        <div className="campo">
          <label htmlFor="ajuste-valor">Valor total (R$)</label>
          <input id="ajuste-valor" inputMode="numeric" value={form.valor} required placeholder="0,00"
            aria-invalid={campos.valor ? true : undefined}
            onChange={(e) => setForm({ ...form, valor: mascaraDinheiro(e.target.value) })} />
          {campos.valor && <small className="erro-campo" role="alert">{campos.valor}</small>}
        </div>
        <div className="modal-acoes">
          <button type="button" className="botao secundario" onClick={aoFechar}>Voltar</button>
          <button className="botao destaque" disabled={salvando}>
            {salvando ? <><span className="spinner" /> Salvando...</> : <><Icone nome="check" tamanho={18} /> Salvar ajuste</>}
          </button>
        </div>
      </form>
    </Modal>
  )
}

function FormAvaliacao({ pedido, aoFechar, aoConcluir }) {
  const [cliente, setCliente] = useState(null)
  const [parecer, setParecer] = useState('')
  const [erro, setErro] = useState(null)
  const [enviando, setEnviando] = useState(null)

  useEffect(() => {
    api(`/clientes/${pedido.clienteId}`).then(setCliente).catch(setErro)
  }, [pedido.clienteId])

  // Quanto o aluguel representa da renda mensal do cliente (ajuda o agente a decidir).
  const renda = cliente ? cliente.rendimentos.reduce((soma, r) => soma + r.valor, 0) : 0
  const comprometimento = renda > 0 ? (pedido.valor / renda) * 100 : null

  async function avaliar(aprovado) {
    if (!parecer.trim()) {
      setErro({ message: 'Escreva o parecer antes de avaliar.', campos: {} })
      return
    }
    setErro(null)
    setEnviando(aprovado ? 'aprovar' : 'reprovar')
    try {
      await api(`/pedidos/${pedido.id}/avaliar`, { method: 'PATCH', body: { aprovado, parecer } })
      aoConcluir(`Pedido #${pedido.id} ${aprovado ? 'aprovado' : 'reprovado'}.`)
    } catch (err) {
      setErro(err)
    } finally {
      setEnviando(null)
    }
  }

  return (
    <Modal titulo={`Avaliar pedido #${pedido.id}`} aoFechar={aoFechar}>
      {erro && <Alerta>{erro.message}</Alerta>}

      <div className="analise-resumo">
        <div>
          <span>Valor do pedido</span>
          <strong>{formatarDinheiro(pedido.valor)}</strong>
        </div>
        <div>
          <span>Renda mensal do cliente</span>
          <strong>{cliente ? formatarDinheiro(renda) : '...'}</strong>
        </div>
        <div>
          <span>Comprometimento</span>
          <strong className={comprometimento === null ? '' : comprometimento > 30 ? 'texto-perigo' : 'texto-sucesso'}>
            {comprometimento === null ? 'Sem renda' : `${comprometimento.toFixed(1)}%`}
          </strong>
        </div>
      </div>

      {cliente && (
        <div className="analise-cliente">
          <p><strong>{cliente.nome}</strong> · {cliente.profissao || 'Profissão não informada'}</p>
          {cliente.rendimentos.length === 0 ? (
            <p className="sem-dado">O cliente não informou rendimentos.</p>
          ) : (
            cliente.rendimentos.map((r) => (
              <div key={r.id} className="rendimento-item">
                <span>{r.entidadeEmpregadora}</span>
                <span>{formatarDinheiro(r.valor)}</span>
              </div>
            ))
          )}
        </div>
      )}

      <div className="campo">
        <label htmlFor="parecer">Parecer financeiro</label>
        <textarea id="parecer" rows={4} maxLength={500} value={parecer} autoFocus
          placeholder="Justifique a decisão com base na renda e no valor do pedido."
          onChange={(e) => setParecer(e.target.value)} />
        <small className="sem-dado">{parecer.length}/500</small>
      </div>

      <div className="modal-acoes">
        <button type="button" className="botao perigo" disabled={enviando !== null} onClick={() => avaliar(false)}>
          {enviando === 'reprovar' ? <><span className="spinner escuro" /> Enviando...</> : <><Icone nome="fechar" tamanho={16} /> Reprovar</>}
        </button>
        <button type="button" className="botao destaque" disabled={enviando !== null} onClick={() => avaliar(true)}>
          {enviando === 'aprovar' ? <><span className="spinner" /> Enviando...</> : <><Icone nome="check" tamanho={16} /> Aprovar</>}
        </button>
      </div>
    </Modal>
  )
}
