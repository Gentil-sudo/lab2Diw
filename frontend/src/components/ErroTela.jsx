import { Component } from 'react'

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
