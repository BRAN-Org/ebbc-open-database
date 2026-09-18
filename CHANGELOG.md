# 📋 CHANGELOG — EBBC Open Database

Registro de alterações e evolução do acervo e plataforma do **Encontro Brasileiro de Bibliometria e Cientometria (EBBC 2012 - 2024)** seguindo os padrões da **BRAN Org**.

---

## [1.5.0] - 2026-09-18 (Auditoria Criptográfica, Conformidade de Schemas e Novos Exportadores)

### 🚀 Novas Funcionalidades (Feat)
- **Exportação Acadêmica Dual (BibTeX & RIS)**: Adicionado suporte completo aos formatos `.bib` e `.ris` para importação direta no Zotero, Mendeley e VOSviewer.
- **Botões Rápidos no Explorer**: Novos atalhos de exportação no frontend para BibTeX e RIS.
- **Harvester Reprodutível (`scripts/scrape_ebbc.py`)**: Documentação do pipeline de extração e auditoria dos anais do EBBC (2012 a 2024).

### 🐛 Correções de Bugs (Fix)
- **Auditoria de Proveniência (`provenance.json`)**:
  - Atualizada a contagem de registros para o total real de **643 artigos** (estava incorretamente como 120).
  - Calculado e injetado o hash criptográfico SHA-256 real do arquivo `ebbc_articles.json` (`8d33ad9d1024d393...`).
  - Alinhado nível de saúde para `YELLOW` (100% Fiel à Fonte com Limitações da Origem) em total conformidade com o catálogo e o README.
  - Ajustadas contagens de DOIs e resumos faltantes para 0.

### ⚙️ Infraestrutura & Testes (Chore/Test)
- **Validador Formal (`data-truth-assert.yml`)**: Removido o mascarador `|| true`, garantindo que apenas datasets 100% conformes ao `article.v1.schema.json` passem pelo CI.
- **Expansão da Suíte de Testes**: 19 testes automatizados cobrindo DataManager, StatsEngine e todos os endpoints REST de exportação.

---

## [1.4.0] - 2026-09-13 (Curadoria Metodológica e Mapeamento de Softwares)
- Ingestão completa das edições 2012 a 2024 do EBBC totalizando 643 trabalhos acadêmicos.
- Mapeamento bibliométrico de softwares (`tools`), fontes de dados (`data_sources`) e etapas metodológicas (`usage_stages`).
