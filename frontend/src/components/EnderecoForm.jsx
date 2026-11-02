import { useState } from 'react'
import { mascaraCep, somenteNumeros } from '../utils/mascaras.js'
import Campo from './Campo.jsx'

const UFS = ['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR',
  'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO']

export const ENDERECO_VAZIO = { cep: '', logradouro: '', numero: '', complemento: '', bairro: '', cidade: '', uf: '' }

export default function EnderecoForm({ endereco, onChange, campos = {} }) {
  const [buscandoCep, setBuscandoCep] = useState(false)
  const [avisoCep, setAvisoCep] = useState('')

  function alterar(campo, valor) {
    onChange({ ...endereco, [campo]: valor })
  }

  // Com o CEP completo, busca no ViaCEP e preenche rua, bairro, cidade e UF.
  async function alterarCep(valor) {
    const cep = mascaraCep(valor)
    onChange({ ...endereco, cep })
    setAvisoCep('')

    const numeros = somenteNumeros(cep, 8)
    if (numeros.length !== 8) {
      return
    }

    setBuscandoCep(true)
    try {
      const resposta = await fetch(`https://viacep.com.br/ws/${numeros}/json/`)
      const dados = await resposta.json()
      if (dados.erro) {
        setAvisoCep('CEP não encontrado, preencha o endereço manualmente.')
        return
      }
      onChange({
        ...endereco,
        cep,
        logradouro: dados.logradouro || endereco.logradouro,
        bairro: dados.bairro || endereco.bairro,
        cidade: dados.localidade || endereco.cidade,
        uf: dados.uf || endereco.uf,
      })
    } catch {
      setAvisoCep('Não foi possível buscar o CEP, preencha o endereço manualmente.')
    } finally {
      setBuscandoCep(false)
    }
  }

  return (
    <>
      <div className="grade grade-cep">
        <Campo label="CEP" value={endereco.cep} erro={campos['endereco.cep'] || avisoCep} required
          placeholder="00000-000" inputMode="numeric" maxLength={9} autoComplete="postal-code"
          onChange={(e) => alterarCep(e.target.value)} />
        {buscandoCep && <span className="buscando-cep"><span className="spinner escuro" /> Buscando endereço...</span>}
      </div>
      <div className="grade grade-rua">
        <Campo label="Rua" value={endereco.logradouro} erro={campos['endereco.logradouro']} required
          autoComplete="address-line1" onChange={(e) => alterar('logradouro', e.target.value)} />
        <Campo label="Número" value={endereco.numero} erro={campos['endereco.numero']} required
          inputMode="numeric" maxLength={6} onChange={(e) => alterar('numero', somenteNumeros(e.target.value, 6))} />
      </div>
      <div className="grade">
        <Campo label="Complemento" value={endereco.complemento || ''} erro={campos['endereco.complemento']}
          placeholder="Apto, bloco... (opcional)" autoComplete="address-line2"
          onChange={(e) => alterar('complemento', e.target.value)} />
        <Campo label="Bairro" value={endereco.bairro} erro={campos['endereco.bairro']} required
          onChange={(e) => alterar('bairro', e.target.value)} />
      </div>
      <div className="grade grade-cidade">
        <Campo label="Cidade" value={endereco.cidade} erro={campos['endereco.cidade']} required
          autoComplete="address-level2" onChange={(e) => alterar('cidade', e.target.value)} />
        <div className="campo">
          <label htmlFor="uf">UF</label>
          <select id="uf" value={endereco.uf} required aria-invalid={campos['endereco.uf'] ? true : undefined}
            onChange={(e) => alterar('uf', e.target.value)}>
            <option value="">--</option>
            {UFS.map((uf) => <option key={uf} value={uf}>{uf}</option>)}
          </select>
          {campos['endereco.uf'] && <small className="erro-campo" role="alert">{campos['endereco.uf']}</small>}
        </div>
      </div>
    </>
  )
}
