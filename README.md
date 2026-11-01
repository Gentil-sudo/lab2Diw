# 🚗 Sistema de Aluguel de Carros

> Sistema web para apoio à gestão de aluguéis de automóveis, permitindo efetuar, modificar, consultar e cancelar pedidos pela Internet, com avaliação financeira por agentes (empresas e bancos) e geração de contratos.

Laboratório 02 — Desenvolvimento e Integração de Aplicações Web (DIAW) · Engenharia de Software · PUC Minas

---

## 🚧 Status do Projeto

![Status](https://img.shields.io/badge/status-em%20desenvolvimento-yellow)
![Java](https://img.shields.io/badge/Java-25-orange?logo=openjdk)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-4.0.x-6DB33F?logo=springboot)
![Maven](https://img.shields.io/badge/Maven-3.9-C71A36?logo=apachemaven)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite)
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
- 🚙 **Cadastro de Automóveis** (matrícula, ano, marca, modelo, placa e proprietário).
- 📄 **Pedidos de Aluguel**: criar, modificar, consultar status e cancelar.
- ✅ **Avaliação financeira** de pedidos pelos agentes (parecer positivo/negativo).
- 📝 **Execução de Contrato** e registro de propriedade do automóvel.
- 💳 **Contrato de Crédito** associado ao aluguel, concedido por banco.

---

## 🛠 Tecnologias Utilizadas

### 💻 Front-end
- React
- Vite
- React Router

### 🖥️ Back-end
- Java — JDK 25
- Spring Boot 4.0.x (Web MVC, Data JPA, Security, Validation)
- Apache Maven

### 🗄️ Banco de Dados
- Supabase (PostgreSQL)

---

## 🏗 Arquitetura

> _Seção detalhada na etapa de modelagem._

---

## 📐 Modelagem

Os modelos UML ficam versionados em [`docs/`](docs/):

| Artefato | Versão inicial (v1) | Versão revisada (v2) |
|---|---|---|
| Histórias de Usuário | _a definir_ | _a definir_ |
| Diagrama de Casos de Uso | _a definir_ | _a definir_ |
| Diagrama de Classes | _a definir_ | _a definir_ |
| Diagrama de Pacotes | _a definir_ | _a definir_ |

---

## 🔧 Instalação e Execução

### Pré-requisitos

- JDK 25
- Apache Maven 3.9+
- Node.js 20.19+ / npm
- Projeto criado no [Supabase](https://supabase.com/)

> _Instruções detalhadas serão adicionadas conforme o desenvolvimento._

---

## 📂 Estrutura de Pastas

```
.
├── backend/      # API REST — Spring Boot (MVC)
├── frontend/     # Interface web — React + Vite
├── docs/         # Histórias de usuário e diagramas UML (v1, v2)
└── README.md
```

---

## 🎥 Demonstração

> _Capturas de tela serão adicionadas ao final do desenvolvimento._

---

## 🧪 Testes

> _Comandos de teste serão adicionados conforme o desenvolvimento._

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
