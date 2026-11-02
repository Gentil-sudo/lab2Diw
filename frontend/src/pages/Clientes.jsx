import { useEffect, useState } from 'react'
import { api } from '../services/api.js'

function formatarDinheiro(valor) {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function formatarCpf(cpf) {
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
}

export default function Clientes() {
  const [clientes, setClientes] = useState(null)
  const [erro, setErro] = useState('')

  useEffect(() => {
    api('/clientes').then(setClientes).catch((err) => setErro(err.message))
  }, [])

  if (erro) return <div className="alerta erro">{erro}</div>
  if (!clientes) return <p>Carregando...</p>

  return (
    <>
      <h2>Clientes</h2>
      <p className="dica">Clientes cadastrados e seus rendimentos, usados na análise financeira dos pedidos.</p>

      <div className="cartao tabela-container">
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>CPF</th>
              <th>Profissão</th>
              <th>Rendimentos</th>
              <th>Renda total</th>
            </tr>
          </thead>
          <tbody>
            {clientes.length === 0 && (
              <tr><td colSpan="5" className="vazio">Nenhum cliente cadastrado.</td></tr>
            )}
            {clientes.map((c) => (
              <tr key={c.id}>
                <td>{c.nome}</td>
                <td>{formatarCpf(c.cpf)}</td>
                <td>{c.profissao || '-'}</td>
                <td>
                  {c.rendimentos.length === 0 && '-'}
                  {c.rendimentos.map((r) => (
                    <div key={r.id}>{r.entidadeEmpregadora}: {formatarDinheiro(r.valor)}</div>
                  ))}
                </td>
                <td>{formatarDinheiro(c.rendimentos.reduce((soma, r) => soma + r.valor, 0))}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
