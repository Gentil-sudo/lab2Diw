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
    <fieldset className="rendimentos">
      <legend>Rendimentos ({rendimentos.length}/{MAX_RENDIMENTOS})</legend>

      {rendimentos.length === 0 && <p className="dica">Nenhum rendimento informado.</p>}

      {rendimentos.map((r, i) => (
        <div className="linha-rendimento" key={i}>
          <input
            placeholder="Entidade empregadora"
            value={r.entidadeEmpregadora}
            onChange={(e) => alterar(i, 'entidadeEmpregadora', e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="Valor (R$)"
            min="0.01"
            step="0.01"
            value={r.valor}
            onChange={(e) => alterar(i, 'valor', e.target.value)}
            required
          />
          <button type="button" className="botao perigo" onClick={() => remover(i)}>Remover</button>
        </div>
      ))}

      {rendimentos.length < MAX_RENDIMENTOS && (
        <button type="button" className="botao secundario" onClick={adicionar}>+ Adicionar rendimento</button>
      )}
    </fieldset>
  )
}
