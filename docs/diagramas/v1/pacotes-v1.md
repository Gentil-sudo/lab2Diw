# Diagrama de Pacotes (Visão Lógica) — v1

O sistema é dividido em dois subsistemas, como pede o enunciado:

1. **Construção das páginas web** (front-end React + Vite)
2. **Gestão de pedidos e contratos** (back-end Spring Boot, arquitetura MVC)

![Diagrama de Pacotes v1](../../imagens/uml/pacotes-v1.png)

<details>
<summary>Código Mermaid do diagrama</summary>

```mermaid
flowchart TB
    subgraph frontend [Subsistema: Construção das Páginas Web - React + Vite]
        pages[pages]
        components[components]
        services_front[services]
    end

    subgraph backend [Subsistema: Gestão de Pedidos e Contratos - Spring Boot]
        controller[controller]
        service[service]
        repository[repository]
        model[model]
        dto[dto]
        security[security]
    end

    db[(Supabase - PostgreSQL)]

    pages --> components
    pages --> services_front
    services_front -- HTTP / JSON --> controller

    controller --> service
    controller --> dto
    service --> repository
    service --> model
    repository --> model
    security --> repository
    repository --> db
```

</details>

## Responsabilidade de cada pacote

| Pacote | Responsabilidade |
|---|---|
| `pages` | Telas do sistema (login, pedidos, clientes, etc.) |
| `components` | Componentes reutilizáveis (menu, formulários) |
| `services` (front) | Chamadas HTTP para a API |
| `controller` | Recebe as requisições HTTP (**C** do MVC) |
| `service` | Regras de negócio (ex.: só cancela pedido em análise) |
| `repository` | Acesso ao banco de dados (Spring Data JPA) |
| `model` | Entidades do sistema (**M** do MVC) |
| `dto` | Objetos de entrada e saída da API |
| `security` | Login e controle de acesso |

> A **View** (**V** do MVC) é o front-end React, que recebe os dados em JSON e monta as páginas.
