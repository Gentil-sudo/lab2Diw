# Guia de Contribuição

Obrigado pelo interesse em contribuir com o **AlugaAqui**!

## Fluxo

1. Faça um `fork` do projeto.
2. Crie uma branch a partir da `main`: `git checkout -b feature/minha-feature`.
3. Faça commits pequenos usando [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/):
   - `feat:` nova funcionalidade
   - `fix:` correção de bug
   - `docs:` documentação
   - `style:` formatação / CSS
   - `refactor:` mudança de código sem alterar comportamento
   - `test:` testes
4. Faça o `push` da branch e abra um **Pull Request** descrevendo o que mudou e como testar.

## Padrões de código

- **Back-end (Java / Spring Boot):** siga a divisão em camadas `controller → service → repository`. Regras de negócio ficam nos `service`, nunca nos `controller`. Toda regra nova deve ter teste em `src/test/java` (`mvn test` precisa passar).
- **Front-end (React):** componentes em `PascalCase.jsx`, chamadas HTTP somente por `src/services/api.js`, cores somente pelos tokens do `index.css` (veja a rota `/design-system`), nada de cores fixas no código, para os modos claro e escuro continuarem funcionando.
- **Nomes em português**, seguindo o restante do projeto.
- **Nunca** envie arquivos `.env` ou credenciais.
