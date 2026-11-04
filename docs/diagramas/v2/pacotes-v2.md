# Diagrama de Pacotes (Visão Lógica) — v2

![Diagrama de Pacotes v2](../../imagens/uml/pacotes-v2.png)

<details>
<summary>Código Mermaid do diagrama</summary>

```mermaid
flowchart TB
    subgraph frontend [Subsistema: Construção das Páginas Web - React + Vite]
        pages[pages]
        components[components]
        context[context]
        services_front[services]
        utils[utils]
    end

    subgraph backend [Subsistema: Gestão de Pedidos e Contratos - Spring Boot]
        controller[controller]
        service[service]
        repository[repository]
        model[model]
        dto[dto]
        security[security]
        exception[exception]
    end

    db[(Supabase - PostgreSQL)]
    viacep[ViaCEP]

    pages --> components
    pages --> context
    pages --> services_front
    pages --> utils
    components --> utils
    context --> services_front
    services_front -- HTTP / JSON + JWT --> controller
    components -- busca CEP --> viacep

    controller --> service
    controller --> dto
    controller --> security
    service --> repository
    service --> model
    service --> dto
    service --> exception
    dto --> model
    repository --> model
    security --> repository
    repository --> db
```

</details>

## Responsabilidade de cada pacote

| Pacote | Responsabilidade |
|---|---|
| `pages` | Telas: login, cadastro, início, meus dados, automóveis, pedidos, análise, contratos, clientes |
| `components` | Componentes reutilizáveis: menu, modal, campos, endereço, rendimentos, status |
| `context` | Guarda o usuário logado e o token (`AuthContext`) |
| `services` (front) | Chamadas HTTP para a API, mandando o token |
| `utils` | Máscaras de CPF, CNPJ, CEP, placa, dinheiro e porcentagem |
| `controller` | Recebe as requisições HTTP (**C** do MVC) |
| `service` | Regras de negócio |
| `repository` | Acesso ao banco de dados (Spring Data JPA) |
| `model` | Entidades do sistema (**M** do MVC) |
| `dto` | Objetos de entrada e saída da API, com as validações |
| `security` | Login com JWT, senha com BCrypt e permissões por perfil |
| `exception` | Erros de negócio e o tratamento padrão das respostas de erro |

## O que mudou da v1 para a v2

- No back-end entrou o pacote `exception`, para devolver os erros sempre no mesmo formato.
- No front-end entraram os pacotes `context` (sessão do usuário) e `utils` (máscaras dos campos).
- Entrou o serviço externo **ViaCEP**, que preenche o endereço a partir do CEP.
