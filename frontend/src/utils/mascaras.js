export function somenteNumeros(valor, maximo) {
  return valor.replace(/\D/g, '').slice(0, maximo)
}

export function mascaraCpf(valor) {
  return somenteNumeros(valor, 11)
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
}

export function mascaraCnpj(valor) {
  return somenteNumeros(valor, 14)
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2')
}

export function mascaraCep(valor) {
  return somenteNumeros(valor, 8).replace(/(\d{5})(\d)/, '$1-$2')
}

// Placa antiga (ABC-1234) ou Mercosul (ABC-1D23): cada posição só aceita o tipo certo de caractere.
export function mascaraPlaca(valor) {
  const formato = ['L', 'L', 'L', 'N', 'X', 'N', 'N']
  let placa = ''
  for (const c of valor.toUpperCase().replace(/[^A-Z0-9]/g, '')) {
    const esperado = formato[placa.length]
    if (!esperado) break
    const ehLetra = /[A-Z]/.test(c)
    if ((esperado === 'L' && ehLetra) || (esperado === 'N' && !ehLetra) || esperado === 'X') {
      placa += c
    }
  }
  return placa.length > 3 ? `${placa.slice(0, 3)}-${placa.slice(3)}` : placa
}

// Os dígitos entram pela direita e os dois últimos são os centavos (12345 -> 123,45).
export function mascaraDinheiro(valor) {
  const digitos = somenteNumeros(String(valor), 11).replace(/^0+/, '')
  if (!digitos) {
    return ''
  }
  const comCentavos = digitos.padStart(3, '0')
  const reais = comCentavos.slice(0, -2).replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  return `${reais},${comCentavos.slice(-2)}`
}

export function mascaraPercentual(valor) {
  return mascaraDinheiro(somenteNumeros(String(valor), 4))
}

export function dinheiroParaNumero(texto) {
  return Number(texto.replace(/\./g, '').replace(',', '.')) || 0
}

export function numeroParaDinheiro(numero) {
  return mascaraDinheiro(Number(numero).toFixed(2))
}

export function formatarData(dataIso) {
  const [ano, mes, dia] = dataIso.slice(0, 10).split('-')
  return `${dia}/${mes}/${ano}`
}

export function formatarDinheiro(valor) {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export function iniciais(nome) {
  return nome
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((parte) => parte[0].toUpperCase())
    .join('')
}
