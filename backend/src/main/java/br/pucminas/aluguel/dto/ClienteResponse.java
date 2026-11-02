package br.pucminas.aluguel.dto;

import java.util.List;

import br.pucminas.aluguel.model.Cliente;

public record ClienteResponse(
        Long id,
        String login,
        String rg,
        String cpf,
        String nome,
        EnderecoDto endereco,
        String profissao,
        List<RendimentoResponse> rendimentos) {

    public static ClienteResponse from(Cliente c) {
        List<RendimentoResponse> rendimentos = c.getRendimentos().stream()
                .map(RendimentoResponse::from)
                .toList();
        return new ClienteResponse(c.getId(), c.getLogin(), c.getRg(), c.getCpf(), c.getNome(),
                EnderecoDto.from(c.getEndereco()), c.getProfissao(), rendimentos);
    }
}
