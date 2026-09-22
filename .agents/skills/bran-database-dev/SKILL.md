---
name: bran-database-dev
description: Guia de arquitetura, desenvolvimento, manutenção, regras de isolamento e sincronização de repositórios de bases de dados e eventos da BRAN Org (APIs REST públicas, Dashboards agnósticos, validações de CI/CD e template sync).
---

# 🏛️ BRAN Web Database Development & Maintenance Skill

Esta skill descreve os padrões de arquitetura, regras de isolamento de código, fluxo de ingestão de dados, validações de CI/CD e estratégias de sincronização para todos os repositórios da ecossistema de dados abertos da **BRAN Org** (incluindo o `bran-web-database-template`, `abec-open-database`, `ebbc-open-data`, etc.).

---

## 📌 Arquitetura & Fronteira de Isolamento

Os repositórios deste ecossistema utilizam uma **Arquitetura Orientada a Configuração (Data-Driven Architecture)**. O código do servidor e do painel web é 100% agnóstico aos dados brutos.

```
┌────────────────────────────────────────────────────────────────────────┐
│                   MÓDULO DE INFRAESTRUTURA / ENGINE                    │
│   (Imutável em repositórios de eventos; Alterar APENAS no Template)   │
│                                                                        │
│   • server.js               • src/config.js       • src/routes.js      │
│   • src/dataManager.js      • src/statsEngine.js  • src/exportEngine.js│
│   • public/ (Dashboard)     • tests/              • .github/workflows  │
└────────────────────────────────────────────────────────────────────────┘
                                    │
                         Lê dinamicamente em runtime
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                   MÓDULO ESPECÍFICO DO EVENTO / BASE                   │
│         (Mutável e customizável para cada evento/periódico)            │
│                                                                        │
│   • config/dataset.config.json    (Schema, campos, facetas, DOI)       │
│   • data/*.json / data/*.csv      (Acervo de dados públicos)           │
│   • README.md                     (Gerado via npm run init:event)      │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 🛑 Regras Rígidas para IAs e Desenvolvedores

### 1. Repositórios Derivados de Eventos (ex: `abec-open-database`, `ebbc-open-data`)
- **PERMITIDO ALTERAR:**
  - `config/dataset.config.json`: Adicionar novos campos de busca, alterar facetas, atualizar DOI, nome da entidade ou licença.
  - `data/`: Adicionar ou atualizar arquivos JSON/CSV contendo o acervo do evento.
  - `EVENT_README_TEMPLATE.md`: Ajustar textos padrão se necessário.
- **PROIBIDO ALTERAR DIRECTAMENTE:**
  - `src/*`, `server.js`, `public/*`. Caso um novo recurso técnico ou endpoint seja necessário, ele deve ser implementado no **Repositório Template Central** e propagado via sincronização.

### 2. Repositório Template Central (`bran-web-database-template`)
- Qualquer melhoria no servidor, novidade na API REST, novos gráficos ou otimização do Dashboard deve ser implementada aqui.
- Após commitar na branch `main` do template, a GitHub Action `template-sync.yml` propagará as mudanças para os repositórios dos eventos sem causar conflitos de merge.

---

## 🛠️ Guia de Comandos e Workflow de Ingestão de Dados

| Comando | Descrição | Quando Usar |
| :--- | :--- | :--- |
| `npm run dev` | Inicia o servidor HTTP local com auto-reload (`node --watch server.js`) | Durante o desenvolvimento |
| `npm run data:convert <csv_file> [json_file]` | Converte planilhas CSV para formato JSON estruturado | Ao importar novos acervos brutos |
| `npm run data:validate` | Executa o validador de schema e integridade | Antes de fazer commit ou deploy |
| `npm run init:event` | Substitui o README do template pelo README final compilado do evento | Após alterar `config/dataset.config.json` |
| `npm test` | Executa a suíte nativa de testes unitários e de integração HTTP | Para validar regressões na API |

---

## 🛡️ Entendendo a Integração Contínua (GitHub Actions CI/CD)

Ao realizar um `push` ou abrir um `Pull Request`, o GitHub executa automaticamente o workflow `.github/workflows/ci.yml`. O pipeline é dividido em 4 etapas:

1. **`🔍 Code Syntax & Lint Check`**:
   - Roda `node --check` em todos os arquivos de código.
   - Garante que não há erros de sintaxe ou imports quebrados.
2. **`📦 Dataset Schema & EBBC Mock Validation`**:
   - Roda `npm run data:validate` para garantir que o acervo em `data/` respeita as chaves primárias e campos obrigatórios (`title`, `doi`/`id`).
   - Se for o template central, valida também o mock do EBBC.
3. **`⚡ Unit & REST API Tests`**:
   - Roda a suíte `npm test` em matriz de versões do Node.js (18.x, 20.x, 22.x).
   - Valida os endpoints `/config`, `/:entity`, `/:entity/stats`, `/correlations`, `/scatter` e `/export`.
   - *Nota:* Este job depende do sucesso das etapas anteriores. Se a validação do dataset falhar, os testes são ignorados (*skipped*) para economizar recursos.
4. **`🚀 Dispatch Downstream Template Sync`**:
   - Roda apenas no repositório Template ao fazer merge na branch `main`.
   - Notifica todos os repositórios de eventos sobre atualizações de infraestrutura.

---

## 🔄 Como Atualizar Repositórios Derivados sem Conflito

Para puxar manualmente atualizações do repositório Template em um repositório de evento:

```bash
# Adicionar o template central como remote (apenas na 1ª vez)
git remote add template https://github.com/BRAN-Org/bran-web-database-template.git

# Buscar novidades do template e mesclar
git fetch template
git merge template/main --allow-unrelated-histories
```

Como os arquivos de dados (`data/`) e configuração (`config/dataset.config.json`) de cada evento são únicos e não existem com o mesmo nome no template, o Git realiza o merge automático com **zero conflito**.
