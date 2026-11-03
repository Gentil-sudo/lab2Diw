import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import Icone from '../components/Icone.jsx'

const ICONE_PERFIL = { CLIENTE: 'carro', EMPRESA: 'empresa', BANCO: 'banco' }

export default function Inicio() {
  const { usuario } = useAuth()
  const ehCliente = usuario.perfil === 'CLIENTE'
  const primeiroNome = usuario.nome.split(' ')[0]

  const atalhos = ehCliente
    ? [
        { para: '/pedidos', icone: 'documento', titulo: 'Meus pedidos', texto: 'Faça pedidos e acompanhe o status de cada um' },
        { para: '/contratos', icone: 'carteira', titulo: 'Meus contratos', texto: 'Veja seus contratos de aluguel e de crédito' },
        { para: '/automoveis', icone: 'carro', titulo: 'Automóveis', texto: 'Veja os carros disponíveis para aluguel' },
        { para: '/meus-dados', icone: 'usuario', titulo: 'Meus dados', texto: 'Veja e atualize seu cadastro e seus rendimentos' },
      ]
    : [
        { para: '/analise', icone: 'escudo', titulo: 'Análise de pedidos', texto: 'Avalie os pedidos que aguardam parecer financeiro' },
        { para: '/contratos', icone: 'carteira', titulo: 'Contratos', texto: 'Acompanhe os contratos executados e os créditos' },
        { para: '/automoveis', icone: 'carro', titulo: 'Automóveis', texto: 'Cadastre e gerencie os carros da sua frota' },
        { para: '/clientes', icone: 'usuarios', titulo: 'Clientes', texto: 'Consulte os clientes cadastrados e seus rendimentos' },
      ]

  return (
    <>
      <section className="boas-vindas">
        <div>
          <span className="selo">{ehCliente ? 'Área do cliente' : 'Área do agente'}</span>
          <h1>Olá, {primeiroNome}!</h1>
          <p>
            {ehCliente
              ? 'Faça seus pedidos de aluguel e acompanhe a análise de cada um por aqui.'
              : 'Analise os pedidos de aluguel dos clientes e acompanhe os contratos por aqui.'}
          </p>
        </div>
        <span className="boas-vindas-icone" aria-hidden="true">
          <Icone nome={ICONE_PERFIL[usuario.perfil]} tamanho={48} />
        </span>
      </section>

      <h2 className="titulo-secao">Acesso rápido</h2>
      <div className="atalhos">
        {atalhos.map((a, i) => (
          <Link key={a.para} to={a.para} className="cartao atalho entrada" style={{ animationDelay: `${100 + i * 80}ms` }}>
            <span className="atalho-icone"><Icone nome={a.icone} tamanho={22} /></span>
            <div>
              <strong>{a.titulo}</strong>
              <span>{a.texto}</span>
            </div>
            <Icone nome="setaDireita" tamanho={18} className="atalho-seta" />
          </Link>
        ))}
      </div>
    </>
  )
}
