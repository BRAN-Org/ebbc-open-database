# {{DATASET_TITLE}}

<p align="center">
  <a href="https://doi.org/{{ZENODO_DOI}}"><img src="https://zenodo.org/badge/DOI/{{ZENODO_DOI}}.svg" alt="Zenodo DOI"></a>
  <a href="#️-confiabilidade-e-governança"><img src="{{RELIABILITY_SHIELD}}" alt="Confiabilidade"></a>
  <a href="https://www.go-fair.org/fair-principles/"><img src="https://img.shields.io/badge/FAIR-Compliant-green.svg?style=for-the-badge" alt="FAIR Principles"></a>
  <a href="https://www.budapestopenaccessinitiative.org/"><img src="https://img.shields.io/badge/BOAI-Signatory-orange.svg?style=for-the-badge" alt="BOAI Signatory"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/Data_License-CC_BY--NC--SA_4.0-lightgrey.svg?style=for-the-badge" alt="CC BY-NC-SA 4.0"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/Code_License-GPLv3-blue.svg?style=for-the-badge" alt="GPLv3"></a>
</p>

{{DATASET_DESCRIPTION}}

---

## 📊 Acervo em Números

> [!NOTE]
> **Status de Confiabilidade:** {{RELIABILITY_BADGE}}  
> 📌 **Por que este acervo recebeu esta nota:** {{RELIABILITY_JUSTIFICATION}}

| Métrica / Atributo | Detalhes do Acervo |
| :--- | :--- |
| **Confiabilidade dos Dados** | {{RELIABILITY_BADGE}} ([Ver critérios e auditoria](#️-confiabilidade-e-governança)) |
| **Período Histórico** | {{YEAR_RANGE}} |
| **Total de Artigos** | **{{TOTAL_RECORDS}} trabalhos científicos catalogados** |
| **Textos Completos (PDF)** | {{PDF_COUNT_TEXT}} |
| **Formatos Estruturados** | SQLite3 (`.sqlite`), CSV UTF-8 BOM, JSON, BibTeX (`.bib`), RIS (`.ris`) |
| **Curadoria & Proveniência** | Curadoria independente com integridade criptográfica (hash SHA-256) pela [BRAN Org]({{ORG_URL}}) |
| **Licença dos Dados** | [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) (Uso acadêmico/não-comercial; vedada ingestão para IA comercial) |
| **Licença do Código** | [GNU GPLv3](https://www.gnu.org/licenses/gpl-3.0.html) |

---

## 📦 Onde Baixar (Pacote Completo no Zenodo)

Todo o acervo bruto, o banco relacional completo e os arquivos individuais estão arquivados permanentemente no **CERN / Zenodo** sob DOI imutável. Você pode baixar todos os arquivos de uma só vez:

- 🔗 **Registro Permanente**: [https://doi.org/{{ZENODO_DOI}}](https://doi.org/{{ZENODO_DOI}})
- 📥 **Pacote Consolidado (.zip)**: Inclui o banco relacional SQLite3 (`{{PRIMARY_FILE_BASE}}.sqlite`), planilhas CSV consolidadas (`{{PRIMARY_FILE_BASE}}.csv`), metadados estruturados JSON, arquivos de referência BibTeX/RIS e a coleção de PDFs em texto completo.

### Download direto via terminal (cURL / Wget)
```bash
# Baixar o pacote completo do Zenodo
curl -LO "https://zenodo.org/records/{{ZENODO_RECORD_ID}}/files/{{ZENODO_BUNDLE_NAME}}"
unzip {{ZENODO_BUNDLE_NAME}}
```

---

## ⚡ Como Usar os Dados

### 1. Python (Pandas)
```python
import pandas as pd

# Carregar o dataset estruturado
df = pd.read_json("data/{{PRIMARY_FILE_BASE}}.json")
print(f"Total de registros: {len(df)}")
print(df[["title", "year", "authors"]].head())
```

### 2. SQLite3 (SQL direto no terminal)
```bash
# Consultar distribuição temporal direto no banco relacional
sqlite3 data/{{PRIMARY_FILE_BASE}}.sqlite "SELECT year, COUNT(*) as total FROM articles GROUP BY year ORDER BY year;"
```

---

## 🌐 API REST Pública

O repositório fornece uma API REST de alta performance, gratuita e sem necessidade de chave de autenticação (API Key):

| Método | Endpoint | Finalidade |
| :--- | :--- | :--- |
| `GET` | `/api/v1/articles` | Lista registros com busca textual global (`?q=`), filtros facetados (`?year=`, `?author=`), ordenação e paginação |
| `GET` | `/api/v1/articles/:key` | Consulta individual exata por DOI ou ID do artigo |
| `GET` | `/api/v1/articles/stats` | Estatísticas agregadas (rankings de autores, tópicos e evolução temporal) |
| `GET` | `/api/v1/articles/export?format=csv` | Download instantâneo dos registros filtrados em **CSV (BOM UTF-8)** |
| `GET` | `/api/v1/articles/export?format=bibtex` | Download das referências bibliográficas filtradas em **BibTeX** |

### Exemplo de Requisição (cURL)
```bash
curl -s "http://localhost:3000/api/v1/articles?q=informacao&limit=5"
```

---

## 🚀 Como Executar o Portal Localmente

Para rodar o portal interativo com gráficos dinâmicos, sandbox e explorador de artigos:

```bash
git clone {{REPO_URL}}.git
cd {{REPO_NAME}}
npm install
npm start
```
Acesse no navegador: `http://localhost:3000`

---

## 📖 Como Citar Este Dataset

Se você utilizar estes dados em pesquisas acadêmicas, teses ou softwares, por favor cite:

```bibtex
@misc{{{CITE_KEY}},
  author       = {BRAN Org},
  title        = {{{DATASET_TITLE}}},
  year         = {{{YEAR}}},
  howpublished = {Zenodo},
  doi          = {{{ZENODO_DOI}}},
  url          = {https://doi.org/{{ZENODO_DOI}}},
  note         = {Base de dados bibliométrica aberta curada pela Brazilian Research Archive Network}
}
```

**ABNT:**
> BRAN ORG. **{{DATASET_TITLE}}**. Genebra: CERN / Zenodo, {{YEAR}}. DOI: {{ZENODO_DOI}}. Disponível em: &lt;https://doi.org/{{ZENODO_DOI}}&gt;.

---

## 🛡️ Confiabilidade e Governança

<p align="center">
  <a href="https://github.com/BRAN-Org/.github#níveis-de-confiabilidade-dos-dados">
    <img src="{{RELIABILITY_SHIELD}}" alt="Selo de Confiabilidade">
  </a>
</p>

| Dimensão de Governança | Avaliação da Curadoria Independente |
| :--- | :--- |
| **Classificação Oficial** | {{RELIABILITY_BADGE}} |
| **Diagnóstico Técnico (Por que recebeu esta nota)** | {{RELIABILITY_JUSTIFICATION}} |
| **Método de Auditoria** | Verificação independente com hash criptográfico SHA-256 por arquivo, conferência direta contra publicações originais e rastreabilidade estrita. |
| **Ciclo de Atualização** | Acompanhe as revisões periódicas no repositório [BRAN-Org/.github](https://github.com/BRAN-Org/.github/blob/main/CALENDAR.md). |

> [!IMPORTANT]
> **Transparência da Curadoria:** A BRAN Org preserva a fidelidade estrita à fonte primária e não inventa dados ou metadados inexistentes. Lacunas ou inconsistências presentes na origem são documentadas tecnicamente para assegurar integridade em análises cienciométricas.

---

<p align="center">
  Curadoria e Preservação Digital por <strong><a href="{{ORG_URL}}">BRAN Org</a></strong>
</p>
