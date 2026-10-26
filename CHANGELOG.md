# Changelog — EBBC Open Database

Registro de versões, auditorias e atualizações da base de dados do **Encontro Brasileiro de Bibliometria e Cientometria (EBBC)** mantida pela **BRAN Org**.

---

## [1.6.0] - 2026-10-25 (Ingestão dos Anais do EBBC 10 2026 - UFPR & Expansão do Acervo)

### Base de Dados & Coleta (Data/Feat)
- **Ingestão Completa da 10ª Edição (EBBC 2026)**: Extração e catalogação de 171 novos trabalhos científicos apresentados na Universidade Federal do Paraná (UFPR).
- **Expansão do Acervo Canônico**: Acervo ampliado de 643 para **814 artigos científicos** (período histórico 2012–2026, cobrindo as edições 3ª a 10ª).
- **Curadoria Cientométrica Automatizada**: Identificação e mapeamento sistemático de softwares (VOSviewer, Bibliometrix, CiteSpace, Gephi, Python, R, Pajek), fontes de dados (SciELO, Web of Science, Scopus, Lattes, OpenAlex) e etapas metodológicas aplicadas.
- **Harvester Robusto**: Atualização de `scripts/scrape_ebbc.py` com parser dedicado para Dublin Core e Google Scholar meta tags do portal OJS oficial.

### Governança & Metadados (Chore/Docs)
- **Atualização de Schemas e Proveniência**: Recálculo criptográfico de integridade (`provenance.json` com novo hash SHA-256 e 814 registros).
- **Metadados de Publicação**: Sincronização de `.zenodo.json`, `CITATION.cff` e `config/dataset.config.json` para refletir a nova cobertura temporal e volumetria.

---

## [1.5.0] - 2026-09-18 (Formatos de Intercâmbio Bibliográfico: BibTeX e RIS)

### Novas Funcionalidades (Feat)
- **Exportação BibTeX (`format=bibtex` / `format=bib`)**: Geração dinâmica de entradas `@inproceedings{...}` formatadas para citação acadêmica em LaTeX e importação no Zotero.
- **Exportação RIS (`format=ris`)**: Suporte ao padrão internacional Research Information Systems (`TY - CONF ... ER - `) para integração direta com VOSviewer, Mendeley, EndNote e Bibliometrix (R).
- **Interface & Explorer**: Adicionados botões dedicados de exportação rápida para BibTeX e RIS no painel de busca do Explorador de Dados.

### Documentação (Docs)
- Atualização da aba de Documentação da API com os novos formatos de exportação bibliográfica suportados.

### Infraestrutura & Testes (Chore/Test)
- Adicionados testes de integração no `tests/api.test.js` para validação de cabeçalhos e sintaxe de BibTeX e RIS.

---

## [1.4.0] - 2026-09-11 (Reestruturação da Tela Inicial, Barra Superior & Footer Institucional - Branch `feat/redesign-ui`)

### Tela Inicial (Landing Overview)
- **Apresentação Institucional**: Adicionada a aba **"Início"** com o nome da Organização / Periódico / Faculdade / Evento em destaque.
- **Espaço para Descrição**: Área expansível para apresentação do acervo, missão de Ciência Aberta e escopo dos dados.
- **Atalhos Rápidos**: Cards de navegação para o Explorador, Painel Geral e Sandbox de API.

### Barra Superior (Top Header / Navbar)
- **Esquerda**: Logo genérica substituível (`.svg`) + Nome do Evento / Faculdade / Periódico.
- **Centro**: Barra de navegação em pílulas para as telas do portal (`Início`, `Explorador de Dados`, `Painel Geral`, `Análises & Correlações`, `Documentação da API`).
- **Direita**:
 - **Barra de Busca Rápida**: Campo de pesquisa direta no topo que redireciona automaticamente para os registros do Explorador de Dados.
 - **Links Externos de Destaque**: Botões com ícones diretos para o **GitHub** do repositório e o **DOI** do Zenodo.

### Footer Institucional & Suporte
- Créditos de desenvolvimento e marca da **BRAN Org**.
- **Seção de Suporte / Reportar Problemas**: Link direto para **Reportar Problemas / Issues no GitHub**.

---

## [1.3.0] - 2026-09-11 (Redesign Fiel Focado no EBBC OpenData - Branch `feat/redesign-ui`)

### Painel de Estatísticas & Explorador em Cartões
- Painel com 4 Cards de Estatísticas e Toolbar de Personalização de Gráficos (Paletas e Tipos).
- Explorador com Cartões de Artigos, badges coloridos e Modal de Detalhes.

---

## [1.2.0] - 2026-09-11 (Redesign Visual Minimalista & Corporativo - Branch `feat/redesign-ui`)

### Design & Interface de Usuário (UI/UX)
- Identidade visual minimalista com paleta Slate Navy e Plus Jakarta Sans.

---

## [1.1.0] - 2026-09-11 (Módulo de Correlações Cientométricas & Skill de Automação)

### Novas Funcionalidades (Feat)
- Skill customizada `changelog-generator`.
- Análises de coocorrência 2D, dispersão e novos endpoints REST.

---

## [1.0.0] - 2026-09-11 (Lançamento Inicial do Template)

### Novas Funcionalidades (Feat)
- Estrutura de configuração agnóstica, busca em memória, REST API e deploy Vercel.
