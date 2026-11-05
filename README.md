# EBBC Open Data - Acervo Histórico e Curadoria Metodológica

<p align="center">
  <a href="https://doi.org/10.5281/zenodo.23653261"><img src="https://zenodo.org/badge/DOI/10.5281/zenodo.23653261.svg" alt="Zenodo DOI"></a>
  <a href="provenance.json"><img src="https://img.shields.io/badge/Identifica%C3%A7%C3%A3o-100%25-brightgreen.svg" alt="Identificação"></a>
  <a href="schemas/article.v1.schema.json"><img src="https://img.shields.io/badge/Schema-article.v1-blue.svg" alt="Schema"></a>
  <a href="#-síntese-do-acervo--governança"><img src="https://img.shields.io/badge/Confiabilidade-Alta%20Fidelidade%20(OAI--PMH)-brightgreen" alt="Confiabilidade"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/Licen%C3%A7a-CC_BY--NC--SA_4.0-lightgrey.svg" alt="CC BY-NC-SA 4.0"></a>
  <a href="#-como-usar-os-dados"><img src="https://img.shields.io/badge/Formatos-SQLite_%7C_CSV_%7C_JSON-blue.svg" alt="Formatos"></a>
</p>

Base de dados aberta contendo todos os anais das edições do Encontro Brasileiro de Bibliometria e Cientometria (EBBC, 2012–2026), com mapeamento detalhado de softwares, fontes de dados e etapas metodológicas aplicadas nas pesquisas cientométricas no Brasil, disponibilizada sob princípios FAIR e BOAI.

---

## 📊 Síntese do Acervo & Governança

> [!NOTE]
> **Status de Confiabilidade:** 🟢 **Alta Fidelidade (OAI-PMH Oficial)**  
> 📌 **Diagnóstico Metodológico:** Todos os 808 artigos disponibilizados no portal oficial do evento (edições 3ª a 10ª, 2012–2026) foram catalogados via harvester OAI-PMH oficial com 100% de integridade, 100% de links diretos para PDFs originais (808/808) e URLs canônicas. Fidelidade estrita aos metadados de origem: 583 trabalhos possuem DOI original do evento e 225 trabalhos sem atribuição de DOI na origem são preservados como `doi: "N/A"` sob identificadores canônicos, com zero inventividade sintética.

| Métrica / Atributo | Detalhes do Acervo |
| :--- | :--- |
| **Período Histórico** | 2012–2026 (Edições 3ª a 10ª) |
| **Total de Trabalhos** | **808 artigos científicos catalogados** |
| **Textos Completos (PDF)** | **808 artigos com PDF oficial e direto (100% de cobertura)** |
| **Integridade Criptográfica** | Hash SHA-256 por arquivo e rastreabilidade estrita (`provenance.json`) |
| **Formatos Disponíveis** | SQLite3 (`.sqlite`), CSV (UTF-8 BOM), JSON, BibTeX (`.bib`), RIS (`.ris`) |
| **Licença dos Dados** | [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) (Uso acadêmico; vedada ingestão por IA comercial) |

---

## 📥 Download do Pacote Consolidado

O acervo bruto, o banco relacional completo e os arquivos individuais estão arquivados permanentemente no **CERN / Zenodo** sob DOI imutável:

- 🔗 **DOI Permanente:** [https://doi.org/10.5281/zenodo.23653261](https://doi.org/10.5281/zenodo.23653261)
- 📦 **Conteúdo do .zip:** Banco SQLite3 (`ebbc_articles.sqlite`), planilhas CSV consolidadas (`ebbc_articles.csv`), metadados estruturados JSON, referências BibTeX/RIS e documentação de fontes/ferramentas.

```bash
# Download direto do pacote completo via terminal
curl -LO "https://zenodo.org/records/23653261/files/ebbc-open-database-zenodo.zip"
unzip ebbc-open-database-zenodo.zip
```

---

## ⚡ Como Usar os Dados

### Python (Pandas)
```python
import pandas as pd

df = pd.read_json("data/ebbc_articles.json")
print(f"Total: {len(df)} artigos | Período: {df['year'].min()} a {df['year'].max()}")
```

### SQLite3 (SQL no terminal)
```bash
sqlite3 data/ebbc_articles.sqlite "SELECT year, COUNT(*) as total FROM articles GROUP BY year ORDER BY year;"
```

---

## 🌐 API REST Pública

Endpoints públicos e gratuitos (sem necessidade de chave de autenticação), servidos com alta disponibilidade e CORS global habilitado:

- 🔗 **URL Base em Produção:** `https://ebbc-open-database.vercel.app/api/v1`
- 📑 **Guia Técnico Completo:** Consulte o [Guia Detalhado da API (docs/API.md)](docs/API.md) com parâmetros, schemas e receitas.
- 📋 **Especificação OpenAPI 3.0:** [`/api/v1/openapi.json`](https://ebbc-open-database.vercel.app/api/v1/openapi.json) (compatível com Swagger, Postman e Insomnia).

| Método | Endpoint | Finalidade |
| :--- | :--- | :--- |
| `GET` | `/api/v1/articles` | Busca textual (`?q=`), filtros facetados (`?year=`, `?author=`, `?tool=`), ordenação e paginação |
| `GET` | `/api/v1/articles/:key` | Consulta individual por ID canônico (`ebbc-2022-441`) ou DOI (`10.22477.01`) |
| `GET` | `/api/v1/articles/export` | Download do acervo completo ou filtrado em **JSON**, **CSV** (BOM UTF-8), **BibTeX** (`.bib`) ou **RIS** (`.ris`) |
| `GET` | `/api/v1/articles/stats` | Métricas consolidadas, rankings de softwares, fontes bibliográficas e autores |
| `GET` | `/api/v1/articles/stats/correlations` | Matriz de coocorrência 2D entre metadados curados (ideal para redes e heatmaps) |
| `GET` | `/api/v1/articles/stats/temporal` | Séries temporais normalizadas ano a ano para visualizações 100% empilhadas |
| `GET` | `/api/v1/articles/stats/pareto` | Frequências e percentuais acumulados para testes de Bradford e Pareto |
| `GET` | `/api/v1/articles/stats/scatter` | Coordenadas de dispersão e coeficientes da reta de regressão linear |
| `GET` | `/api/v1/config` | Configuração estruturada do acervo, esquemas de busca e metadados institucionais |
| `GET` | `/api/v1/openapi.json` | Contrato formal OpenAPI 3.0.3 machine-readable |

### Ingestão Rápida em Python (Pandas)
```python
import pandas as pd
df = pd.read_json("https://ebbc-open-database.vercel.app/api/v1/articles/export?format=json")
print(f"Total: {len(df)} artigos | PDFs diretos: {df['pdf_url'].notna().sum()}/{len(df)}")
```

### Ingestão em R para Bibliometria (Bibliometrix)
```R
download.file("https://ebbc-open-database.vercel.app/api/v1/articles/export?format=ris", destfile = "ebbc.ris")
library(bibliometrix)
df <- convert2df("ebbc.ris", dbsource = "isi", format = "ris")
```

> **Executar localmente:** `npm install && npm start` (disponível em `http://localhost:3000`).

---

## 📖 Como Citar Este Dataset

```bibtex
@misc{ebbc_open_database_2026,
  author       = {BRAN Org},
  title        = {EBBC Open Data - Acervo Histórico e Curadoria Metodológica},
  year         = {2026},
  howpublished = {Zenodo},
  doi          = {10.5281/zenodo.23653261},
  url          = {https://doi.org/10.5281/zenodo.23653261}
}
```

**ABNT:**
> BRAN ORG. **EBBC Open Data - Acervo Histórico e Curadoria Metodológica**. Genebra: CERN / Zenodo, 2026. DOI: 10.5281/zenodo.23653261. Disponível em: &lt;https://doi.org/10.5281/zenodo.23653261&gt;.
