const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'

// Função que todas as telas usam pra falar com o back-end.
// Ela já coloca o token do usuário logado no cabeçalho, transforma a resposta
// em JSON e, se der erro, lança um Error com a mensagem que veio da API
// (e os erros de cada campo, quando for erro de validação).
export async function api(caminho, { method = 'GET', body } = {}) {
  const usuario = JSON.parse(localStorage.getItem('usuario'))
  const headers = { 'Content-Type': 'application/json' }
  if (usuario?.token) {
    headers.Authorization = `Bearer ${usuario.token}`
  }

  let resposta
  try {
    resposta = await fetch(API_URL + caminho, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    })
  } catch {
    throw new Error('Não foi possível conectar ao servidor. O back-end está rodando?')
  }

  // Token vencido ou inválido: desloga e manda pro login
  if (resposta.status === 401 && usuario?.token) {
    localStorage.removeItem('usuario')
    window.location.href = '/login'
    throw new Error('Sua sessão expirou, faça login novamente')
  }

  if (resposta.status === 204) {
    return null
  }

  const dados = await resposta.json().catch(() => null)

  if (!resposta.ok) {
    const erro = new Error(dados?.mensagem || 'Ocorreu um erro inesperado')
    erro.campos = dados?.campos || {}
    erro.status = resposta.status
    throw erro
  }

  return dados
}
