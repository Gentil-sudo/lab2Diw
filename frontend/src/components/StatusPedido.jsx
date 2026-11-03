export const STATUS = {
  EM_ANALISE: { nome: 'Em análise', descricao: 'Aguardando a análise financeira de um agente.' },
  APROVADO: { nome: 'Aprovado', descricao: 'Parecer positivo. Aguardando a execução do contrato.' },
  REPROVADO: { nome: 'Reprovado', descricao: 'O agente deu parecer negativo para este pedido.' },
  CANCELADO: { nome: 'Cancelado', descricao: 'Este pedido foi cancelado.' },
  CONTRATADO: { nome: 'Contratado', descricao: 'Contrato executado. Aluguel confirmado.' },
}

export default function StatusPedido({ status }) {
  return (
    <span className={`status status-${status.toLowerCase().replace('_', '-')}`}>
      <span className="status-ponto" aria-hidden="true" />
      {STATUS[status].nome}
    </span>
  )
}
