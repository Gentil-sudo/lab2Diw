# Histórias de Usuário — v1

## Atores

- **Cliente**: usuário individual que faz pedidos de aluguel.
- **Agente**: empresa ou banco que avalia os pedidos.
- **Banco**: agente que também pode conceder contrato de crédito.

---

## Acesso ao sistema

**US01 — Cadastro de cliente**
Como visitante, quero me cadastrar como cliente, para poder usar o sistema.
- Informar RG, CPF, nome, endereço, profissão, login e senha.
- Posso informar até 3 rendimentos (empregador e valor).
- CPF e login não podem se repetir.

**US02 — Cadastro de agente**
Como empresa ou banco, quero me cadastrar como agente, para poder avaliar pedidos.
- Informar nome, CNPJ, tipo (empresa ou banco), login e senha.

**US03 — Login**
Como usuário cadastrado, quero entrar com meu login e senha, para acessar o sistema.
- Só as telas de login e cadastro podem ser acessadas sem estar logado.

**US04 — Logout**
Como usuário, quero sair do sistema, para encerrar minha sessão.

---

## Cliente

**US05 — Ver e editar meus dados**
Como cliente, quero ver e alterar meus dados e rendimentos, para mantê-los atualizados.
- Não pode ter mais de 3 rendimentos.

**US06 — Excluir minha conta**
Como cliente, quero excluir meu cadastro, para deixar de usar o sistema.

---

## Automóveis

**US07 — Cadastrar automóvel**
Como agente, quero cadastrar automóveis (matrícula, ano, marca, modelo e placa), para que possam ser alugados.
- Matrícula e placa não podem se repetir.

**US08 — Listar, editar e remover automóveis**
Como agente, quero listar, editar e remover automóveis, para manter o cadastro correto.

---

## Pedidos (cliente)

**US09 — Criar pedido**
Como cliente, quero criar um pedido escolhendo um automóvel e as datas, para solicitar um aluguel.
- O pedido começa com status **EM_ANALISE**.
- A data de fim deve ser depois da data de início.

**US10 — Consultar meus pedidos**
Como cliente, quero ver meus pedidos e o status de cada um, para acompanhar a solicitação.

**US11 — Modificar pedido**
Como cliente, quero alterar meu pedido, para corrigir o automóvel ou as datas.
- Só pode modificar se estiver **EM_ANALISE**.

**US12 — Cancelar pedido**
Como cliente, quero cancelar meu pedido, para desistir do aluguel.
- Só pode cancelar se estiver **EM_ANALISE** ou **APROVADO**.

---

## Pedidos (agente)

**US13 — Listar pedidos**
Como agente, quero ver os pedidos feitos pelos clientes, para analisá-los.

**US14 — Modificar pedido**
Como agente, quero alterar as datas ou o valor de um pedido, para ajustá-lo antes da avaliação.

**US15 — Avaliar pedido**
Como agente, quero dar um parecer financeiro positivo ou negativo, para aprovar ou reprovar o pedido.
- Parecer positivo: status **APROVADO**. Parecer negativo: status **REPROVADO**.

---

## Contratos

**US16 — Executar contrato**
Como agente, quero gerar o contrato de um pedido aprovado, para formalizar o aluguel.
- O contrato informa se o automóvel fica como propriedade do cliente, da empresa ou do banco.
- O pedido passa para **CONTRATADO**.

**US17 — Contrato de crédito**
Como banco, quero associar um contrato de crédito ao aluguel, para financiar o cliente.
- Informar valor, taxa de juros e número de parcelas.

**US18 — Ver contratos**
Como usuário, quero ver os contratos ligados a mim, para acompanhar meus aluguéis.

---

## Status do pedido

| Status | Quando acontece |
|---|---|
| EM_ANALISE | Cliente criou o pedido |
| APROVADO | Agente deu parecer positivo |
| REPROVADO | Agente deu parecer negativo |
| CANCELADO | Cliente cancelou |
| CONTRATADO | Agente executou o contrato |

---

## Requisitos não funcionais

- RNF01: Sistema web.
- RNF02: Back-end em Java 25 com Spring Boot 4 e Maven, usando arquitetura MVC.
- RNF03: Front-end em React + Vite.
- RNF04: Banco de dados Supabase (PostgreSQL).
- RNF05: Login obrigatório com usuário e senha.
