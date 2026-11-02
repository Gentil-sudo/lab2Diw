export default function Campo({ label, erro, ...props }) {
  return (
    <label className="campo">
      <span>{label}</span>
      <input {...props} className={erro ? 'invalido' : ''} />
      {erro && <small className="erro-campo">{erro}</small>}
    </label>
  )
}
