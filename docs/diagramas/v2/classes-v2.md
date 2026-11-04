# Diagrama de Classes — v2

Versão revisada depois da implementação. Mostra as classes do pacote `model` como ficaram no código.

![Diagrama de Classes v2](../../imagens/uml/classes-v2.png)

<details>
<summary>Código Mermaid do diagrama</summary>

```mermaid
classDiagram
    class Usuario {
        <<abstract>>
        -Long id
        -String login
        -String senha
        +getPerfil()* String
        +getNome()* String
    }

    class Cliente {
        -String rg
        -String cpf
        -String nome
        -Endereco endereco
        -String profissao
        +MAX_RENDIMENTOS = 3
        +adicionarRendimento(rendimento)
        +limparRendimentos()
    }

    class Endereco {
        <<embeddable>>
        -String cep
        -String logradouro
        -String numero
        -String complemento
        -String bairro
        -String cidade
        -String uf
    }

    class Rendimento {
        -Long id
        -String entidadeEmpregadora
        -double valor
    }

    class Agente {
        <<abstract>>
        -String nome
        -String cnpj
    }

    class Empresa
    class Banco

    class Automovel {
        -Long id
        -String matricula
        -int ano
        -String marca
        -String modelo
        -String placa
        -Double valorDiaria
        -TipoProprietario tipoProprietario
    }

    class Pedido {
        -Long id
        -LocalDate dataInicio
        -LocalDate dataFim
        -double valor
        -StatusPedido status
        -LocalDateTime dataCriacao
        -String parecer
        -LocalDateTime dataAvaliacao
    }

    class Contrato {
        -Long id
        -LocalDate dataAssinatura
        -TipoProprietario tipoProprietario
    }

    class ContratoCredito {
        -Long id
        -double valor
        -double taxaJuros
        -int parcelas
        +calcularParcela() double
    }

    class StatusPedido {
        <<enumeration>>
        EM_ANALISE
        APROVADO
        REPROVADO
        CANCELADO
        CONTRATADO
    }

    class TipoProprietario {
        <<enumeration>>
        CLIENTE
        EMPRESA
        BANCO
    }

    Usuario <|-- Cliente
    Usuario <|-- Agente
    Agente <|-- Empresa
    Agente <|-- Banco

    Cliente *-- Endereco : mora em
    Cliente "1" *-- "0..3" Rendimento : possui
    Cliente "1" --> "0..*" Pedido : faz
    Pedido "0..*" --> "1" Automovel : aluga
    Automovel "0..*" --> "1" Usuario : proprietário
    Agente "1" --> "0..*" Pedido : avalia
    Pedido "1" -- "0..1" Contrato : gera
    Agente "1" --> "0..*" Contrato : assina
    Contrato "1" -- "0..1" ContratoCredito : possui
    Banco "1" --> "0..*" ContratoCredito : concede
```

</details>

## Classes de serviço (regras de negócio)

Na v1 as operações estavam nas entidades. Na v2 elas foram para a camada `service`, como manda o MVC com Spring.

![Classes de serviço v2](../../imagens/uml/classes-servicos-v2.png)

<details>
<summary>Código Mermaid do diagrama</summary>

```mermaid
classDiagram
    class AuthService {
        +cadastrarCliente(dados) ClienteResponse
        +cadastrarAgente(dados) AgenteResponse
        +login(dados) LoginResponse
    }

    class ClienteService {
        +listar() List
        +buscar(id, usuario) ClienteResponse
        +atualizar(id, dados, usuario) ClienteResponse
        +excluir(id, usuario)
    }

    class AutomovelService {
        +listar() List
        +buscar(id) AutomovelResponse
        +criar(dados, usuario) AutomovelResponse
        +atualizar(id, dados, usuario) AutomovelResponse
        +excluir(id, usuario)
    }

    class PedidoService {
        +listar(usuario, status) List
        +buscar(id, usuario) PedidoResponse
        +criar(dados, usuario) PedidoResponse
        +modificar(id, dados, usuario) PedidoResponse
        +cancelar(id, usuario) PedidoResponse
        +ajustar(id, dados) PedidoResponse
        +avaliar(id, dados, usuario) PedidoResponse
    }

    class ContratoService {
        +listar(usuario) List
        +buscar(id, usuario) ContratoResponse
        +executar(dados, usuario) ContratoResponse
        +concederCredito(id, dados, usuario) ContratoResponse
    }
```

</details>

## O que mudou da v1 para a v2

| Classe | Mudança | Motivo |
|---|---|---|
| `Cliente` | `endereco` virou a classe `Endereco` (embutida na tabela) | Guardar CEP, rua, número, bairro, cidade e UF separados e preencher pelo CEP |
| `Cliente` | Ganhou `adicionarRendimento` e `limparRendimentos` | A regra de no máximo 3 rendimentos fica na própria entidade |
| `Automovel` | Ganhou `valorDiaria` | O valor do pedido é calculado como dias × diária |
| `Automovel` | Ganhou a associação `proprietario` (Usuario) | Registrar de quem é o carro: cliente, empresa ou banco |
| `Pedido` | Ganhou `dataCriacao`, `dataAvaliacao` e o `agenteAvaliador` | Saber quando o pedido foi feito, quando e por quem foi avaliado |
| `Contrato` | Ganhou a associação com o `Agente` que assinou | Saber quem executou o contrato |
| `ContratoCredito` | Ganhou `calcularParcela()` (tabela Price) | Mostrar a parcela e o total ao cliente |
| `Usuario`, `Cliente`, `Agente`, `Banco` | Os métodos `login`, `criarPedido`, `avaliarPedido`, `executarContrato` e `concederCredito` saíram das entidades | Foram para as classes `service` |
