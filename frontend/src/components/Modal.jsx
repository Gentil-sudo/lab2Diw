import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import Icone from './Icone.jsx'

export default function Modal({ titulo, aoFechar, children }) {
  useEffect(() => {
    function teclaEsc(e) {
      if (e.key === 'Escape') aoFechar()
    }
    document.addEventListener('keydown', teclaEsc)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', teclaEsc)
      document.body.style.overflow = ''
    }
  }, [aoFechar])

  // Portal: o modal é renderizado direto no <body>. Dentro do <main> ele ficaria preso ao
  // "transform" da animação de entrada e o fundo escuro não cobriria a tela inteira.
  return createPortal(
    <div className="modal-fundo" onMouseDown={(e) => e.target === e.currentTarget && aoFechar()}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-titulo">
        <div className="modal-topo">
          <h2 id="modal-titulo">{titulo}</h2>
          <button type="button" className="botao-icone" aria-label="Fechar" onClick={aoFechar}>
            <Icone nome="fechar" tamanho={18} />
          </button>
        </div>
        {children}
      </div>
    </div>,
    document.body,
  )
}
