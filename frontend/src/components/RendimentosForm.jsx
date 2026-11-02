import Icone from './Icone.jsx'

const MAX_RENDIMENTOS = 3

// Lista de rendimentos usada no cadastro e na edição do cliente.
// O botão de adicionar some quando chega em 3, que é o limite do enunciado.
export default function RendimentosForm({ rendimentos, onChange }) {
  function alterar(indice, campo, valor) {
    const novos = rendimentos.map((r, i) => (i === indice ? { ...r, [campo]: valor } : r))
    onChange(novos)
  }

  function adicionar() {
    onChange([...rendimentos, { entidadeEmpregadora: '', valor: '' }])
  }

  function remover(indice) {
    onChange(rendimentos.filter((_, i) => i !== indice))
  }

  return (
    <div className="rendimentos">
      <div className="rendimentos-topo">
        <span><Icone nome="carteira" tamanho={18} /> Rendimentos</span>
        <span className="contador">{rendimentos.length}/{MAX_RENDIMENTOS}</span>
      </div>

      {rendimentos.length === 0 && (
        <p className="sem-dado">Nenhum rendimento informado. Eles ajudam na aprovação dos seus pedidos.</p>
      )}

      {rendimentos.map((r, i) => (
        <div className="linha-rendimento entrada" key={i}>
          <input
            aria-label={`Entidade empregadora ${i + 1}`}
            placeholder="Entidade empregadora"
            value={r.entidadeEmpregadora}
            onChange={(e) => alterar(i, 'entidadeEmpregadora', e.target.value)}
            required
          />
          <div className="campo-dinheiro">
            <span aria-hidden="true">R$</span>
            <input
              aria-label={`Valor do rendimento ${i + 1}`}
              type="number"
              placeholder="0,00"
              min="0.01"
              step="0.01"
              value={r.valor}
              onChange={(e) => alterar(i, 'valor', e.target.value)}
              required
            />
          </div>
          <button type="button" className="botao-icone perigo" aria-label={`Remover rendimento ${i + 1}`}
            title="Remover" onClick={() => remover(i)}>
            <Icone nome="fechar" tamanho={16} />
          </button>
        </div>
      ))}

      {rendimentos.length < MAX_RENDIMENTOS && (
        <button type="button" className="botao-adicionar" onClick={adicionar}>
          <Icone nome="mais" tamanho={16} /> Adicionar rendimento
        </button>
      )}
    </div>
  )
}
