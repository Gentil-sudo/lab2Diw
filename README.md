# 🚗 Sistema de Aluguel de Carros

> Sistema web para apoio à gestão de aluguéis de automóveis, permitindo efetuar, modificar, consultar e cancelar pedidos pela Internet, com avaliação financeira por agentes (empresas e bancos) e geração de contratos.

Laboratório 02 — Desenvolvimento e Integração de Aplicações Web (DIAW) · Engenharia de Software · PUC Minas

---

## 🚧 Status do Projeto

![Status](https://img.shields.io/badge/status-concluído-brightgreen)
![Java](https://img.shields.io/badge/Java-25-orange?logo=openjdk)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-4.0.x-6DB33F?logo=springboot)
![Maven](https://img.shields.io/badge/Maven-3.9-C71A36?logo=apachemaven)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?logo=supabase)

---

## 📚 Índice

- [Links Úteis](#-links-úteis)
- [Sobre o Projeto](#-sobre-o-projeto)
- [Funcionalidades Principais](#-funcionalidades-principais)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Arquitetura](#-arquitetura)
- [Modelagem](#-modelagem)
- [Instalação e Execução](#-instalação-e-execução)
- [Estrutura de Pastas](#-estrutura-de-pastas)
- [Demonstração](#-demonstração)
- [Testes](#-testes)
- [Autores](#-autores)
- [Contribuição](#-contribuição)
- [Agradecimentos](#-agradecimentos)
- [Licença](#-licença)

---

## 🔗 Links Úteis

- **Repositório:** https://github.com/Gentil-sudo/lab2Diw
- **Enunciado:** Laboratório 02 — Sistema de Aluguel de Carros (Prof. João Paulo Carneiro Aramuni)

---

## 📝 Sobre o Projeto

O sistema só pode ser utilizado após **cadastro prévio e autenticação** (usuário e senha).

- **Clientes** (usuários individuais) podem **introduzir, modificar, consultar e cancelar** pedidos de aluguel.
- **Agentes** (empresas e bancos) podem **modificar e avaliar** pedidos.
- Após introduzidos, os pedidos são **analisados financeiramente** pelos agentes e, em caso de parecer positivo, seguem para **execução do contrato**.
- Dependendo do tipo de contrato, o automóvel pode ser registrado como **propriedade do cliente, da empresa ou do banco**.
- O aluguel pode estar associado a um **contrato de crédito** concedido por um banco agente.

O sistema é dividido em dois subsistemas:

1. **Gestão de pedidos e contratos** — back-end Spring Boot (API REST, arquitetura MVC).
2. **Construção dinâmica das páginas web** — front-end React + Vite.

---

## ✨ Funcionalidades Principais

- 🔐 **Autenticação** com login obrigatório e autorização por perfil (Cliente, Empresa, Banco).
- 👤 **CRUD de Cliente** com dados de identificação (RG, CPF, nome, endereço), profissão e até 3 rendimentos.
- 🏢 **Cadastro de Agentes** (empresas e bancos).
- 🚙 **Cadastro de Automóveis** (matrícula, ano, marca, modelo, placa, valor da diária e proprietário).
- 📄 **Pedidos de Aluguel**: criar, modificar, consultar status e cancelar, com cálculo automático do valor e bloqueio de datas já reservadas.
- ✅ **Avaliação financeira** de pedidos pelos agentes (ajuste de datas/valor e parecer positivo/negativo), mostrando o comprometimento da renda do cliente.
- 📝 **Execução de Contrato** e registro de propriedade do automóvel (cliente, empresa ou banco).
- 💳 **Contrato de Crédito** concedido por banco, com parcela calculada pela tabela Price.

---

## 🛠 Tecnologias Utilizadas

### 💻 Front-end
- React 19
- Vite 8
- React Router 7
- CSS puro (design system gerado com a skill UI UX Pro Max)

### 🖥️ Back-end
- Java — JDK 25
- Spring Boot 4.0.x (Web MVC, Data JPA, Security com JWT, Validation)
- Apache Maven
- JUnit 5 + Mockito (testes)

### 🗄️ Banco de Dados
- Supabase (PostgreSQL)

---

## 🏗 Arquitetura

O back-end segue a arquitetura **MVC** com Spring Boot:

- **Model**: entidades JPA salvas no Supabase (PostgreSQL).
- **Controller**: endpoints REST que recebem as requisições do front-end.
- **Service**: regras de negócio (status do pedido, limite de rendimentos, contratos, crédito).
- **View**: o front-end React + Vite, que consome a API e monta as páginas.

```
React (View)  →  Controller  →  Service  →  Repository  →  Supabase
```

Detalhes no [Diagrama de Pacotes](docs/diagramas/v2/pacotes-v2.md).

---

## 📐 Modelagem

Os modelos UML ficam versionados em [`docs/`](docs/):

| Artefato | Versão inicial (v1) | Versão revisada (v2) |
|---|---|---|
| Histórias de Usuário | [v1](docs/historias-usuario/historias-usuario-v1.md) | [v2](docs/historias-usuario/historias-usuario-v2.md) |
| Diagrama de Casos de Uso | [v1](docs/diagramas/v1/casos-de-uso-v1.md) | [v2](docs/diagramas/v2/casos-de-uso-v2.md) |
| Diagrama de Classes | [v1](docs/diagramas/v1/classes-v1.md) | [v2](docs/diagramas/v2/classes-v2.md) |
| Diagrama de Pacotes | [v1](docs/diagramas/v1/pacotes-v1.md) | [v2](docs/diagramas/v2/pacotes-v2.md) |

### Modelo inicial x modelo final

A v1 foi feita antes de começar o código. A v2 mostra como o sistema ficou de fato. As principais diferenças:

| Ponto | v1 (inicial) | v2 (final) |
|---|---|---|
| Endereço do cliente | Um texto só | Classe `Endereco` com CEP, rua, número, bairro, cidade e UF, preenchida pelo CEP |
| Valor do pedido | Não dizia como calcular | Dias × `valorDiaria` do automóvel. O agente pode negociar outro valor |
| Proprietário do carro | Só o `tipoProprietario` | Associação `proprietario` com o usuário dono. Muda ao executar o contrato |
| Avaliação | Só `parecer` | Parecer obrigatório, mais `agenteAvaliador` e `dataAvaliacao` |
| Operações | Métodos nas entidades (`criarPedido`, `avaliarPedido`...) | Ficaram nas classes `service` (padrão MVC do Spring) |
| Crédito | Valor, juros e parcelas | Mais o cálculo da parcela (Price) e limites de valor, juros e parcelas |
| Casos de uso | 12 | 15: o ajuste pelo agente foi separado, e entraram consultar clientes e consultar automóveis |
| Pacotes | MVC básico | Mais `exception` no back-end e `context`/`utils` no front-end |

O diagrama de estados do pedido está nas [histórias v2](docs/historias-usuario/historias-usuario-v2.md#status-do-pedido).

---

## 🔧 Instalação e Execução

### Pré-requisitos

- JDK 25
- Apache Maven 3.9+
- Node.js 20.19+ / npm
- Projeto criado no [Supabase](https://supabase.com/)

### 1. Banco de dados (Supabase)

1. Crie um projeto no Supabase.
2. Clique em **Connect** e escolha **Session pooler**. Copie o host, o usuário e a senha.
3. As tabelas são criadas sozinhas pelo Hibernate quando o back-end sobe (`ddl-auto=update`).

### 2. Back-end

```bash
cd backend
cp .env.example .env     # preencha DB_URL, DB_USERNAME, DB_PASSWORD e JWT_SECRET
mvn spring-boot:run
```

A API sobe em `http://localhost:8080/api`. O arquivo [`backend/requests.http`](backend/requests.http) tem exemplos de todas as requisições (extensão REST Client do VS Code).

### 3. Front-end

```bash
cd frontend
cp .env.example .env     # VITE_API_URL=http://localhost:8080/api
npm install
npm run dev
```

Acesse `http://localhost:5173`.

### Roteiro rápido para testar

1. Cadastre uma **empresa** ou um **banco** e cadastre um automóvel com o valor da diária.
2. Cadastre um **cliente** com rendimentos e faça um pedido para esse carro.
3. Entre como agente, abra **Análise de pedidos**, ajuste se quiser e **aprove** com um parecer.
4. Ainda como agente, clique em **Executar contrato** e escolha quem fica dono do carro.
5. Entre como **banco**, abra **Contratos** e clique em **Conceder crédito**.
6. Entre como cliente e veja o contrato e as parcelas em **Contratos**.

### Endpoints principais

| Método | Rota | Quem usa |
|---|---|---|
| POST | `/api/auth/cadastro/cliente`, `/api/auth/cadastro/agente`, `/api/auth/login` | Todos (sem login) |
| GET / PUT / DELETE | `/api/clientes/me`, `/api/clientes/{id}` | Cliente |
| GET | `/api/clientes` | Agentes |
| GET / POST / PUT / DELETE | `/api/automoveis` | Todos veem, agentes alteram |
| GET / POST / PUT | `/api/pedidos` | Cliente cria e modifica |
| PATCH | `/api/pedidos/{id}/cancelar` | Cliente |
| PATCH | `/api/pedidos/{id}/ajustar`, `/api/pedidos/{id}/avaliar` | Agentes |
| GET / POST | `/api/contratos` | Agentes executam, todos consultam |
| POST | `/api/contratos/{id}/credito` | Banco |

---

## 📂 Estrutura de Pastas

```
.
├── backend/                    # API REST — Spring Boot (MVC)
│   ├── src/main/java/br/pucminas/aluguel/
│   │   ├── controller/         # Endpoints REST
│   │   ├── service/            # Regras de negócio
│   │   ├── repository/         # Acesso ao banco (Spring Data JPA)
│   │   ├── model/              # Entidades
│   │   ├── dto/                # Entrada e saída da API
│   │   ├── security/           # JWT, BCrypt e permissões
│   │   └── exception/          # Erros e respostas de erro
│   ├── src/test/               # Testes (JUnit + Mockito)
│   └── requests.http           # Requisições de exemplo
├── frontend/                   # Interface web — React + Vite
│   └── src/
│       ├── pages/              # Telas
│       ├── components/         # Componentes reutilizáveis
│       ├── context/            # Usuário logado
│       ├── services/           # Chamadas à API
│       └── utils/              # Máscaras e formatação
├── docs/
│   ├── historias-usuario/      # Histórias de usuário (v1, v2)
│   ├── diagramas/              # Diagramas UML em Mermaid (v1, v2)
│   └── design-system.md        # Cores, fontes e padrões visuais
└── README.md
```

---

## 🎥 Demonstração

| Perfil | Telas |
|---|---|
| Cliente | Início, Meus pedidos, Contratos, Automóveis, Meus dados |
| Empresa | Início, Análise de pedidos, Contratos, Automóveis, Clientes |
| Banco | Tudo o que a empresa tem, mais conceder crédito em Contratos |

---

## 🧪 Testes

Os testes de unidade não precisam do banco de dados. Eles usam Mockito no lugar dos repositórios.

```bash
cd backend
mvn test
```

| Classe de teste | O que verifica |
|---|---|
| `ClienteTest` | Limite de 3 rendimentos |
| `ContratoCreditoTest` | Cálculo da parcela (com e sem juros) |
| `PedidoServiceTest` | Cálculo do valor, datas inválidas, carro já reservado, cancelamento e avaliação |
| `ContratoServiceTest` | Execução do contrato, troca do proprietário do carro e regras do crédito |

---

## 👥 Autores

| Nome | GitHub |
|---|---|
| Enzo Gentil | [@Gentil-sudo](https://github.com/Gentil-sudo) |

---

## 🤝 Contribuição

1. Faça um fork do projeto.
2. Crie uma branch: `git checkout -b feat/minha-feature`.
3. Siga o padrão [Conventional Commits](https://www.conventionalcommits.org/pt-br/).
4. Abra um Pull Request.

---

## 🙏 Agradecimentos

- Prof. João Paulo Carneiro Aramuni — Engenharia de Software, PUC Minas.

---

## 📄 Licença

Projeto acadêmico desenvolvido para fins educacionais.
