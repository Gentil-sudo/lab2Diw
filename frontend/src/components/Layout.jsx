import { useEffect, useState } from 'react'
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
  // Menu "hambúrguer" usado em telas menores (o CSS decide quando ele aparece)
  const [menuAberto, setMenuAberto] = useState(false)

  // Fecha o menu ao trocar de página
  useEffect(() => {
    setMenuAberto(false)
  }, [location.pathname])

  // Fecha o menu com a tecla Esc
  useEffect(() => {
    if (!menuAberto) return
    function teclaEsc(e) {
      if (e.key === 'Escape') setMenuAberto(false)
    }
    document.addEventListener('keydown', teclaEsc)
    return () => document.removeEventListener('keydown', teclaEsc)
  }, [menuAberto])

  function sair() {
    logout()
    navigate('/login')
  }

  const avatar = <div className="avatar" aria-hidden="true">{iniciais(usuario.nome)}</div>
  const info = (
    <div className="usuario-info">
      <strong>{usuario.nome}</strong>
      <small>{NOMES_PERFIL[usuario.perfil]}</small>
    </div>
  )

  return (
    <>
      <header className="topo">
        <div className="topo-conteudo">
          <NavLink to="/" className="logo" aria-label="AlugaAqui - página inicial">
            <img className="logo-emblema" src="/logo-emblema.png" alt="" />
            <span>Aluga<span className="logo-destaque">Aqui</span></span>
          </NavLink>

          <nav id="menu-principal" className={menuAberto ? 'menu aberto' : 'menu'} aria-label="Menu principal">
            {/* Só aparece dentro do menu "hambúrguer" */}
            <div className="menu-usuario">{avatar}{info}</div>

            <NavLink to="/" end><Icone nome="inicio" tamanho={18} /> Início</NavLink>
            {ehCliente && <NavLink to="/pedidos"><Icone nome="documento" tamanho={18} /> Meus pedidos</NavLink>}
            {ehCliente && <NavLink to="/meus-dados"><Icone nome="usuario" tamanho={18} /> Meus dados</NavLink>}
            {!ehCliente && <NavLink to="/analise"><Icone nome="escudo" tamanho={18} /> Análise de pedidos</NavLink>}
            <NavLink to="/contratos"><Icone nome="carteira" tamanho={18} /> Contratos</NavLink>
            <NavLink to="/automoveis"><Icone nome="carro" tamanho={18} /> Automóveis</NavLink>
            {!ehCliente && <NavLink to="/clientes"><Icone nome="usuarios" tamanho={18} /> Clientes</NavLink>}

            {/* Só aparece dentro do menu "hambúrguer" */}
            <div className="menu-extra">
              <NavLink to="/design-system"><Icone nome="paleta" tamanho={18} /> Design system</NavLink>
              <button type="button" onClick={sair}><Icone nome="sair" tamanho={18} /> Sair</button>
            </div>
          </nav>

          {/* Telas grandes: usuário e ações ao lado do menu */}
          <div className="usuario">
            <span title={`${usuario.nome} · ${NOMES_PERFIL[usuario.perfil]}`}>{avatar}</span>
            {info}
            <NavLink to="/design-system" className="botao-icone" aria-label="Design system" title="Design system">
              <Icone nome="paleta" tamanho={18} />
            </NavLink>
            <BotaoTema />
            <button className="botao-icone" onClick={sair} aria-label="Sair" title="Sair">
              <Icone nome="sair" tamanho={18} />
            </button>
          </div>

          {/* Telas menores: tema e botão do menu */}
          <div className="topo-mobile">
            <BotaoTema />
            <button
              type="button"
              className="botao-icone"
              aria-label={menuAberto ? 'Fechar menu' : 'Abrir menu'}
              aria-expanded={menuAberto}
              aria-controls="menu-principal"
              onClick={() => setMenuAberto(!menuAberto)}
            >
              <Icone nome={menuAberto ? 'fechar' : 'menu'} tamanho={20} />
            </button>
          </div>
        </div>
      </header>

      {menuAberto && <div className="menu-fundo" onClick={() => setMenuAberto(false)} aria-hidden="true" />}

      <main className="conteudo entrada" key={location.pathname}>
        <Outlet />
      </main>
    </>
  )
}
