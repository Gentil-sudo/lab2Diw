import { useLayoutEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useTema } from '../context/TemaContext.jsx'
import Alerta from '../components/Alerta.jsx'
import BotaoTema from '../components/BotaoTema.jsx'
import Campo from '../components/Campo.jsx'
import Icone, { NOMES_ICONES } from '../components/Icone.jsx'
import StatusPedido, { STATUS } from '../components/StatusPedido.jsx'

// Os valores de cada cor NÃO ficam repetidos aqui: são lidos do index.css em tempo real,
// então esta página sempre mostra exatamente o que o site usa.
const GRUPOS_CORES = [
  {
    titulo: 'Marca e ação',
    cores: [
      ['--color-primary', 'Primary', 'Botões padrão, menu ativo, avatar'],
      ['--color-on-primary', 'On Primary', 'Texto sobre Primary'],
      ['--color-accent', 'Accent / CTA', 'Botão de destaque (vermelho da marca)'],
      ['--color-on-accent', 'On Accent', 'Texto sobre Accent'],
      ['--color-accent-text', 'Accent Text', 'Links e destaques em texto'],
      ['--color-ring', 'Ring', 'Contorno de foco (teclado)'],
    ],
  },
  {
    titulo: 'Superfícies e texto',
    cores: [
      ['--color-background', 'Background', 'Fundo das páginas'],
      ['--color-card', 'Card', 'Cartões, formulários, modais'],
      ['--color-muted', 'Muted', 'Fundos discretos e ícones'],
      ['--color-foreground', 'Foreground', 'Texto principal'],
      ['--color-secondary', 'Secondary', 'Rótulos dos campos'],
      ['--color-muted-foreground', 'Muted Foreground', 'Texto de apoio'],
      ['--color-border', 'Border', 'Bordas de cartões'],
      ['--color-border-strong', 'Border Strong', 'Bordas de campos'],
    ],
  },
  {
    titulo: 'Feedback e status',
    cores: [
      ['--color-success', 'Success', 'Valores e confirmações'],
      ['--color-success-bg', 'Success BG', 'Fundo de sucesso / contratado'],
      ['--color-danger-bg', 'Danger BG', 'Fundo de erro / reprovado'],
      ['--color-danger-text', 'Danger Text', 'Texto de erro'],
      ['--color-warning-bg', 'Warning BG', 'Fundo de "em análise"'],
      ['--color-warning-text', 'Warning Text', 'Texto de "em análise"'],
      ['--color-info-bg', 'Info BG', 'Fundo de "aprovado"'],
      ['--color-info-text', 'Info Text', 'Texto de "aprovado"'],
    ],
  },
]

const TEMAS = [
  { id: 'claro', nome: 'Modo claro', icone: 'sol' },
  { id: 'escuro', nome: 'Modo escuro', icone: 'lua' },
]

const SECOES = [
  ['marca', 'Marca'],
  ['cores', 'Cores'],
  ['tipografia', 'Tipografia'],
  ['componentes', 'Componentes'],
  ['icones', 'Ícones'],
  ['forma', 'Raio e sombra'],
  ['principios', 'Princípios'],
]

// Mostra o conteúdo duas vezes, uma em cada tema, usando data-tema para trocar os tokens.
function LadoALado({ children }) {
  return (
    <div className="ds-lado-a-lado">
      {TEMAS.map((t) => (
        <div key={t.id} className="ds-painel-tema" data-tema={t.id}>
          <span className="ds-rotulo-tema"><Icone nome={t.icone} tamanho={14} /> {t.nome}</span>
          {typeof children === 'function' ? children(t.id) : children}
        </div>
      ))}
    </div>
  )
}

function Amostras({ cores }) {
  const ref = useRef(null)
  const [valores, setValores] = useState({})
  const { tema } = useTema()

  // Lê o valor real de cada token dentro do painel (claro ou escuro).
  useLayoutEffect(() => {
    const estilo = getComputedStyle(ref.current)
    setValores(Object.fromEntries(cores.map(([v]) => [v, estilo.getPropertyValue(v).trim()])))
  }, [cores, tema])

  return (
    <ul className="ds-cores" ref={ref}>
      {cores.map(([variavel, nome, uso]) => (
        <li key={variavel}>
          <span className="ds-amostra" style={{ background: `var(${variavel})` }} />
          <div>
            <strong>{nome}</strong>
            <code>{valores[variavel]}</code>
            <small>{uso}</small>
          </div>
        </li>
      ))}
    </ul>
  )
}

function Componentes() {
  return (
    <div className="ds-componentes">
      <div className="ds-linha">
        <button className="botao">Primário</button>
        <button className="botao destaque">Destaque</button>
        <button className="botao secundario">Secundário</button>
        <button className="botao perigo">Perigo</button>
        <button className="botao" disabled>Desabilitado</button>
      </div>
      <div className="ds-linha">
        <button className="botao-icone" aria-label="Exemplo de botão de ícone"><Icone nome="editar" tamanho={18} /></button>
        <button className="botao-icone" aria-label="Exemplo de botão de ícone"><Icone nome="lixeira" tamanho={18} /></button>
        <span className="placa">ABC1D23</span>
        <span className="ds-texto-link">Link de exemplo</span>
      </div>
      <div className="ds-linha ds-status">
        {Object.keys(STATUS).map((s) => <StatusPedido key={s} status={s} />)}
      </div>
      <Campo label="Campo de texto" placeholder="Digite aqui" />
      <Campo label="Campo com erro" defaultValue="valor inválido" erro="Mensagem de erro do campo" />
      <Alerta tipo="erro">Mensagem de erro da API.</Alerta>
      <Alerta tipo="sucesso">Operação concluída com sucesso.</Alerta>
    </div>
  )
}

export default function DesignSystem() {
  const { usuario } = useAuth()

  return (
    <div className="ds">
      <header className="ds-topo">
        <div className="ds-topo-conteudo">
          <Link to={usuario ? '/' : '/login'} className="logo" aria-label="Voltar ao AlugaAqui">
            <img className="logo-emblema" src="/logo-emblema.png" alt="" />
            <span>Aluga<span className="logo-destaque">Aqui</span></span>
          </Link>
          <nav className="ds-indice" aria-label="Seções do design system">
            {SECOES.map(([id, nome]) => <a key={id} href={`#${id}`}>{nome}</a>)}
          </nav>
          <BotaoTema />
        </div>
      </header>

      <main className="ds-conteudo">
        <section className="ds-hero entrada">
          <span className="selo">Design System</span>
          <h1>Guia visual do AlugaAqui</h1>
          <p>
            Cores, tipografia e componentes usados no site, nos modos claro e escuro.
            Todos os valores são lidos ao vivo do CSS do projeto (<code>src/index.css</code>).
          </p>
        </section>

        <section id="marca" className="ds-secao">
          <h2>Marca</h2>
          <p className="ds-descricao">Logo completa para o painel de login e emblema para o cabeçalho e o favicon.</p>
          <div className="ds-marca">
            <div className="ds-marca-fundo"><img src="/logo-alugaaqui.png" alt="Logo completa AlugaAqui" /></div>
            <div className="ds-marca-fundo pequeno"><img src="/logo-emblema.png" alt="Emblema AlugaAqui" /></div>
          </div>
        </section>

        <section id="cores" className="ds-secao">
          <h2>Cores</h2>
          <p className="ds-descricao">
            Paleta "Premium dark + action red". Cada token tem um valor para o modo claro e outro para o modo escuro.
          </p>
          {GRUPOS_CORES.map((g) => (
            <div key={g.titulo} className="ds-grupo">
              <h3>{g.titulo}</h3>
              <LadoALado><Amostras cores={g.cores} /></LadoALado>
            </div>
          ))}
        </section>

        <section id="tipografia" className="ds-secao">
          <h2>Tipografia</h2>
          <p className="ds-descricao">Títulos em <strong>Outfit</strong> e textos em <strong>Rubik</strong> (Google Fonts).</p>
          <div className="cartao ds-tipografia">
            <div><small>Outfit 700 · 2.5rem</small><p className="ds-t1">Alugue o carro certo</p></div>
            <div><small>Outfit 700 · 1.75rem</small><p className="ds-t2">Meus pedidos</p></div>
            <div><small>Outfit 600 · 1.15rem</small><p className="ds-t3">Dados do automóvel</p></div>
            <div><small>Rubik 400 · 1rem</small><p>Do pedido à assinatura do contrato, tudo acontece pela internet.</p></div>
            <div><small>Rubik 400 · 0.875rem · Muted</small><p className="ds-apoio">Texto de apoio para descrições e legendas.</p></div>
          </div>
        </section>

        <section id="componentes" className="ds-secao">
          <h2>Componentes</h2>
          <p className="ds-descricao">Botões, campos, alertas e status de pedido, como aparecem em cada tema.</p>
          <LadoALado><Componentes /></LadoALado>
        </section>

        <section id="icones" className="ds-secao">
          <h2>Ícones</h2>
          <p className="ds-descricao">SVG próprios (componente <code>Icone.jsx</code>), traço de 2px, sem emojis.</p>
          <ul className="ds-icones cartao">
            {NOMES_ICONES.map((nome) => (
              <li key={nome}><Icone nome={nome} tamanho={24} /><code>{nome}</code></li>
            ))}
          </ul>
        </section>

        <section id="forma" className="ds-secao">
          <h2>Raio e sombra</h2>
          <div className="ds-formas">
            <div className="ds-forma" style={{ borderRadius: 6 }}><code>6px</code><small>Placa, etiquetas</small></div>
            <div className="ds-forma" style={{ borderRadius: 10 }}><code>10px</code><small>Botões, campos</small></div>
            <div className="ds-forma" style={{ borderRadius: 'var(--raio)' }}><code>14px · --raio</code><small>Cartões</small></div>
            <div className="ds-forma" style={{ boxShadow: 'var(--sombra)' }}><code>--sombra</code><small>Cartões</small></div>
            <div className="ds-forma" style={{ boxShadow: 'var(--sombra-alta)' }}><code>--sombra-alta</code><small>Hover e modais</small></div>
          </div>
        </section>

        <section id="principios" className="ds-secao">
          <h2>Princípios</h2>
          <ul className="ds-principios">
            <li><Icone nome="check" tamanho={18} /> Contraste de texto de no mínimo 4.5:1 nos dois temas.</li>
            <li><Icone nome="check" tamanho={18} /> Foco visível para navegação por teclado.</li>
            <li><Icone nome="check" tamanho={18} /> Animações leves (entrada e hover de 150–300ms), desligadas com <code>prefers-reduced-motion</code>.</li>
            <li><Icone nome="check" tamanho={18} /> Ícones em SVG, nunca emojis.</li>
            <li><Icone nome="check" tamanho={18} /> Tema inicial segue o sistema operacional; a escolha do usuário fica salva no navegador.</li>
            <li><Icone nome="check" tamanho={18} /> Layout responsivo em 375px, 768px, 1024px e 1440px.</li>
          </ul>
        </section>
      </main>
    </div>
  )
}
