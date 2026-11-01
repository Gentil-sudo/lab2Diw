# Diagrama de Casos de Uso — v1

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
    end

    Cliente --- UC01
    Cliente --- UC02
    Cliente --- UC03
    Cliente --- UC04
    Cliente --- UC05
    Cliente --- UC06
    Cliente --- UC07
    Cliente --- UC12

    Agente --- UC01
    Agente --- UC02
    Agente --- UC05
    Agente --- UC06
    Agente --- UC08
    Agente --- UC09
    Agente --- UC11
    Agente --- UC12

    Banco --- UC10
```

## Descrição dos casos de uso

| Caso de uso | Atores | Histórias |
|---|---|---|
| UC01 — Realizar login | Cliente, Agente | US03, US04 |
| UC02 — Cadastrar-se | Cliente, Agente | US01, US02 |
| UC03 — Manter dados do cliente | Cliente | US05, US06 |
| UC04 — Criar pedido | Cliente | US09 |
| UC05 — Consultar pedidos | Cliente, Agente | US10, US13 |
| UC06 — Modificar pedido | Cliente, Agente | US11, US14 |
| UC07 — Cancelar pedido | Cliente | US12 |
| UC08 — Avaliar pedido | Agente | US15 |
| UC09 — Executar contrato | Agente | US16 |
| UC10 — Conceder crédito | Banco | US17 |
| UC11 — Manter automóveis | Agente | US07, US08 |
| UC12 — Consultar contratos | Cliente, Agente | US18 |

> Todos os casos de uso (menos UC01 e UC02) exigem que o usuário esteja logado.
