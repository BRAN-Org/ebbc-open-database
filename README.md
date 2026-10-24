# EBBC Open Data - Acervo Histórico e Curadoria Metodológica

<p align="center">
  <a href="https://doi.org/10.5281/zenodo.23593513"><img src="https://zenodo.org/badge/DOI/10.5281/zenodo.23593513.svg" alt="Zenodo DOI"></a>
  <a href="#️-confiabilidade-e-governança"><img src="https://img.shields.io/badge/Confiabilidade-Fiel%20%C3%A0%20Fonte%20(Incompleto)-yellow?style=for-the-badge" alt="Confiabilidade"></a>
  <a href="https://www.go-fair.org/fair-principles/"><img src="https://img.shields.io/badge/FAIR-Compliant-green.svg?style=for-the-badge" alt="FAIR Principles"></a>
  <a href="https://www.budapestopenaccessinitiative.org/"><img src="https://img.shields.io/badge/BOAI-Signatory-orange.svg?style=for-the-badge" alt="BOAI Signatory"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/Data_License-CC_BY--NC--SA_4.0-lightgrey.svg?style=for-the-badge" alt="CC BY-NC-SA 4.0"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/Code_License-GPLv3-blue.svg?style=for-the-badge" alt="GPLv3"></a>
</p>

Base de dados aberta contendo todos os anais das edições do Encontro Brasileiro de Bibliometria e Cientometria (EBBC) de 2012 a 2024, com mapeamento detalhado de softwares, fontes de dados e etapas metodológicas aplicadas nas pesquisas cientométricas no Brasil.

---

## 📊 Acervo em Números

> [!NOTE]
> **Status de Confiabilidade:** 🟡 **Fiel à Fonte (Cobertura Incompleta)**  
> 📌 **Por que este acervo recebeu esta nota:** Todos os 643 artigos disponibilizados no portal oficial do evento (edições 3ª a 9ª, 2012–2024) foram catalogados com 100% de integridade e fidelidade aos dados públicos. A classificação amarela documenta lacunas na própria fonte primária original do evento — ausência de atribuição de DOIs na origem e anais das primeiras edições (1ª e 2ª edições) nunca digitalizados pela organização. Textos completos em processo de resgate documental independente.

| Métrica / Atributo | Detalhes do Acervo |
| :--- | :--- |
| **Confiabilidade dos Dados** | 🟡 **Fiel à Fonte (Cobertura Incompleta)** ([Ver critérios e auditoria](#️-confiabilidade-e-governança)) |
| **Período Histórico** | 2012–2024 (Edições 3ª a 9ª) |
| **Total de Artigos** | **643 trabalhos científicos catalogados** |
| **Textos Completos (PDF)** | 643 artigos catalogados (textos completos em processo de resgate documental) |
| **Formatos Estruturados** | SQLite3 (`.sqlite`), CSV UTF-8 BOM, JSON, BibTeX (`.bib`), RIS (`.ris`) |
| **Curadoria & Proveniência** | Curadoria independente com integridade criptográfica (hash SHA-256) pela [BRAN Org](https://github.com/BRAN-Org) |
| **Licença dos Dados** | [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) (Uso acadêmico/não-comercial; vedada ingestão para IA comercial) |
| **Licença do Código** | [GNU GPLv3](https://www.gnu.org/licenses/gpl-3.0.html) |

---

## 📦 Onde Baixar (Pacote Completo no Zenodo)

Todo o acervo bruto, o banco relacional completo e os arquivos individuais estão arquivados permanentemente no **CERN / Zenodo** sob DOI imutável. Você pode baixar todos os arquivos de uma só vez:

- 🔗 **Registro Permanente**: [https://doi.org/10.5281/zenodo.23593513](https://doi.org/10.5281/zenodo.23593513)
- 📥 **Pacote Consolidado (.zip)**: Inclui o banco relacional SQLite3 (`ebbc_articles.sqlite`), planilhas CSV consolidadas (`ebbc_articles.csv`), metadados estruturados JSON, arquivos de referência BibTeX/RIS e a coleção de PDFs em texto completo.

### Download direto via terminal (cURL / Wget)
```bash
# Baixar o pacote completo do Zenodo
curl -LO "https://zenodo.org/records/23593513/files/ebbc-open-database-zenodo.zip"
unzip ebbc-open-database-zenodo.zip
```

---

## ⚡ Como Usar os Dados

### 1. Python (Pandas)
```python
import pandas as pd

# Carregar o dataset estruturado
df = pd.read_json("data/ebbc_articles.json")
print(f"Total de registros: {len(df)}")
print(df[["title", "year", "authors"]].head())
```

### 2. SQLite3 (SQL direto no terminal)
```bash
# Consultar distribuição temporal direto no banco relacional
sqlite3 data/ebbc_articles.sqlite "SELECT year, COUNT(*) as total FROM articles GROUP BY year ORDER BY year;"
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
git clone https://github.com/BRAN-Org/ebbc-open-database.git
cd ebbc-open-database
npm install
npm start
```
Acesse no navegador: `http://localhost:3000`

---

## 📖 Como Citar Este Dataset

Se você utilizar estes dados em pesquisas acadêmicas, teses ou softwares, por favor cite:

```bibtex
@misc{ebbc_open_database_2026,
  author       = {BRAN Org},
  title        = {EBBC Open Data - Acervo Histórico e Curadoria Metodológica},
  year         = {2026},
  howpublished = {Zenodo},
  doi          = {10.5281/zenodo.23593513},
  url          = {https://doi.org/10.5281/zenodo.23593513},
  note         = {Base de dados bibliométrica aberta curada pela Brazilian Research Archive Network}
}
```

**ABNT:**
> BRAN ORG. **EBBC Open Data - Acervo Histórico e Curadoria Metodológica**. Genebra: CERN / Zenodo, 2026. DOI: 10.5281/zenodo.23593513. Disponível em: &lt;https://doi.org/10.5281/zenodo.23593513&gt;.

---

## 🛡️ Confiabilidade e Governança

<p align="center">
  <a href="https://github.com/BRAN-Org/.github#níveis-de-confiabilidade-dos-dados">
    <img src="https://img.shields.io/badge/Confiabilidade-Fiel%20%C3%A0%20Fonte%20(Incompleto)-yellow?style=for-the-badge" alt="Selo de Confiabilidade">
  </a>
</p>

| Dimensão de Governança | Avaliação da Curadoria Independente |
| :--- | :--- |
| **Classificação Oficial** | 🟡 **Fiel à Fonte (Cobertura Incompleta)** |
| **Diagnóstico Técnico (Por que recebeu esta nota)** | Todos os 643 artigos disponibilizados no portal oficial do evento (edições 3ª a 9ª, 2012–2024) foram catalogados com 100% de integridade e fidelidade aos dados públicos. A classificação amarela documenta lacunas na própria fonte primária original do evento — ausência de atribuição de DOIs na origem e anais das primeiras edições (1ª e 2ª edições) nunca digitalizados pela organização. Textos completos em processo de resgate documental independente. |
| **Método de Auditoria** | Verificação independente com hash criptográfico SHA-256 por arquivo, conferência direta contra publicações originais e rastreabilidade estrita. |
| **Ciclo de Atualização** | Acompanhe as revisões periódicas no repositório [BRAN-Org/.github](https://github.com/BRAN-Org/.github/blob/main/CALENDAR.md). |

> [!IMPORTANT]
> **Transparência da Curadoria:** A BRAN Org preserva a fidelidade estrita à fonte primária e não inventa dados ou metadados inexistentes. Lacunas ou inconsistências presentes na origem são documentadas tecnicamente para assegurar integridade em análises cienciométricas.

---

<p align="center">
  Curadoria e Preservação Digital por <strong><a href="https://github.com/BRAN-Org">BRAN Org</a></strong>
</p>
