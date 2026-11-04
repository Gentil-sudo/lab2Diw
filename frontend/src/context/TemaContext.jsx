import { createContext, useContext, useEffect, useState } from 'react'

const TemaContext = createContext(null)
const CHAVE = 'tema'

// Tema inicial: o que o usuário escolheu antes ou, se nunca escolheu, o tema do sistema operacional.
function temaInicial() {
  try {
    const salvo = localStorage.getItem(CHAVE)
    if (salvo === 'claro' || salvo === 'escuro') return salvo
  } catch {
    // localStorage bloqueado (aba anônima, por exemplo): segue para o tema do sistema
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'escuro' : 'claro'
}

export function TemaProvider({ children }) {
  const [tema, setTema] = useState(temaInicial)

  // O atributo data-tema no <html> troca todos os tokens de cor do index.css.
  useEffect(() => {
    document.documentElement.dataset.tema = tema
  }, [tema])

  function alternarTema() {
    const novo = tema === 'escuro' ? 'claro' : 'escuro'
    setTema(novo)
    try {
      localStorage.setItem(CHAVE, novo)
    } catch {
      // sem localStorage o tema vale só até recarregar a página
    }
  }

  return (
    <TemaContext.Provider value={{ tema, alternarTema }}>
      {children}
    </TemaContext.Provider>
  )
}

export function useTema() {
  return useContext(TemaContext)
}
