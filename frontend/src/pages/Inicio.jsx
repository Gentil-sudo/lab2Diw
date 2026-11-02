import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Inicio() {
  const { usuario } = useAuth()
  const ehCliente = usuario.perfil === 'CLIENTE'

  return (
    <>
      <h2>Olá, {usuario.nome}!</h2>
      <p className="dica">
        {ehCliente
          ? 'Aqui você faz e acompanha seus pedidos de aluguel.'
          : 'Aqui você analisa os pedidos de aluguel dos clientes.'}
      </p>

      <div className="atalhos">
        {ehCliente ? (
          <Link to="/meus-dados" className="cartao atalho">
            <strong>👤 Meus dados</strong>
            <span>Veja e atualize seu cadastro e seus rendimentos</span>
          </Link>
        ) : (
          <Link to="/clientes" className="cartao atalho">
            <strong>👥 Clientes</strong>
            <span>Consulte os clientes cadastrados e seus rendimentos</span>
          </Link>
        )}
      </div>
    </>
  )
}
