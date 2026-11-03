import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { api } from '../services/api.js'
import {
  dinheiroParaNumero, formatarData, formatarDinheiro, mascaraDinheiro, mascaraPercentual, mascaraPlaca,
  numeroParaDinheiro, somenteNumeros,
} from '../utils/mascaras.js'
import Alerta from '../components/Alerta.jsx'
import Icone from '../components/Icone.jsx'
import Modal from '../components/Modal.jsx'

const NOMES_PROPRIETARIO = { CLIENTE: 'Cliente', EMPRESA: 'Empresa', BANCO: 'Banco' }

// Mesma conta do back-end (tabela Price) para o banco ver a parcela antes de confirmar.
function calcularParcela(valor, taxa, parcelas) {
  if (!valor || !parcelas) return 0
  const i = taxa / 100
  return i === 0 ? valor / parcelas : (valor * i) / (1 - Math.pow(1 + i, -parcelas))
}

export default function Contratos() {
  const { usuario } = useAuth()
  const [contratos, setContratos] = useState(null)
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')
  const [financiando, setFinanciando] = useState(null)
  const ehCliente = usuario.perfil === 'CLIENTE'
  const ehBanco = usuario.perfil === 'BANCO'

  function carregar() {
    api('/contratos').then(setContratos).catch((err) => setErro(err.message))
  }

  useEffect(carregar, [])

  function aoConceder(contrato) {
    setFinanciando(null)
    setSucesso(`Crédito concedido ao contrato #${contrato.id}.`)
    carregar()
  }

  if (!contratos) {
    return erro ? <Alerta>{erro}</Alerta> : <div className="carregando" role="status"><span className="spinner escuro" /> Carregando...</div>
  }

  return (
    <>
      <div className="cabecalho-pagina">
        <h1>{ehCliente ? 'Meus contratos' : 'Contratos'}</h1>
        <p>
          {ehCliente
            ? 'Contratos de aluguel dos seus pedidos aprovados e os créditos concedidos pelos bancos.'
            : 'Contratos executados a partir dos pedidos aprovados.'}
          {ehBanco && ' Como banco, você pode conceder crédito aos contratos.'}
        </p>
      </div>

      {erro && <Alerta>{erro}</Alerta>}
      {sucesso && <Alerta tipo="sucesso">{sucesso}</Alerta>}

      {contratos.length === 0 ? (
        <div className="cartao vazio">
          <Icone nome="carteira" tamanho={36} />
          <strong>Nenhum contrato ainda</strong>
          <span>{ehCliente ? 'Quando um pedido seu for aprovado e contratado, ele aparece aqui.' : 'Execute o contrato de um pedido aprovado na Análise de pedidos.'}</span>
        </div>
      ) : (
        <div className="lista-pedidos">
          {contratos.map((c, i) => (
            <article key={c.id} className="cartao pedido entrada" style={{ animationDelay: `${Math.min(i, 8) * 50}ms` }}>
              <div className="pedido-principal">
                <span className="carro-icone"><Icone nome="documento" tamanho={22} /></span>
                <div className="pedido-info">
                  <div className="pedido-titulo">
                    <h3>Contrato #{c.id}</h3>
                    <small className="sem-dado">Pedido #{c.pedido.id} · assinado em {formatarData(c.dataAssinatura)}</small>
                  </div>
                  <p className="pedido-periodo">
                    <Icone nome="carro" tamanho={15} />
                    {c.pedido.automovel.marca} {c.pedido.automovel.modelo}
                    <span className="placa pequena">{mascaraPlaca(c.pedido.automovel.placa)}</span>
                  </p>
                  <p className="pedido-periodo">
                    <Icone nome="calendario" tamanho={15} />
                    {formatarData(c.pedido.dataInicio)} até {formatarData(c.pedido.dataFim)} · {c.pedido.dias} {c.pedido.dias === 1 ? 'dia' : 'dias'}
                  </p>
                  <p className="pedido-periodo">
                    <Icone nome="usuario" tamanho={15} />
                    Cliente {c.pedido.clienteNome} · assinado por {c.agenteNome}
                  </p>
                </div>
                <div className="pedido-lado">
                  <span className="etiqueta">Proprietário: {NOMES_PROPRIETARIO[c.tipoProprietario]}</span>
                  <strong className="pedido-valor">{formatarDinheiro(c.pedido.valor)}</strong>
                </div>
              </div>

              {c.credito ? (
                <div className="credito">
                  <strong><Icone nome="banco" tamanho={16} /> Crédito concedido por {c.credito.bancoNome}</strong>
                  <div className="analise-resumo">
                    <div><span>Valor financiado</span><strong>{formatarDinheiro(c.credito.valor)}</strong></div>
                    <div><span>Juros</span><strong>{c.credito.taxaJuros.toLocaleString('pt-BR')}% a.m.</strong></div>
                    <div><span>{c.credito.parcelas}x de</span><strong>{formatarDinheiro(c.credito.valorParcela)}</strong></div>
                  </div>
                  <small className="sem-dado">Total a pagar: {formatarDinheiro(c.credito.valorTotal)}</small>
                </div>
              ) : ehBanco && (
                <div className="pedido-acoes">
                  <button className="botao destaque" onClick={() => { setSucesso(''); setFinanciando(c) }}>
                    <Icone nome="carteira" tamanho={16} /> Conceder crédito
                  </button>
                </div>
              )}
            </article>
          ))}
        </div>
      )}

      {financiando && <FormCredito contrato={financiando} aoFechar={() => setFinanciando(null)} aoConcluir={aoConceder} />}
    </>
  )
}

function FormCredito({ contrato, aoFechar, aoConcluir }) {
  const [form, setForm] = useState({ valor: numeroParaDinheiro(contrato.pedido.valor), taxaJuros: '1,50', parcelas: '6' })
  const [erro, setErro] = useState(null)
  const [salvando, setSalvando] = useState(false)

  const valor = dinheiroParaNumero(form.valor)
  const taxa = dinheiroParaNumero(form.taxaJuros)
  const parcelas = Number(form.parcelas) || 0
  const parcela = calcularParcela(valor, taxa, parcelas)

  async function salvar(e) {
    e.preventDefault()
    setErro(null)
    setSalvando(true)
    try {
      const resposta = await api(`/contratos/${contrato.id}/credito`, {
        method: 'POST',
        body: { valor, taxaJuros: taxa, parcelas },
      })
      aoConcluir(resposta)
    } catch (err) {
      setErro(err)
    } finally {
      setSalvando(false)
    }
  }

  const campos = erro?.campos || {}

  return (
    <Modal titulo={`Conceder crédito ao contrato #${contrato.id}`} aoFechar={aoFechar}>
      <form onSubmit={salvar}>
        {erro && <Alerta>{erro.message}</Alerta>}
        <p className="dica">
          {contrato.pedido.clienteNome} · valor do contrato {formatarDinheiro(contrato.pedido.valor)}
        </p>
        <div className="campo">
          <label htmlFor="credito-valor">Valor financiado (R$)</label>
          <input id="credito-valor" inputMode="numeric" value={form.valor} required placeholder="0,00"
            aria-invalid={campos.valor ? true : undefined}
            onChange={(e) => setForm({ ...form, valor: mascaraDinheiro(e.target.value) })} />
          {campos.valor && <small className="erro-campo" role="alert">{campos.valor}</small>}
        </div>
        <div className="grade">
          <div className="campo">
            <label htmlFor="credito-taxa">Juros ao mês (%)</label>
            <input id="credito-taxa" inputMode="numeric" value={form.taxaJuros} required placeholder="0,00"
              aria-invalid={campos.taxaJuros ? true : undefined}
              onChange={(e) => setForm({ ...form, taxaJuros: mascaraPercentual(e.target.value) || '0,00' })} />
            {campos.taxaJuros && <small className="erro-campo" role="alert">{campos.taxaJuros}</small>}
          </div>
          <div className="campo">
            <label htmlFor="credito-parcelas">Parcelas</label>
            <input id="credito-parcelas" inputMode="numeric" value={form.parcelas} required placeholder="1 a 72"
              aria-invalid={campos.parcelas ? true : undefined}
              onChange={(e) => setForm({ ...form, parcelas: somenteNumeros(e.target.value, 2) })} />
            {campos.parcelas && <small className="erro-campo" role="alert">{campos.parcelas}</small>}
          </div>
        </div>

        <div className="analise-resumo">
          <div><span>Parcela</span><strong>{formatarDinheiro(parcela)}</strong></div>
          <div><span>Total a pagar</span><strong>{formatarDinheiro(parcela * parcelas)}</strong></div>
          <div><span>Juros totais</span><strong>{formatarDinheiro(Math.max(parcela * parcelas - valor, 0))}</strong></div>
        </div>

        <div className="modal-acoes">
          <button type="button" className="botao secundario" onClick={aoFechar}>Voltar</button>
          <button className="botao destaque" disabled={salvando}>
            {salvando ? <><span className="spinner" /> Salvando...</> : <><Icone nome="check" tamanho={18} /> Conceder crédito</>}
          </button>
        </div>
      </form>
    </Modal>
  )
}
