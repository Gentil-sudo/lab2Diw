# Diagrama de Classes — v1

![Diagrama de Classes v1](../../imagens/uml/classes-v1.png)

<details>
<summary>Código Mermaid do diagrama</summary>

```mermaid
classDiagram
    class Usuario {
        <<abstract>>
        -Long id
        -String login
        -String senha
        +login(login, senha) boolean
    }

    class Cliente {
        -String rg
        -String cpf
        -String nome
        -String endereco
        -String profissao
        +criarPedido(automovel, dataInicio, dataFim) Pedido
        +modificarPedido(pedido)
        +cancelarPedido(pedido)
        +consultarPedidos() List~Pedido~
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
        +modificarPedido(pedido)
        +avaliarPedido(pedido, aprovado, parecer)
        +executarContrato(pedido, tipoProprietario) Contrato
    }

    class Empresa

    class Banco {
        +concederCredito(contrato, valor, taxaJuros, parcelas) ContratoCredito
    }

    class Automovel {
        -Long id
        -String matricula
        -int ano
        -String marca
        -String modelo
        -String placa
        -TipoProprietario tipoProprietario
    }

    class Pedido {
        -Long id
        -LocalDate dataInicio
        -LocalDate dataFim
        -double valor
        -StatusPedido status
        -String parecer
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

    Cliente "1" *-- "0..3" Rendimento : possui
    Cliente "1" --> "0..*" Pedido : faz
    Pedido "0..*" --> "1" Automovel : aluga
    Agente "1" --> "0..*" Pedido : avalia
    Pedido "1" -- "0..1" Contrato : gera
    Contrato "1" -- "0..1" ContratoCredito : possui
    Banco "1" --> "0..*" ContratoCredito : concede
```

</details>

## Observações

- Um cliente pode ter no máximo **3 rendimentos**.
- `Agente` é abstrato e se especializa em `Empresa` e `Banco`.
- Só o `Banco` pode conceder um `ContratoCredito`.
- O `tipoProprietario` do contrato define de quem o automóvel passa a ser propriedade.
