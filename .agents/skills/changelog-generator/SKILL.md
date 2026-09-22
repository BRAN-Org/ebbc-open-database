---
name: changelog-generator
description: Automates updating, formatting, and synchronizing CHANGELOG.md based on git commits, diffs, and codebase modifications using BRAN Org standards. Use this skill whenever the user asks to update the changelog, document changes, or prepare release notes.
---

# 📋 Changelog Generator Skill (BRAN Org Standard)

Esta Skill instrui o agente de IA a analisar o repositório, extrair histórico de alterações via Git e atualizar/preencher o arquivo `CHANGELOG.md` de forma padronizada, profissional e legível.

## 🚀 Diretrizes de Execução

Quando acionado para atualizar o changelog ou registrar mudanças:

1. **Inspecionar Histórico e Diferenças no Git**:
   - Executar `git status` para listar arquivos modificados e não rastreados.
   - Executar `git log -n 10 --oneline` para analisar os últimos commits.
   - Executar `git diff` para examinar as alterações exatas no código-fonte.

2. **Categorizar as Alterações**:
   Organizar as entradas do changelog utilizando convenções estruturadas:
   - `🚀 Novas Funcionalidades (Feat)`: Novos componentes, rotas REST, visualizações de gráficos, utilitários.
   - `🐛 Correções de Bugs (Fix)`: Ajustes de erros em rotas, correções de lógicas, regex, testes.
   - `📝 Documentação (Docs)`: Atualizações no README.md, documentação da API, guia de deploy.
   - `⚙️ Infraestrutura & Testes (Chore/Test)`: Dependências, testes automatizados, scripts de validação e CI/CD.

3. **Manter o Formato do `CHANGELOG.md`**:
   - Manter a ordem cronológica reversa (a versão ou data mais recente no topo).
   - Utilizar formatação Markdown limpa com emojis descritivos e listas com marcadores.
   - Destacar os arquivos modificados usando links relativos ou nomes base dos arquivos.

4. **Finalizar o Ciclo**:
   - Escrever ou atualizar o `CHANGELOG.md`.
   - Executar testes automatizados para garantir que o repositório está íntegro (`npm test`).
   - Incluir o `CHANGELOG.md` nas alterações prontas para commit.
