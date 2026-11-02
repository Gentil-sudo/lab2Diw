import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

const NOMES_PERFIL = { CLIENTE: 'Cliente', EMPRESA: 'Empresa', BANCO: 'Banco' }

export default function Layout() {
  const { usuario, logout } = useAuth()
  const navigate = useNavigate()
  const ehCliente = usuario.perfil === 'CLIENTE'

  function sair() {
    logout()
    navigate('/login')
  }

  return (
    <>
      <header className="topo">
        <div className="topo-conteudo">
          <span className="marca">🚗 Aluguel de Carros</span>
          <nav>
            <NavLink to="/" end>Início</NavLink>
            {ehCliente && <NavLink to="/meus-dados">Meus dados</NavLink>}
            {!ehCliente && <NavLink to="/clientes">Clientes</NavLink>}
          </nav>
          <div className="usuario">
            <span>
              {usuario.nome} <small className="etiqueta">{NOMES_PERFIL[usuario.perfil]}</small>
            </span>
            <button className="botao secundario" onClick={sair}>Sair</button>
          </div>
        </div>
      </header>
      <main className="conteudo">
        <Outlet />
      </main>
    </>
  )
}
