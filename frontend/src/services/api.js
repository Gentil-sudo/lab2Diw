const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'

// Usada por todas as telas: envia o token, converte a resposta e lança o erro vindo da API.
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
