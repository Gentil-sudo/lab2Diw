import { useId } from 'react'

// Campo de formulário com label ligado ao input (htmlFor/id), assim leitores de tela
// conseguem ler o nome do campo. Quando tem erro, a mensagem é anunciada (role="alert").
export default function Campo({ label, erro, id, ...props }) {
  const idGerado = useId()
  const campoId = id || idGerado
  const erroId = `${campoId}-erro`

  return (
    <div className="campo">
      <label htmlFor={campoId}>{label}</label>
      <input
        id={campoId}
        className={erro ? 'invalido' : ''}
        aria-invalid={erro ? true : undefined}
        aria-describedby={erro ? erroId : undefined}
        {...props}
      />
      {erro && <small id={erroId} className="erro-campo" role="alert">{erro}</small>}
    </div>
  )
}
