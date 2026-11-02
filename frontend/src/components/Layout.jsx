import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { iniciais } from '../utils/mascaras.js'
import Icone from './Icone.jsx'

const NOMES_PERFIL = { CLIENTE: 'Cliente', EMPRESA: 'Empresa', BANCO: 'Banco' }

export default function Layout() {
  const { usuario, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const ehCliente = usuario.perfil === 'CLIENTE'

  function sair() {
    logout()
    navigate('/login')
  }

  return (
    <>
      <header className="topo">
        <div className="topo-conteudo">
          <NavLink to="/" className="logo">
            <span className="logo-icone"><Icone nome="carro" tamanho={20} /></span>
            <span>Aluguel de Carros</span>
          </NavLink>

          <nav className="menu" aria-label="Menu principal">
            <NavLink to="/" end><Icone nome="inicio" tamanho={18} /> Início</NavLink>
            {ehCliente && <NavLink to="/meus-dados"><Icone nome="usuario" tamanho={18} /> Meus dados</NavLink>}
            <NavLink to="/automoveis"><Icone nome="carro" tamanho={18} /> Automóveis</NavLink>
            {!ehCliente && <NavLink to="/clientes"><Icone nome="usuarios" tamanho={18} /> Clientes</NavLink>}
          </nav>

          <div className="usuario">
            <div className="avatar" aria-hidden="true">{iniciais(usuario.nome)}</div>
            <div className="usuario-info">
              <strong>{usuario.nome}</strong>
              <small>{NOMES_PERFIL[usuario.perfil]}</small>
            </div>
            <button className="botao-icone" onClick={sair} aria-label="Sair" title="Sair">
              <Icone nome="sair" tamanho={18} />
            </button>
          </div>
        </div>
      </header>

      <main className="conteudo entrada" key={location.pathname}>
        <Outlet />
      </main>
    </>
  )
}
