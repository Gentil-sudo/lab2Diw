---

# 🚗 Sistema de Aluguel de Carros 👨‍💻

> [!NOTE]
> Site onde clientes pedem o aluguel de um carro, empresas e bancos analisam o pedido e, se aprovado, fecham o contrato, **com financiamento opcional pelo banco**.
> Laboratório 02 da disciplina DIAW · Engenharia de Software · PUC Minas.

<table>
  <tr>
    <td width="800px">
      <div align="justify">
        O <b>Sistema de Aluguel de Carros</b> é uma aplicação web que digitaliza todo o processo de aluguel de automóveis: do <i>pedido</i> feito pelo cliente, passando pela <i>análise financeira</i> feita por empresas e bancos, até a <i>execução do contrato</i> e a <i>concessão de crédito</i>. O sistema tem <b>três perfis de acesso</b> (Cliente, Empresa e Banco), cada um com suas próprias telas e permissões. O back-end é uma <b>API REST em Spring Boot</b> no padrão MVC, com autenticação via <b>JWT</b>, e o front-end é uma <b>SPA em React + Vite</b>. Os dados ficam em um banco <b>PostgreSQL hospedado no Supabase</b>.
      </div>
    </td>
    <td>
      <div>
        <img src="frontend/public/carro.svg" alt="Logo do Projeto" width="120px"/>
      </div>
    </td>
  </tr>
</table>

---

## 🚧 Status do Projeto

[![Status](https://img.shields.io/badge/Status-Concluído-brightgreen?style=for-the-badge)](#-status-do-projeto)
[![Versão](https://img.shields.io/badge/Versão-v1.0.0-blue?style=for-the-badge)](https://github.com/Gentil-sudo/lab2Diw)
![React](https://img.shields.io/badge/React-19.3.1-007ec6?style=for-the-badge&logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8.3.5-007ec6?style=for-the-badge&logo=vite&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-7.18.5-007ec6?style=for-the-badge&logo=reactrouter&logoColor=white)
![Java](https://img.shields.io/badge/Java-25-007ec6?style=for-the-badge&logo=openjdk&logoColor=white)
![Maven](https://img.shields.io/badge/Maven-3.9-007ec6?style=for-the-badge&logo=apachemaven&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-4.0.9-007ec6?style=for-the-badge&logo=springboot&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-007ec6?style=for-the-badge&logo=supabase&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Render-007ec6?style=for-the-badge&logo=docker&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-Front--end-007ec6?style=for-the-badge&logo=vercel&logoColor=white)
![GitHub repo size](https://img.shields.io/github/repo-size/Gentil-sudo/lab2Diw?style=for-the-badge&logo=files)
![GitHub language count](https://img.shields.io/github/languages/count/Gentil-sudo/lab2Diw?style=for-the-badge&logo=github)
![GitHub commit activity](https://img.shields.io/github/commit-activity/m/Gentil-sudo/lab2Diw?style=for-the-badge&color=007ec6&logo=gitkraken)
![GitHub last commit](https://img.shields.io/github/last-commit/Gentil-sudo/lab2Diw?style=for-the-badge&logo=clockify)

---

## 📚 Índice
- [Links Úteis](#-links-úteis)
- [Sobre o Projeto](#-sobre-o-projeto)
- [Funcionalidades Principais](#-funcionalidades-principais)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Arquitetura](#-arquitetura)
  - [Diagramas](#diagramas)
  - [Modelo inicial x modelo final](#modelo-inicial-x-modelo-final)
- [Instalação e Execução](#-instalação-e-execução)
  - [Pré-requisitos](#pré-requisitos)
  - [Variáveis de Ambiente](#-variáveis-de-ambiente)
     - [1 Back-end (Spring Boot)](#1-back-end-spring-boot)
     - [2 Front-end (React, Vite)](#2-front-end-react-vite)
     - [3 Variáveis de Ambiente na Vercel e no Render](#3-variáveis-de-ambiente-na-vercel-e-no-render)
  - [Instalação de Dependências](#-instalação-de-dependências)
  - [Inicialização do Banco de Dados (Supabase)](#-inicialização-do-banco-de-dados-supabase)
  - [Como Executar a Aplicação](#-como-executar-a-aplicação)
    - [Terminal 1: Back-end (Spring Boot)](#terminal-1-back-end-spring-boot)
    - [Terminal 2: Front-end (React, Vite)](#terminal-2-front-end-react-vite)
    - [Execução do Back-end com Docker](#-execução-do-back-end-com-docker)
  - [Roteiro rápido para testar](#-roteiro-rápido-para-testar)
- [Deploy](#-deploy)
- [Estrutura de Pastas](#-estrutura-de-pastas)
- [Demonstração](#-demonstração)
  - [Aplicação Web](#-aplicação-web)
  - [Exemplo de saída no Terminal (API)](#-exemplo-de-saída-no-terminal-api)
- [Testes](#-testes)
- [Documentações utilizadas](#-documentações-utilizadas)
- [Autores](#-autores)
- [Contribuição](#-contribuição)
- [Agradecimentos](#-agradecimentos)
- [Licença](#-licença)

---

## 🔗 Links Úteis
* 🌐 **Demo Online:** [Acesse a Aplicação Web](https://lab2-diw.vercel.app)
  > 💻 **Descrição:** Front-end hospedado na **Vercel**, consumindo a API hospedada no **Render**.
* 🖥️ **API em produção:** [https://lab2diw.onrender.com/api](https://lab2diw.onrender.com/api)
  > ⏳ **Atenção:** o back-end está no plano gratuito do Render, que "dorme" após 15 minutos sem uso. A **primeira requisição pode levar cerca de 50 segundos**. Se o login falhar na primeira tentativa, aguarde e tente novamente.
* 📖 **Documentação:** [Diagramas e histórias de usuário (`docs/`)](docs/)
  > 📚 **Descrição:** Histórias de usuário, diagramas UML (casos de uso, classes e pacotes) e design system.
* 🧪 **Requisições de exemplo da API:** [`backend/requests.http`](backend/requests.http)
  > 🔌 **Descrição:** Exemplos de todas as requisições, prontos para a extensão REST Client do VS Code.

---

## 📝 Sobre o Projeto

O projeto nasceu como o **Laboratório 02** da disciplina de **Desenvolvimento de Interfaces Web (DIAW)** do curso de Engenharia de Software da PUC Minas. O objetivo é modelar e implementar um sistema de aluguel de carros que **substitui um processo manual** (papelada, análise de renda e assinatura de contrato) por um fluxo **100% online**.

Para usar o site é preciso criar uma conta e entrar com login e senha. Existem três tipos de conta:

- **Cliente:** faz o pedido de aluguel escolhendo o carro e as datas. Pode alterar ou cancelar o pedido enquanto ele não foi fechado e acompanha o status de cada um.
- **Empresa:** cadastra os carros, analisa os pedidos olhando a renda do cliente, aprova ou reprova com um parecer e fecha o contrato dos aprovados.
- **Banco:** faz tudo o que a empresa faz e ainda pode financiar o aluguel com um contrato de crédito (valor, juros e parcelas).

Ao fechar o contrato, o agente escolhe em nome de quem o carro fica registrado: do cliente, da empresa ou do banco.

O projeto tem duas partes:

1. **Back-end** em Spring Boot (API REST no padrão MVC): cuida dos pedidos, contratos e regras de negócio.
2. **Front-end** em React + Vite: monta as telas e conversa com a API.

---

## ✨ Funcionalidades Principais

- 🔐 **Autenticação Segura:** login obrigatório com JWT, senhas com BCrypt e autorização por perfil (Cliente, Empresa, Banco).
- 👤 **CRUD de Cliente:** dados de identificação (RG, CPF, nome, endereço), profissão e até 3 rendimentos.
- 🏢 **Cadastro de Agentes:** empresas e bancos.
- 🚙 **Cadastro de Automóveis:** matrícula, ano, marca, modelo, placa, valor da diária e proprietário.
- 📄 **Pedidos de Aluguel:** criar, modificar, consultar status e cancelar, com cálculo automático do valor e bloqueio de datas já reservadas.
- ✅ **Avaliação Financeira:** agentes ajustam datas/valor e dão parecer positivo ou negativo, vendo o comprometimento da renda do cliente.
- 📝 **Execução de Contrato:** registro de propriedade do automóvel (cliente, empresa ou banco).
- 💳 **Contrato de Crédito:** concedido por banco, com parcela calculada pela tabela Price.
- 🔄 **Integração com API Externa:** endereço preenchido automaticamente pelo CEP via [ViaCEP](https://viacep.com.br).

---

## 🛠 Tecnologias Utilizadas

As seguintes ferramentas, frameworks e bibliotecas foram utilizados na construção deste projeto. Recomenda-se o uso das versões listadas (ou superiores) para garantir a compatibilidade.

### 💻 Front-end

* **Framework/Biblioteca:** React 19.3.1
* **Linguagem:** JavaScript (ES6+, JSX)
* **Roteamento:** React Router 7.18.5
* **Estilização:** CSS puro, com cores e fontes definidas em [`docs/design-system.md`](docs/design-system.md)
* **Gerenciamento de Estado:** Context API (usuário logado)
* **Build Tool:** Vite 8.3.5

### 🖥️ Back-end

* **Linguagem/Runtime:** Java 25 (JDK)
* **Framework:** Spring Boot 4.0.9 (Web MVC, Data JPA, Validation)
* **Banco de Dados:** PostgreSQL (Supabase)
* **ORM:** Hibernate / JPA
* **Autenticação:** Spring Security + OAuth2 Resource Server (JWT) e BCrypt
* **Build:** Apache Maven 3.9
* **Testes:** JUnit 5 + Mockito

### ⚙️ Infraestrutura & DevOps

* **Containerização:** Docker (imagem do back-end, [`backend/Dockerfile`](backend/Dockerfile))
* **Cloud:** Vercel (front-end), Render (back-end) e Supabase (banco de dados)

---

## 🏗 Arquitetura

O back-end segue a arquitetura **MVC** com Spring Boot, organizada em camadas:

- **Model:** entidades JPA (`Cliente`, `Agente`, `Empresa`, `Banco`, `Automovel`, `Pedido`, `Contrato`, `ContratoCredito`...) salvas no PostgreSQL.
- **Controller:** endpoints REST que recebem as requisições do front-end.
- **Service:** regras de negócio (status do pedido, limite de rendimentos, contratos, crédito).
- **Repository:** acesso ao banco com Spring Data JPA.
- **DTO:** objetos de entrada e saída da API, para não expor as entidades diretamente.
- **Security:** geração e validação do token JWT e permissões por perfil.
- **Exception:** tratamento global de erros com respostas padronizadas.
- **View:** o front-end React + Vite, que consome a API e monta as páginas.

```
React (View)  →  Controller  →  Service  →  Repository  →  PostgreSQL (Supabase)
```

**Por que MVC em camadas?** Separa as responsabilidades (HTTP, regra de negócio e persistência), facilita os testes de unidade (os services são testados com Mockito, sem banco) e segue o padrão adotado na disciplina.

**Trade-offs:** o schema do banco é criado pelo Hibernate (`ddl-auto=update`), o que simplifica o desenvolvimento, mas não tem o histórico de migrações que ferramentas como Flyway ofereceriam.

### Diagramas

Os modelos UML ficam versionados em [`docs/`](docs/), escritos em Mermaid (o GitHub mostra os diagramas direto no navegador):

| Artefato | Versão inicial (v1) | Versão revisada (v2) |
| :--- | :---: | :---: |
| Histórias de Usuário | [v1](docs/historias-usuario/historias-usuario-v1.md) | [v2](docs/historias-usuario/historias-usuario-v2.md) |
| Diagrama de Casos de Uso | [v1](docs/diagramas/v1/casos-de-uso-v1.md) | [v2](docs/diagramas/v2/casos-de-uso-v2.md) |
| Diagrama de Classes | [v1](docs/diagramas/v1/classes-v1.md) | [v2](docs/diagramas/v2/classes-v2.md) |
| Diagrama de Pacotes | [v1](docs/diagramas/v1/pacotes-v1.md) | [v2](docs/diagramas/v2/pacotes-v2.md) |

O diagrama de estados do pedido está nas [histórias v2](docs/historias-usuario/historias-usuario-v2.md#status-do-pedido).

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

---

## 🔧 Instalação e Execução

### Pré-requisitos

* **Java JDK:** versão **25** (necessário para o **Back-end Spring Boot**)
* **Apache Maven:** versão **3.9** ou superior
* **Node.js:** versão **20.19** ou superior (necessário para o **Front-end React + Vite**)
* **Gerenciador de Pacotes:** npm
* **Conta no [Supabase](https://supabase.com/)** com um projeto criado (banco PostgreSQL)
* **Docker** (opcional, só para rodar o back-end em container)

---

### 🔑 Variáveis de Ambiente

Cada parte da aplicação tem um arquivo `.env.example`. Copie para `.env` e preencha. Os arquivos `.env` estão no `.gitignore` e **nunca devem ser enviados ao GitHub**.

#### 1 Back-end (Spring Boot)

Crie o arquivo **`backend/.env`** a partir de [`backend/.env.example`](backend/.env.example). O Spring lê esse arquivo automaticamente (`spring.config.import=optional:file:.env[.properties]`), desde que o back-end seja executado **de dentro da pasta `backend`**.

| Variável | Descrição | Exemplo |
| :--- | :--- | :--- |
| `DB_URL` | URL de conexão JDBC do Supabase (Session pooler). | `jdbc:postgresql://aws-1-sa-east-1.pooler.supabase.com:5432/postgres?sslmode=require` |
| `DB_USERNAME` | Usuário do banco (`postgres.` + id do projeto). | `postgres.abcdefghijklmnop` |
| `DB_PASSWORD` | Senha do banco de dados. | `senha-segura-123` |
| `JWT_SECRET` | Chave para assinar o token de login (mínimo 32 caracteres). | `um-texto-aleatorio-com-pelo-menos-32-caracteres` |
| `FRONTEND_URL` | Origem liberada no CORS (opcional, padrão `http://localhost:5173`). | `https://lab2-diw.vercel.app` |
| `PORT` | Porta do servidor (opcional, padrão `8080`). | `8080` |

#### 2 Front-end (React, Vite)

Crie o arquivo **`frontend/.env`** a partir de [`frontend/.env.example`](frontend/.env.example).

| Variável | Descrição | Exemplo |
| :--- | :--- | :--- |
| `VITE_API_URL` | URL base da API Spring Boot. | `http://localhost:8080/api` |

> **Obs:** as variáveis de ambiente em projetos **Vite** precisam começar com `VITE_` para que o Vite as inclua no *bundle* do front-end. Elas são lidas **na hora do build**, então qualquer mudança exige um novo build/deploy.

---

#### 3 Variáveis de Ambiente na Vercel e no Render

**Vercel (front-end)** — *Project Settings > Environment Variables*:

```
VITE_API_URL=https://lab2diw.onrender.com/api
```

**Render (back-end)** — *Service > Environment*:

```
DB_URL=jdbc:postgresql://aws-1-sa-east-1.pooler.supabase.com:5432/postgres?sslmode=require
DB_USERNAME=postgres.<id-do-projeto>
DB_PASSWORD=<senha-do-banco>
JWT_SECRET=<texto-aleatorio-com-32-ou-mais-caracteres>
FRONTEND_URL=https://lab2-diw.vercel.app
```

> [!IMPORTANT]
> O `FRONTEND_URL` deve ser exatamente a origem do site, **sem `/` no final**. Caso contrário, o navegador bloqueia as requisições por CORS.

---

### 📦 Instalação de Dependências

1.  **Clone o Repositório:**

```bash
git clone https://github.com/Gentil-sudo/lab2Diw.git
cd lab2Diw
```

2.  **Instale as Dependências:**

O projeto está dividido em duas pastas, então as dependências são instaladas separadamente.

#### Front-end (React)

```bash
cd frontend
npm install
cd ..
```

#### Back-end (Spring Boot)

O projeto usa **Maven** (`pom.xml`):

```bash
cd backend
mvn clean install
cd ..
```

---

### 💾 Inicialização do Banco de Dados (Supabase)

O projeto usa **PostgreSQL hospedado no Supabase**:

1. Crie um projeto no [Supabase](https://supabase.com/dashboard).
2. Clique no botão **Connect** (topo do painel) e escolha **Session pooler**. Copie o host e o usuário (`postgres.<id-do-projeto>`).
3. A senha é a do banco, definida ao criar o projeto. Se você esqueceu, gere outra em **Database > Settings > Reset database password**.
4. Monte o `DB_URL` com o prefixo `jdbc:` (o Supabase mostra só `postgresql://...`).

> [!NOTE]
> As tabelas são criadas automaticamente pelo **Hibernate** quando o back-end sobe (`spring.jpa.hibernate.ddl-auto=update`). Nenhuma migração manual é necessária.

---

### ⚡ Como Executar a Aplicação
Execute a aplicação em modo de desenvolvimento em **dois terminais separados**.

#### Terminal 1: Back-end (Spring Boot)

```bash
cd backend
mvn spring-boot:run
```
🚀 *A API estará disponível em **http://localhost:8080/api**.*

---

#### Terminal 2: Front-end (React, Vite)

```bash
cd frontend
npm run dev
```
🎨 *O Front-end estará disponível em **http://localhost:5173**.*

---

#### 🐳 Execução do Back-end com Docker

O back-end tem um [`Dockerfile`](backend/Dockerfile) multi-stage (o mesmo usado no deploy do Render): a primeira etapa compila com Maven e a segunda roda só o `.jar` com o Java 25.

```bash
cd backend
docker build -t aluguel-backend .
docker run --env-file .env -p 8080:8080 aluguel-backend
```

> [!NOTE]
> 💡 O banco continua sendo o Supabase, por isso não há `docker-compose` com PostgreSQL local. O `.env` é passado para o container com `--env-file` e **não** é copiado para a imagem (está no [`.dockerignore`](backend/.dockerignore)).

---

### 🧭 Roteiro rápido para testar

1. Cadastre uma **empresa** ou um **banco** e cadastre um automóvel com o valor da diária.
2. Cadastre um **cliente** com rendimentos e faça um pedido para esse carro.
3. Entre como agente, abra **Análise de pedidos**, ajuste se quiser e **aprove** com um parecer.
4. Ainda como agente, clique em **Executar contrato** e escolha quem fica dono do carro.
5. Entre como **banco**, abra **Contratos** e clique em **Conceder crédito**.
6. Entre como cliente e veja o contrato e as parcelas em **Contratos**.

---

## 🚀 Deploy

A aplicação está publicada em três serviços:

| Parte | Serviço | Endereço |
| :--- | :--- | :--- |
| Front-end | Vercel | https://lab2-diw.vercel.app |
| Back-end | Render (Docker) | https://lab2diw.onrender.com/api |
| Banco de dados | Supabase (PostgreSQL) | região `sa-east-1` |

1.  **Back-end no Render:** *New > Web Service*, repositório `Gentil-sudo/lab2Diw`, **Root Directory** `backend`, **Language** `Docker` e **Instance Type** `Free`. Configure as variáveis de ambiente listadas em [Variáveis de Ambiente na Vercel e no Render](#3-variáveis-de-ambiente-na-vercel-e-no-render). O Render usa o [`backend/Dockerfile`](backend/Dockerfile) e injeta a porta pela variável `PORT`.

2.  **Front-end na Vercel:** *Add New > Project*, mesmo repositório, **Root Directory** `frontend` (Vite é detectado automaticamente). Configure `VITE_API_URL` com a URL do Render + `/api` e faça o deploy. O arquivo [`frontend/vercel.json`](frontend/vercel.json) redireciona todas as rotas para o `index.html`, para o React Router funcionar ao recarregar a página.

3.  **Ligar os dois:** com a URL da Vercel em mãos, configure o `FRONTEND_URL` no Render (sem `/` no final) para liberar o CORS.

> 🔑 **Variáveis Cruciais:** se o `VITE_API_URL` for alterado na Vercel, é preciso fazer **Redeploy**, porque o Vite só lê a variável durante o build.

Para gerar os artefatos manualmente:

```bash
# 1. Build do Front-end (React/Vite) - gera a pasta /dist com arquivos estáticos
cd frontend
npm run build

# 2. Build do Back-end (Spring Boot/Maven) - gera o .jar executável em /target
cd ../backend
mvn clean package

# ☕ Execução do Back-end
java -jar target/aluguel-0.0.1-SNAPSHOT.jar
```

---

## 📂 Estrutura de Pastas

```
.
├── .gitignore                    # 🧹 Ignora .env, node_modules, target, etc.
├── README.md                     # 📘 Documentação principal do projeto.
│
├── /backend                      # 📁 API REST — Spring Boot (MVC)
│   ├── .env.example              # 🧩 Variáveis de ambiente do Back-end.
│   ├── .dockerignore             # 🐳 Arquivos fora da imagem Docker (.env, target).
│   ├── Dockerfile                # 🐳 Build da imagem do Back-end (usado no Render).
│   ├── requests.http             # 🔌 Requisições de exemplo (REST Client).
│   ├── pom.xml                   # 🛠️ Build e dependências (Maven).
│   ├── /src/main/java/br/pucminas/aluguel
│   │   ├── /controller           # 🎮 Endpoints REST.
│   │   ├── /service              # ⚙️ Regras e lógica de negócio.
│   │   ├── /repository           # 🗄️ Repositórios (Spring Data JPA).
│   │   ├── /model                # 🧬 Entidades persistentes (JPA).
│   │   ├── /dto                  # ✉️ Objetos de entrada e saída da API.
│   │   ├── /security             # 🛡️ JWT, BCrypt e permissões (Spring Security).
│   │   └── /exception            # 💥 Exceptions e handler global.
│   ├── /src/main/resources
│   │   └── application.properties # ⚙️ Configuração da aplicação.
│   └── /src/test/java            # 🧪 Testes de unidade (JUnit + Mockito).
│
├── /frontend                     # 📁 Interface web — React + Vite
│   ├── .env.example              # 🧩 Variáveis de ambiente do Front-end.
│   ├── vercel.json               # ☁️ Rewrite das rotas para a SPA na Vercel.
│   ├── index.html                # 📄 Página base.
│   ├── /public                   # 📂 Arquivos estáticos (logo).
│   ├── /src
│   │   ├── /pages                # 📄 Telas da aplicação.
│   │   ├── /components           # 🧱 Componentes reutilizáveis.
│   │   ├── /context              # 🔐 Usuário logado (Context API).
│   │   ├── /services             # 🔌 Chamadas HTTP à API.
│   │   ├── /utils                # 🛠️ Máscaras e formatação.
│   │   └── index.css             # 🎨 Estilos globais.
│   ├── package.json              # 📦 Dependências e scripts.
│   └── package-lock.json         # 🔒 Lockfile das dependências.
│
└── /docs                         # 📚 Documentação
    ├── /historias-usuario        # 📝 Histórias de usuário (v1, v2).
    ├── /diagramas                # 📐 Diagramas UML em Mermaid (v1, v2).
    ├── /imagens                  # 🖼️ Capturas de tela.
    └── design-system.md          # 🎨 Cores, fontes e padrões visuais.
```

---

## 🎥 Demonstração

### 🌐 Aplicação Web

Para melhor visualização, as telas principais estão organizadas lado a lado.

| Tela | Captura de Tela |
| :---: | :---: |
| **Início do Cliente** | **Meus Pedidos** |
| <img src="docs/imagens/inicio-cliente.png" alt="Tela inicial do cliente" width="400px"> | <img src="docs/imagens/meus-pedidos.png" alt="Lista de pedidos do cliente com filtros por status" width="400px"> |
| **Novo Pedido de Aluguel** | **Automóveis** |
| <img src="docs/imagens/novo-pedido.png" alt="Formulário de novo pedido com valor estimado" width="400px"> | <img src="docs/imagens/automoveis.png" alt="Automóveis disponíveis com valor da diária e proprietário" width="400px"> |
| **Meus Contratos** | **Meus Dados** |
| <img src="docs/imagens/contratos-cliente.png" alt="Contratos do cliente" width="400px"> | <img src="docs/imagens/meus-dados.png" alt="Cadastro do cliente com endereço preenchido pelo CEP" width="400px"> |

#### Telas por perfil

| Perfil | Telas |
|---|---|
| Cliente | Início, Meus pedidos, Contratos, Automóveis, Meus dados |
| Empresa | Início, Análise de pedidos, Contratos, Automóveis, Clientes |
| Banco | Tudo o que a empresa tem, mais conceder crédito em Contratos |

### 💻 Exemplo de Saída no Terminal (API)

#### 1. Endpoints principais

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

#### 2. Demonstração da API (cURL)

Login com credenciais inválidas:

```bash
curl -X POST 'https://lab2diw.onrender.com/api/auth/login' \
     -H 'Content-Type: application/json' \
     -d '{"login": "x", "senha": "y"}'
```

**Saída Esperada:**
```json
{
  "status": 401,
  "mensagem": "Login ou senha inválidos",
  "campos": null,
  "data": "2026-11-04T20:53:17.658445741"
}
```

Listagem de automóveis com o token recebido no login:

```bash
curl -X GET 'https://lab2diw.onrender.com/api/automoveis' \
     -H 'Authorization: Bearer <seu-jwt-token>'
```

> Mais exemplos (cadastro, pedidos, avaliação, contratos e crédito) em [`backend/requests.http`](backend/requests.http).

---

## 🧪 Testes

### Testes de Unidade

Os testes de unidade não precisam do banco de dados: eles usam **Mockito** no lugar dos repositórios.

```bash
cd backend
mvn test
```
*Ferramentas utilizadas: JUnit 5 e Mockito.*

| Classe de teste | O que verifica |
|---|---|
| `ClienteTest` | Limite de 3 rendimentos |
| `ContratoCreditoTest` | Cálculo da parcela (com e sem juros) |
| `PedidoServiceTest` | Cálculo do valor, datas inválidas, carro já reservado, cancelamento e avaliação |
| `ContratoServiceTest` | Execução do contrato, troca do proprietário do carro e regras do crédito |

---

## 🔗 Documentações utilizadas

* 📖 **Framework/Biblioteca (Front-end):** [Documentação Oficial do **React**](https://react.dev/reference/react)
* 📖 **Build Tool (Front-end):** [Guia de Configuração do **Vite**](https://vitejs.dev/config/)
* 📖 **Roteamento (Front-end):** [Documentação do **React Router**](https://reactrouter.com/)
* 📖 **Framework (Back-end):** [Documentação Oficial do **Spring Boot**](https://docs.spring.io/spring-boot/index.html)
* 📖 **Segurança (Back-end):** [Documentação do **Spring Security**](https://docs.spring.io/spring-security/reference/index.html)
* 📖 **Banco de Dados:** [Documentação do **Supabase**](https://supabase.com/docs/guides/database/connecting-to-postgres)
* 📖 **Containerização:** [Documentação de Referência do **Docker**](https://docs.docker.com/)
* 📖 **Deploy:** [Documentação do **Render**](https://render.com/docs/docker) e da [**Vercel**](https://vercel.com/docs)
* 📖 **API externa:** [**ViaCEP**](https://viacep.com.br)
* 📖 **Guia de Estilo:** [**Conventional Commits** (Padrão de Mensagens)](https://www.conventionalcommits.org/en/v1.0.0/)
* 📖 **Documentação Interna:** [Design System do Projeto](./docs/design-system.md)

---

## 👥 Autores

| 👤 Nome | 🖼️ Foto | :octocat: GitHub |
|---------|----------|-----------------|
| Enzo Gentil | <div align="center"><img src="https://github.com/Gentil-sudo.png" width="70px" height="70px"></div> | <div align="center"><a href="https://github.com/Gentil-sudo"><img src="https://joaopauloaramuni.github.io/image/github6.png" width="50px" height="50px"></a></div> |

---

## 🤝 Contribuição

1.  Faça um `fork` do projeto.
2.  Crie uma branch para sua feature (`git checkout -b feature/minha-feature`).
3.  Commit suas mudanças (`git commit -m 'feat: Adiciona nova funcionalidade X'`). **(Utilize [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/))**
4.  Faça o `push` para a branch (`git push origin feature/minha-feature`).
5.  Abra um **Pull Request (PR)**.

---

## 🙏 Agradecimentos

* [**Engenharia de Software PUC Minas**](https://www.instagram.com/engsoftwarepucminas/) - Pelo apoio institucional e pela estrutura acadêmica.
* [**Prof. Dr. João Paulo Aramuni**](https://github.com/joaopauloaramuni) - Pelas aulas, pelo material de Spring Boot da disciplina e pelo template deste README.

---

## 📄 Licença

Projeto acadêmico, desenvolvido para a disciplina DIAW da PUC Minas, sem fins comerciais.

---
