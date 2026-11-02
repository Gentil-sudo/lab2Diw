import { Component } from 'react'

// Se algum componente quebrar na hora de desenhar a tela, o React mostraria
// uma página em branco. Essa classe captura o erro e mostra uma mensagem no lugar.
export default class ErroTela extends Component {
  constructor(props) {
    super(props)
    this.state = { temErro: false }
  }

  static getDerivedStateFromError() {
    return { temErro: true }
  }

  componentDidCatch(erro) {
    console.error(erro)
  }

  render() {
    if (this.state.temErro) {
      return (
        <div className="tela-erro">
          <h1>Algo deu errado</h1>
          <p>Ocorreu um erro inesperado nesta página.</p>
          <button className="botao" onClick={() => window.location.assign('/')}>Voltar ao início</button>
        </div>
      )
    }
    return this.props.children
  }
}
