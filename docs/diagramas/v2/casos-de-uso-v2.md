# Diagrama de Casos de Uso — v2

![Diagrama de Casos de Uso v2](../../imagens/uml/casos-de-uso-v2.png)

<details>
<summary>Código Mermaid do diagrama</summary>

```mermaid
flowchart LR
    Cliente((Cliente))
    Agente((Agente))
    Empresa((Empresa))
    Banco((Banco))

    Empresa -. é um .-> Agente
    Banco -. é um .-> Agente

    subgraph Sistema de Aluguel de Carros
        UC01([Realizar login])
        UC02([Cadastrar-se])
        UC03([Manter dados do cliente])
        UC04([Criar pedido])
        UC05([Consultar pedidos])
        UC06([Modificar pedido])
        UC07([Cancelar pedido])
        UC08([Avaliar pedido])
        UC09([Executar contrato])
        UC10([Conceder crédito])
        UC11([Manter automóveis])
        UC12([Consultar contratos])
        UC13([Ajustar pedido])
        UC14([Consultar clientes])
        UC15([Consultar automóveis])
    end

    Cliente --- UC01
    Cliente --- UC02
    Cliente --- UC03
    Cliente --- UC04
    Cliente --- UC05
    Cliente --- UC06
    Cliente --- UC07
    Cliente --- UC12
    Cliente --- UC15

    Agente --- UC01
    Agente --- UC02
    Agente --- UC05
    Agente --- UC08
    Agente --- UC09
    Agente --- UC11
    Agente --- UC12
    Agente --- UC13
    Agente --- UC14
    Agente --- UC15

    Banco --- UC10

    UC08 -. include .-> UC14
```

</details>

## Descrição dos casos de uso

| Caso de uso | Atores | Histórias |
|---|---|---|
| UC01 — Realizar login | Cliente, Agente | US03, US04 |
| UC02 — Cadastrar-se | Cliente, Agente | US01, US02 |
| UC03 — Manter dados do cliente | Cliente | US05, US06 |
| UC04 — Criar pedido | Cliente | US09 |
| UC05 — Consultar pedidos | Cliente, Agente | US10, US13 |
| UC06 — Modificar pedido | Cliente | US11 |
| UC07 — Cancelar pedido | Cliente | US12 |
| UC08 — Avaliar pedido | Agente | US15 |
| UC09 — Executar contrato | Agente | US16 |
| UC10 — Conceder crédito | Banco | US17 |
| UC11 — Manter automóveis | Agente | US07, US08 |
| UC12 — Consultar contratos | Cliente, Agente | US18 |
| UC13 — Ajustar pedido | Agente | US14 |
| UC14 — Consultar clientes | Agente | US19 |
| UC15 — Consultar automóveis | Cliente, Agente | US20 |

## O que mudou da v1 para a v2

- **UC06** foi dividido em dois. O cliente **modifica** o pedido (carro e datas). O agente **ajusta** o pedido (**UC13**: datas e valor negociado). As regras e as telas de cada um são diferentes.
- **UC14 — Consultar clientes**: o agente precisa ver a renda do cliente para dar o parecer. Por isso a avaliação inclui esse caso de uso.
- **UC15 — Consultar automóveis**: o cliente escolhe o carro na lista e já abre o pedido a partir dela.

> Todos os casos de uso (menos UC01 e UC02) exigem que o usuário esteja logado.
