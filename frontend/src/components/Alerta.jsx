import Icone from './Icone.jsx'

export default function Alerta({ tipo = 'erro', children }) {
  return (
    <div className={`alerta ${tipo}`} role={tipo === 'erro' ? 'alert' : 'status'}>
      <Icone nome={tipo === 'erro' ? 'alerta' : 'check'} tamanho={18} />
      <span>{children}</span>
    </div>
  )
}
