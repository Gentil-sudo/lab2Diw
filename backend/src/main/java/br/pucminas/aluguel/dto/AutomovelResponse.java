package br.pucminas.aluguel.dto;

import br.pucminas.aluguel.model.Automovel;

public record AutomovelResponse(
        Long id,
        String matricula,
        int ano,
        String marca,
        String modelo,
        String placa,
        Double valorDiaria,
        String tipoProprietario,
        Long proprietarioId,
        String proprietarioNome) {

    public static AutomovelResponse from(Automovel a) {
        Long donoId = a.getProprietario() != null ? a.getProprietario().getId() : null;
        String donoNome = a.getProprietario() != null ? a.getProprietario().getNome() : null;
        String tipo = a.getTipoProprietario() != null ? a.getTipoProprietario().name() : null;
        return new AutomovelResponse(a.getId(), a.getMatricula(), a.getAno(), a.getMarca(), a.getModelo(),
                a.getPlaca(), a.getValorDiaria(), tipo, donoId, donoNome);
    }
}
