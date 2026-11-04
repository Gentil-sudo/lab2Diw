import { useTema } from '../context/TemaContext.jsx'
import Icone from './Icone.jsx'

export default function BotaoTema({ className = '' }) {
  const { tema, alternarTema } = useTema()
  const escuro = tema === 'escuro'
  const rotulo = escuro ? 'Ativar modo claro' : 'Ativar modo escuro'

  return (
    <button
      type="button"
      className={`botao-icone ${className}`}
      onClick={alternarTema}
      aria-label={rotulo}
      title={rotulo}
    >
      <Icone nome={escuro ? 'sol' : 'lua'} tamanho={18} />
    </button>
  )
}
