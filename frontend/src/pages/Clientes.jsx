import { useEffect, useState } from 'react'
import { api } from '../services/api.js'
import { formatarDinheiro, iniciais, mascaraCpf } from '../utils/mascaras.js'
import Alerta from '../components/Alerta.jsx'
import Icone from '../components/Icone.jsx'

export default function Clientes() {
  const [clientes, setClientes] = useState(null)
  const [erro, setErro] = useState('')
  const [busca, setBusca] = useState('')

  useEffect(() => {
    api('/clientes').then(setClientes).catch((err) => setErro(err.message))
  }, [])

  if (erro) return <Alerta>{erro}</Alerta>
  if (!clientes) {
    return <div className="carregando" role="status"><span className="spinner escuro" /> Carregando...</div>
  }

  const termo = busca.toLowerCase()
  const numeros = busca.replace(/\D/g, '')
  const filtrados = clientes.filter(
    (c) => c.nome.toLowerCase().includes(termo) || (numeros && c.cpf.includes(numeros)),
  )

  return (
    <>
      <div className="cabecalho-pagina com-acao">
        <div>
          <h1>Clientes <span className="contador">{clientes.length}</span></h1>
          <p>Clientes cadastrados e seus rendimentos, usados na análise financeira dos pedidos.</p>
        </div>
        <div className="busca">
          <Icone nome="busca" tamanho={18} />
          <input aria-label="Buscar cliente por nome ou CPF" placeholder="Buscar por nome ou CPF" value={busca}
            onChange={(e) => setBusca(e.target.value)} />
        </div>
      </div>

      <div className="cartao tabela-container">
        <table>
          <thead>
            <tr>
              <th scope="col">Cliente</th>
              <th scope="col">Profissão</th>
              <th scope="col">Rendimentos</th>
              <th scope="col" className="direita">Renda total</th>
            </tr>
          </thead>
          <tbody>
            {filtrados.length === 0 && (
              <tr>
                <td colSpan="4">
                  <div className="vazio">
                    <Icone nome="usuarios" tamanho={32} />
                    <strong>{clientes.length === 0 ? 'Nenhum cliente cadastrado ainda' : 'Nenhum cliente encontrado'}</strong>
                    <span>{clientes.length === 0 ? 'Os clientes aparecem aqui assim que se cadastrarem.' : 'Tente buscar por outro nome ou CPF.'}</span>
                  </div>
                </td>
              </tr>
            )}
            {filtrados.map((c) => (
              <tr key={c.id}>
                <td>
                  <div className="pessoa">
                    <div className="avatar" aria-hidden="true">{iniciais(c.nome)}</div>
                    <div>
                      <strong>{c.nome}</strong>
                      <small>CPF {mascaraCpf(c.cpf)}</small>
                    </div>
                  </div>
                </td>
                <td>{c.profissao || <span className="sem-dado">Não informada</span>}</td>
                <td>
                  {c.rendimentos.length === 0 && <span className="sem-dado">Nenhum informado</span>}
                  {c.rendimentos.map((r) => (
                    <div key={r.id} className="rendimento-item">
                      <span>{r.entidadeEmpregadora}</span>
                      <span>{formatarDinheiro(r.valor)}</span>
                    </div>
                  ))}
                </td>
                <td className="direita">
                  <strong className="valor">{formatarDinheiro(c.rendimentos.reduce((soma, r) => soma + r.valor, 0))}</strong>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
