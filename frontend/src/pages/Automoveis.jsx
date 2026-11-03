import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { api } from '../services/api.js'
import { dinheiroParaNumero, formatarDinheiro, mascaraDinheiro, mascaraPlaca, numeroParaDinheiro, somenteNumeros } from '../utils/mascaras.js'
import Alerta from '../components/Alerta.jsx'
import Campo from '../components/Campo.jsx'
import Icone from '../components/Icone.jsx'
import Modal from '../components/Modal.jsx'

const FORM_VAZIO = { matricula: '', ano: '', marca: '', modelo: '', placa: '', valorDiaria: '' }
const NOMES_TIPO = { CLIENTE: 'Cliente', EMPRESA: 'Empresa', BANCO: 'Banco' }

export default function Automoveis() {
  const { usuario } = useAuth()
  const ehAgente = usuario.perfil !== 'CLIENTE'
  const [automoveis, setAutomoveis] = useState(null)
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')
  const [busca, setBusca] = useState('')
  const [editando, setEditando] = useState(null)

  function carregar() {
    api('/automoveis').then(setAutomoveis).catch((err) => setErro(err.message))
  }

  useEffect(carregar, [])

  function aoSalvar(mensagem) {
    setEditando(null)
    setSucesso(mensagem)
    carregar()
  }

  async function excluir(automovel) {
    if (!confirm(`Remover o ${automovel.marca} ${automovel.modelo} (${mascaraPlaca(automovel.placa)})?`)) {
      return
    }
    setErro('')
    setSucesso('')
    try {
      await api(`/automoveis/${automovel.id}`, { method: 'DELETE' })
      setSucesso('Automóvel removido.')
      carregar()
    } catch (err) {
      setErro(err.message)
    }
  }

  if (!automoveis) {
    return erro ? <Alerta>{erro}</Alerta> : <div className="carregando" role="status"><span className="spinner escuro" /> Carregando...</div>
  }

  const termo = busca.toLowerCase().replace('-', '')
  const filtrados = automoveis.filter((a) =>
    `${a.marca} ${a.modelo} ${a.placa}`.toLowerCase().includes(termo),
  )

  return (
    <>
      <div className="cabecalho-pagina com-acao">
        <div>
          <h1>Automóveis <span className="contador">{automoveis.length}</span></h1>
          <p>{ehAgente ? 'Cadastre e gerencie os automóveis da sua frota.' : 'Conheça os automóveis disponíveis para aluguel.'}</p>
        </div>
        <div className="acoes-cabecalho">
          <div className="busca">
            <Icone nome="busca" tamanho={18} />
            <input aria-label="Buscar automóvel" placeholder="Buscar por marca, modelo ou placa" value={busca}
              onChange={(e) => setBusca(e.target.value)} />
          </div>
          {ehAgente && (
            <button className="botao destaque" onClick={() => { setSucesso(''); setEditando(FORM_VAZIO) }}>
              <Icone nome="mais" tamanho={18} /> Novo automóvel
            </button>
          )}
        </div>
      </div>

      {erro && <Alerta>{erro}</Alerta>}
      {sucesso && <Alerta tipo="sucesso">{sucesso}</Alerta>}

      {filtrados.length === 0 ? (
        <div className="cartao vazio">
          <Icone nome="carro" tamanho={36} />
          <strong>{automoveis.length === 0 ? 'Nenhum automóvel cadastrado ainda' : 'Nenhum automóvel encontrado'}</strong>
          <span>
            {automoveis.length > 0 ? 'Tente buscar por outro termo.'
              : ehAgente ? 'Clique em "Novo automóvel" para cadastrar o primeiro.' : 'Volte mais tarde para ver os carros disponíveis.'}
          </span>
        </div>
      ) : (
        <div className="grade-carros">
          {filtrados.map((a, i) => {
            const ehMeu = a.proprietarioId === usuario.id
            return (
              <article key={a.id} className="cartao carro entrada" style={{ animationDelay: `${Math.min(i, 8) * 50}ms` }}>
                <div className="carro-topo">
                  <span className="carro-icone"><Icone nome="carro" tamanho={26} /></span>
                  <span className="placa">{mascaraPlaca(a.placa)}</span>
                </div>
                <h3>{a.marca} {a.modelo}</h3>
                <p className="diaria">
                  {a.valorDiaria ? <><strong>{formatarDinheiro(a.valorDiaria)}</strong> / dia</> : <span className="sem-dado">Diária não informada</span>}
                </p>
                <dl className="carro-dados">
                  <div><dt><Icone nome="calendario" tamanho={15} /> Ano</dt><dd>{a.ano}</dd></div>
                  <div><dt><Icone nome="documento" tamanho={15} /> Matrícula</dt><dd>{a.matricula}</dd></div>
                  <div>
                    <dt><Icone nome={a.tipoProprietario === 'BANCO' ? 'banco' : 'empresa'} tamanho={15} /> Proprietário</dt>
                    <dd>{a.proprietarioNome} <small>({NOMES_TIPO[a.tipoProprietario]})</small></dd>
                  </div>
                </dl>
                {!ehAgente && a.valorDiaria && (
                  <Link to={`/pedidos?automovel=${a.id}`} className="botao destaque carro-alugar">
                    Alugar este carro <Icone nome="setaDireita" tamanho={16} />
                  </Link>
                )}
                {ehMeu && (
                  <div className="carro-acoes">
                    <span className="etiqueta">Seu automóvel</span>
                    <div>
                      <button className="botao-icone" aria-label={`Editar ${a.modelo}`} title="Editar"
                        onClick={() => { setSucesso(''); setEditando({ ...a, ano: String(a.ano), placa: mascaraPlaca(a.placa), valorDiaria: a.valorDiaria ? numeroParaDinheiro(a.valorDiaria) : '' }) }}>
                        <Icone nome="editar" tamanho={16} />
                      </button>
                      <button className="botao-icone perigo" aria-label={`Remover ${a.modelo}`} title="Remover"
                        onClick={() => excluir(a)}>
                        <Icone nome="lixeira" tamanho={16} />
                      </button>
                    </div>
                  </div>
                )}
              </article>
            )
          })}
        </div>
      )}

      {editando && <FormAutomovel inicial={editando} aoFechar={() => setEditando(null)} aoSalvar={aoSalvar} />}
    </>
  )
}

function FormAutomovel({ inicial, aoFechar, aoSalvar }) {
  const [form, setForm] = useState(inicial)
  const [erro, setErro] = useState(null)
  const [salvando, setSalvando] = useState(false)
  const novo = !inicial.id

  async function salvar(e) {
    e.preventDefault()
    setErro(null)
    setSalvando(true)
    try {
      const dados = { ...form, ano: Number(form.ano), valorDiaria: dinheiroParaNumero(form.valorDiaria) }
      if (novo) {
        await api('/automoveis', { method: 'POST', body: dados })
      } else {
        await api(`/automoveis/${inicial.id}`, { method: 'PUT', body: dados })
      }
      aoSalvar(novo ? 'Automóvel cadastrado com sucesso!' : 'Automóvel atualizado com sucesso!')
    } catch (err) {
      setErro(err)
    } finally {
      setSalvando(false)
    }
  }

  const campos = erro?.campos || {}

  return (
    <Modal titulo={novo ? 'Novo automóvel' : 'Editar automóvel'} aoFechar={aoFechar}>
      <form onSubmit={salvar}>
        {erro && <Alerta>{erro.message}</Alerta>}
        <div className="grade">
          <Campo label="Marca" value={form.marca} erro={campos.marca} required autoFocus placeholder="Ex.: Fiat"
            onChange={(e) => setForm({ ...form, marca: e.target.value })} />
          <Campo label="Modelo" value={form.modelo} erro={campos.modelo} required placeholder="Ex.: Argo"
            onChange={(e) => setForm({ ...form, modelo: e.target.value })} />
        </div>
        <div className="grade">
          <Campo label="Placa" value={form.placa} erro={campos.placa} required placeholder="ABC-1D23" maxLength={8}
            onChange={(e) => setForm({ ...form, placa: mascaraPlaca(e.target.value) })} />
          <Campo label="Ano" value={form.ano} erro={campos.ano} required inputMode="numeric" placeholder="2024" maxLength={4}
            onChange={(e) => setForm({ ...form, ano: somenteNumeros(e.target.value, 4) })} />
        </div>
        <div className="grade">
          <Campo label="Matrícula (RENAVAM)" value={form.matricula} erro={campos.matricula} required
            inputMode="numeric" placeholder="11 dígitos" maxLength={11}
            onChange={(e) => setForm({ ...form, matricula: somenteNumeros(e.target.value, 11) })} />
          <Campo label="Valor da diária (R$)" value={form.valorDiaria} erro={campos.valorDiaria} required
            inputMode="numeric" placeholder="0,00"
            onChange={(e) => setForm({ ...form, valorDiaria: mascaraDinheiro(e.target.value) })} />
        </div>

        <div className="modal-acoes">
          <button type="button" className="botao secundario" onClick={aoFechar}>Cancelar</button>
          <button className="botao destaque" disabled={salvando}>
            {salvando ? <><span className="spinner" /> Salvando...</> : <><Icone nome="check" tamanho={18} /> Salvar</>}
          </button>
        </div>
      </form>
    </Modal>
  )
}
