package br.pucminas.aluguel.model;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import org.junit.jupiter.api.Test;

import br.pucminas.aluguel.exception.RegraNegocioException;

class ClienteTest {

    @Test
    void aceitaAteTresRendimentos() {
        Cliente cliente = new Cliente();
        cliente.adicionarRendimento(new Rendimento("Empresa A", 1000));
        cliente.adicionarRendimento(new Rendimento("Empresa B", 2000));
        cliente.adicionarRendimento(new Rendimento("Empresa C", 3000));

        assertEquals(3, cliente.getRendimentos().size());
        assertEquals(cliente, cliente.getRendimentos().get(0).getCliente());
    }

    @Test
    void naoAceitaQuartoRendimento() {
        Cliente cliente = new Cliente();
        for (int i = 0; i < 3; i++) {
            cliente.adicionarRendimento(new Rendimento("Empresa " + i, 1000));
        }

        assertThrows(RegraNegocioException.class,
                () -> cliente.adicionarRendimento(new Rendimento("Empresa extra", 500)));
    }

    @Test
    void limparRendimentosEsvaziaALista() {
        Cliente cliente = new Cliente();
        cliente.adicionarRendimento(new Rendimento("Empresa A", 1000));
        cliente.limparRendimentos();

        assertEquals(0, cliente.getRendimentos().size());
    }
}
