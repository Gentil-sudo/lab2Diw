package br.pucminas.aluguel.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
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

import br.pucminas.aluguel.dto.ContratoRequest;
import br.pucminas.aluguel.dto.ContratoResponse;
import br.pucminas.aluguel.dto.CreditoRequest;
import br.pucminas.aluguel.exception.AcessoNegadoException;
import br.pucminas.aluguel.exception.RegraNegocioException;
import br.pucminas.aluguel.model.Automovel;
import br.pucminas.aluguel.model.Banco;
import br.pucminas.aluguel.model.Cliente;
import br.pucminas.aluguel.model.Contrato;
import br.pucminas.aluguel.model.ContratoCredito;
import br.pucminas.aluguel.model.Empresa;
import br.pucminas.aluguel.model.Pedido;
import br.pucminas.aluguel.model.StatusPedido;
import br.pucminas.aluguel.model.TipoProprietario;
import br.pucminas.aluguel.repository.AgenteRepository;
import br.pucminas.aluguel.repository.ContratoCreditoRepository;
import br.pucminas.aluguel.repository.ContratoRepository;
import br.pucminas.aluguel.repository.PedidoRepository;
import br.pucminas.aluguel.security.UsuarioLogado;

@ExtendWith(MockitoExtension.class)
class ContratoServiceTest {

    @Mock
    private ContratoRepository contratoRepository;
    @Mock
    private ContratoCreditoRepository creditoRepository;
    @Mock
    private PedidoRepository pedidoRepository;
    @Mock
    private AgenteRepository agenteRepository;

    @InjectMocks
    private ContratoService contratoService;

    private final UsuarioLogado usuarioEmpresa = new UsuarioLogado(2L, "EMPRESA");
    private final UsuarioLogado usuarioBanco = new UsuarioLogado(3L, "BANCO");

    private Cliente cliente;
    private Empresa empresa;
    private Banco banco;
    private Pedido pedido;

    @BeforeEach
    void preparar() {
        cliente = new Cliente();
        cliente.setId(1L);
        cliente.setNome("João");

        empresa = new Empresa();
        empresa.setId(2L);
        empresa.setNome("Locadora");

        banco = new Banco();
        banco.setId(3L);
        banco.setNome("Banco Teste");

        Automovel automovel = new Automovel();
        automovel.setMarca("Fiat");
        automovel.setModelo("Argo");
        automovel.setTipoProprietario(TipoProprietario.EMPRESA);
        automovel.setProprietario(empresa);

        pedido = new Pedido();
        ReflectionTestUtils.setField(pedido, "id", 9L);
        pedido.setCliente(cliente);
        pedido.setAutomovel(automovel);
        pedido.setDataInicio(LocalDate.now().plusDays(5));
        pedido.setDataFim(LocalDate.now().plusDays(10));
        pedido.setValor(500);
        pedido.setStatus(StatusPedido.APROVADO);
    }

    private Contrato contrato() {
        Contrato contrato = new Contrato();
        ReflectionTestUtils.setField(contrato, "id", 4L);
        contrato.setPedido(pedido);
        contrato.setAgente(empresa);
        contrato.setTipoProprietario(TipoProprietario.EMPRESA);
        return contrato;
    }

    @Test
    void executarPassaOCarroParaOClienteEMarcaContratado() {
        when(pedidoRepository.findById(9L)).thenReturn(Optional.of(pedido));
        when(agenteRepository.findById(2L)).thenReturn(Optional.of(empresa));
        when(contratoRepository.save(any(Contrato.class))).thenAnswer(i -> i.getArgument(0));

        ContratoResponse resposta = contratoService.executar(new ContratoRequest(9L, TipoProprietario.CLIENTE), usuarioEmpresa);

        assertEquals("CLIENTE", resposta.tipoProprietario());
        assertEquals(StatusPedido.CONTRATADO, pedido.getStatus());
        assertEquals(cliente, pedido.getAutomovel().getProprietario());
        assertEquals(TipoProprietario.CLIENTE, pedido.getAutomovel().getTipoProprietario());
    }

    @Test
    void naoExecutaPedidoQueNaoFoiAprovado() {
        pedido.setStatus(StatusPedido.EM_ANALISE);
        when(pedidoRepository.findById(9L)).thenReturn(Optional.of(pedido));

        assertThrows(RegraNegocioException.class,
                () -> contratoService.executar(new ContratoRequest(9L, TipoProprietario.CLIENTE), usuarioEmpresa));
    }

    @Test
    void empresaNaoPodeColocarBancoComoProprietario() {
        when(pedidoRepository.findById(9L)).thenReturn(Optional.of(pedido));
        when(agenteRepository.findById(2L)).thenReturn(Optional.of(empresa));

        assertThrows(RegraNegocioException.class,
                () -> contratoService.executar(new ContratoRequest(9L, TipoProprietario.BANCO), usuarioEmpresa));
    }

    @Test
    void empresaNaoConcedeCredito() {
        when(contratoRepository.findById(4L)).thenReturn(Optional.of(contrato()));
        when(agenteRepository.findById(2L)).thenReturn(Optional.of(empresa));

        assertThrows(AcessoNegadoException.class,
                () -> contratoService.concederCredito(4L, new CreditoRequest(300.0, 1.5, 6), usuarioEmpresa));
    }

    @Test
    void creditoNaoPodePassarDoValorDoContrato() {
        when(contratoRepository.findById(4L)).thenReturn(Optional.of(contrato()));
        when(agenteRepository.findById(3L)).thenReturn(Optional.of(banco));
        when(creditoRepository.existsByContratoId(4L)).thenReturn(false);

        assertThrows(RegraNegocioException.class,
                () -> contratoService.concederCredito(4L, new CreditoRequest(900.0, 1.5, 6), usuarioBanco));
    }

    @Test
    void bancoConcedeCredito() {
        when(contratoRepository.findById(4L)).thenReturn(Optional.of(contrato()));
        when(agenteRepository.findById(3L)).thenReturn(Optional.of(banco));
        when(creditoRepository.existsByContratoId(4L)).thenReturn(false);
        when(creditoRepository.save(any(ContratoCredito.class))).thenAnswer(i -> i.getArgument(0));

        ContratoResponse resposta = contratoService.concederCredito(4L, new CreditoRequest(300.0, 1.5, 6), usuarioBanco);

        assertNotNull(resposta.credito());
        assertEquals("Banco Teste", resposta.credito().bancoNome());
        assertEquals(52.66, resposta.credito().valorParcela(), 0.01);
    }
}
