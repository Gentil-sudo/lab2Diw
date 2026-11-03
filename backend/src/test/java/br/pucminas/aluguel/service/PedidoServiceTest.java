package br.pucminas.aluguel.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.LocalDate;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import br.pucminas.aluguel.dto.AvaliacaoRequest;
import br.pucminas.aluguel.dto.PedidoRequest;
import br.pucminas.aluguel.dto.PedidoResponse;
import br.pucminas.aluguel.exception.AcessoNegadoException;
import br.pucminas.aluguel.exception.RegraNegocioException;
import br.pucminas.aluguel.model.Automovel;
import br.pucminas.aluguel.model.Banco;
import br.pucminas.aluguel.model.Cliente;
import br.pucminas.aluguel.model.Pedido;
import br.pucminas.aluguel.model.StatusPedido;
import br.pucminas.aluguel.repository.AgenteRepository;
import br.pucminas.aluguel.repository.AutomovelRepository;
import br.pucminas.aluguel.repository.ClienteRepository;
import br.pucminas.aluguel.repository.PedidoRepository;
import br.pucminas.aluguel.security.UsuarioLogado;

@ExtendWith(MockitoExtension.class)
class PedidoServiceTest {

    @Mock
    private PedidoRepository pedidoRepository;
    @Mock
    private ClienteRepository clienteRepository;
    @Mock
    private AutomovelRepository automovelRepository;
    @Mock
    private AgenteRepository agenteRepository;

    @InjectMocks
    private PedidoService pedidoService;

    private final UsuarioLogado usuarioCliente = new UsuarioLogado(1L, "CLIENTE");
    private final UsuarioLogado usuarioBanco = new UsuarioLogado(2L, "BANCO");
    private final LocalDate inicio = LocalDate.now().plusDays(10);

    private Cliente cliente;
    private Automovel automovel;

    @BeforeEach
    void preparar() {
        cliente = new Cliente();
        cliente.setId(1L);
        cliente.setNome("João");

        automovel = new Automovel();
        ReflectionTestUtils.setField(automovel, "id", 5L);
        automovel.setMarca("Fiat");
        automovel.setModelo("Argo");
        automovel.setValorDiaria(100.0);
    }

    private Pedido pedido(StatusPedido status) {
        Pedido pedido = new Pedido();
        ReflectionTestUtils.setField(pedido, "id", 9L);
        pedido.setCliente(cliente);
        pedido.setAutomovel(automovel);
        pedido.setDataInicio(inicio);
        pedido.setDataFim(inicio.plusDays(3));
        pedido.setValor(300);
        pedido.setStatus(status);
        return pedido;
    }

    @Test
    void criarCalculaValorPelaDiaria() {
        when(clienteRepository.findById(1L)).thenReturn(Optional.of(cliente));
        when(automovelRepository.findById(5L)).thenReturn(Optional.of(automovel));
        when(pedidoRepository.existeReservaNoPeriodo(eq(5L), any(), any(), anyList(), anyLong())).thenReturn(false);
        when(pedidoRepository.save(any(Pedido.class))).thenAnswer(i -> i.getArgument(0));

        PedidoResponse resposta = pedidoService.criar(new PedidoRequest(5L, inicio, inicio.plusDays(5)), usuarioCliente);

        assertEquals(500.0, resposta.valor());
        assertEquals(5, resposta.dias());
        assertEquals("EM_ANALISE", resposta.status());
    }

    @Test
    void criarComDevolucaoAntesDaRetiradaFalha() {
        when(clienteRepository.findById(1L)).thenReturn(Optional.of(cliente));
        when(automovelRepository.findById(5L)).thenReturn(Optional.of(automovel));

        assertThrows(RegraNegocioException.class,
                () -> pedidoService.criar(new PedidoRequest(5L, inicio, inicio.minusDays(1)), usuarioCliente));
        verify(pedidoRepository, never()).save(any());
    }

    @Test
    void criarComCarroJaReservadoFalha() {
        when(clienteRepository.findById(1L)).thenReturn(Optional.of(cliente));
        when(automovelRepository.findById(5L)).thenReturn(Optional.of(automovel));
        when(pedidoRepository.existeReservaNoPeriodo(eq(5L), any(), any(), anyList(), anyLong())).thenReturn(true);

        assertThrows(RegraNegocioException.class,
                () -> pedidoService.criar(new PedidoRequest(5L, inicio, inicio.plusDays(2)), usuarioCliente));
    }

    @Test
    void clienteNaoCancelaPedidoDeOutro() {
        when(pedidoRepository.findById(9L)).thenReturn(Optional.of(pedido(StatusPedido.EM_ANALISE)));

        assertThrows(AcessoNegadoException.class,
                () -> pedidoService.cancelar(9L, new UsuarioLogado(99L, "CLIENTE")));
    }

    @Test
    void naoCancelaPedidoContratado() {
        when(pedidoRepository.findById(9L)).thenReturn(Optional.of(pedido(StatusPedido.CONTRATADO)));

        assertThrows(RegraNegocioException.class, () -> pedidoService.cancelar(9L, usuarioCliente));
    }

    @Test
    void avaliarAprovaEGuardaOAgente() {
        Banco banco = new Banco();
        banco.setId(2L);
        banco.setNome("Banco Teste");
        when(pedidoRepository.findById(9L)).thenReturn(Optional.of(pedido(StatusPedido.EM_ANALISE)));
        when(agenteRepository.findById(2L)).thenReturn(Optional.of(banco));
        when(pedidoRepository.save(any(Pedido.class))).thenAnswer(i -> i.getArgument(0));

        PedidoResponse resposta = pedidoService.avaliar(9L, new AvaliacaoRequest(true, "  Renda ok  "), usuarioBanco);

        assertEquals("APROVADO", resposta.status());
        assertEquals("Renda ok", resposta.parecer());
        assertEquals("Banco Teste", resposta.agenteNome());
    }

    @Test
    void naoAvaliaPedidoJaAvaliado() {
        when(pedidoRepository.findById(9L)).thenReturn(Optional.of(pedido(StatusPedido.REPROVADO)));

        assertThrows(RegraNegocioException.class,
                () -> pedidoService.avaliar(9L, new AvaliacaoRequest(true, "ok"), usuarioBanco));
    }
}
