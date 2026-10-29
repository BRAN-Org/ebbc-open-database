# EBBC Open Data - Acervo Histórico e Curadoria Metodológica

<p align="center">
  <a href="https://doi.org/10.5281/zenodo.23653261"><img src="https://zenodo.org/badge/DOI/10.5281/zenodo.23653261.svg" alt="Zenodo DOI"></a>
  <a href="#-síntese-do-acervo--governança"><img src="https://img.shields.io/badge/Confiabilidade-Fiel%20%C3%A0%20Fonte%20(Incompleto)-yellow" alt="Confiabilidade"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/Licen%C3%A7a-CC_BY--NC--SA_4.0-lightgrey.svg" alt="CC BY-NC-SA 4.0"></a>
  <a href="#-como-usar-os-dados"><img src="https://img.shields.io/badge/Formatos-SQLite_%7C_CSV_%7C_JSON-blue.svg" alt="Formatos"></a>
</p>

Base de dados aberta contendo todos os anais das edições do Encontro Brasileiro de Bibliometria e Cientometria (EBBC, 2012–2026), com mapeamento detalhado de softwares, fontes de dados e etapas metodológicas aplicadas nas pesquisas cientométricas no Brasil, disponibilizada sob princípios FAIR e BOAI.

---

## 📊 Síntese do Acervo & Governança

> [!NOTE]
> **Status de Confiabilidade:** 🟡 **Fiel à Fonte (Cobertura Incompleta)**  
> 📌 **Diagnóstico Metodológico:** Todos os 814 artigos disponibilizados no portal oficial do evento (edições 3ª a 10ª, 2012–2026) foram catalogados com 100% de integridade e fidelidade aos dados públicos. A classificação amarela documenta lacunas na própria fonte primária original do evento — ausência de atribuição de DOIs na origem e anais das primeiras edições (1ª e 2ª edições) nunca digitalizados pela organização. Textos completos em processo de resgate documental independente.

| Métrica / Atributo | Detalhes do Acervo |
| :--- | :--- |
| **Período Histórico** | 2012–2026 (Edições 3ª a 10ª) |
| **Total de Trabalhos** | **814 artigos científicos catalogados** |
| **Textos Completos (PDF)** | 814 artigos catalogados (textos completos em processo de resgate documental) |
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

Endpoints públicos e gratuitos (sem necessidade de chave de autenticação):

| Método | Endpoint | Finalidade |
| :--- | :--- | :--- |
| `GET` | `/api/v1/articles` | Busca textual (`?q=`), filtros facetados (`?year=`, `?author=`) e paginação |
| `GET` | `/api/v1/articles/:key` | Consulta individual por ID ou DOI |
| `GET` | `/api/v1/articles/stats` | Métricas consolidadas, rankings de ferramentas metodológicas e autores |
| `GET` | `/api/v1/articles/export?format=csv` | Download instantâneo dos dados filtrados em CSV (BOM UTF-8) |

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
