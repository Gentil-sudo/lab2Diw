import { Link } from 'react-router-dom'
import Icone from './Icone.jsx'
import BotaoTema from './BotaoTema.jsx'

const VANTAGENS = [
  { icone: 'documento', titulo: 'Pedidos online', texto: 'Faça e acompanhe seus pedidos de qualquer lugar.' },
  { icone: 'escudo', titulo: 'Análise financeira', texto: 'Empresas e bancos parceiros avaliam cada pedido.' },
  { icone: 'carteira', titulo: 'Contrato de crédito', texto: 'Financie o aluguel com um banco agente.' },
]

export default function TelaAcesso({ children }) {
  return (
    <div className="tela-acesso">
      <aside className="painel-marca">
        <img className="logo-completa" src="/logo-alugaaqui.png" alt="AlugaAqui - Aluguel de Carros" />

        <div className="painel-texto entrada">
          <span className="selo">Laboratório 02 · PUC Minas</span>
          <h1>
            Alugue o carro certo, <span className="destaque">sem burocracia.</span>
          </h1>
          <p>Do pedido à assinatura do contrato, tudo acontece pela internet.</p>

          <ul className="vantagens">
            {VANTAGENS.map((v, i) => (
              <li key={v.titulo} className="entrada" style={{ animationDelay: `${150 + i * 100}ms` }}>
                <span className="vantagem-icone"><Icone nome={v.icone} tamanho={20} /></span>
                <div>
                  <strong>{v.titulo}</strong>
                  <span>{v.texto}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <svg className="estrada" viewBox="0 0 400 120" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0 90 Q200 40 400 90" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="14 12" />
        </svg>
      </aside>

      <main className="area-form">
        <div className="area-form-acoes">
          <Link to="/design-system" className="link-discreto">
            <Icone nome="paleta" tamanho={16} /> Design system
          </Link>
          <BotaoTema />
        </div>
        <div className="entrada">{children}</div>
      </main>
    </div>
  )
}
