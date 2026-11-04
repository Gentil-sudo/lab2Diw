import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { iniciais } from '../utils/mascaras.js'
import Icone from './Icone.jsx'
import BotaoTema from './BotaoTema.jsx'

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
          <NavLink to="/" className="logo" aria-label="AlugaAqui - página inicial">
            <img className="logo-emblema" src="/logo-emblema.png" alt="" />
            <span>Aluga<span className="logo-destaque">Aqui</span></span>
          </NavLink>

          <nav className="menu" aria-label="Menu principal">
            <NavLink to="/" end><Icone nome="inicio" tamanho={18} /> Início</NavLink>
            {ehCliente && <NavLink to="/pedidos"><Icone nome="documento" tamanho={18} /> Meus pedidos</NavLink>}
            {ehCliente && <NavLink to="/meus-dados"><Icone nome="usuario" tamanho={18} /> Meus dados</NavLink>}
            {!ehCliente && <NavLink to="/analise"><Icone nome="escudo" tamanho={18} /> Análise de pedidos</NavLink>}
            <NavLink to="/contratos"><Icone nome="carteira" tamanho={18} /> Contratos</NavLink>
            <NavLink to="/automoveis"><Icone nome="carro" tamanho={18} /> Automóveis</NavLink>
            {!ehCliente && <NavLink to="/clientes"><Icone nome="usuarios" tamanho={18} /> Clientes</NavLink>}
          </nav>

          <div className="usuario">
            <div className="avatar" aria-hidden="true">{iniciais(usuario.nome)}</div>
            <div className="usuario-info">
              <strong>{usuario.nome}</strong>
              <small>{NOMES_PERFIL[usuario.perfil]}</small>
            </div>
            <NavLink to="/design-system" className="botao-icone" aria-label="Design system" title="Design system">
              <Icone nome="paleta" tamanho={18} />
            </NavLink>
            <BotaoTema />
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
