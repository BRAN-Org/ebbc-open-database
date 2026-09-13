# 🏛️ {{DATASET_TITLE}}

<p align="center">
  <a href="{{ORG_URL}}"><img src="https://img.shields.io/badge/BRAN%20Org-Open%20Data-blue.svg?style=for-the-badge&logo=github" alt="BRAN Org"></a>
  <a href="https://www.budapestopenaccessinitiative.org/"><img src="https://img.shields.io/badge/BOAI-Signatory-orange.svg?style=for-the-badge" alt="BOAI Signatory"></a>
  <a href="https://www.go-fair.org/fair-principles/"><img src="https://img.shields.io/badge/FAIR-Compliant-green.svg?style=for-the-badge" alt="FAIR Principles"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/Code_License-GPLv3-blue.svg?style=for-the-badge" alt="GPLv3"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/Data_License-CC_BY--NC--SA_4.0-lightgrey.svg?style=for-the-badge" alt="CC BY-NC-SA 4.0"></a>
</p>

{{DATASET_DESCRIPTION}}

---

## 📌 Visão Geral da Base de Dados

- **Instituição / Evento**: {{INSTITUTION_NAME}}
- **Entidade Principal**: `{{ENTITY_NAME}}`
- **Total de Registros**: Configurado e indexado dinamicamente
- **Licença dos Dados**: {{DATASET_LICENSE}}
{{DOI_LINE}}
- **Manutenção & Suporte**: [BRAN Org]({{ORG_URL}})

---

## 🌐 Portal Web Interativo & REST API

Esta base de dados fornece tanto uma interface web interativa (Dashboard) quanto uma **API REST pública de alta performance** sem necessidade de chave de API.

### Endpoints Principais

| Método | Endpoint | Descrição |
| :--- | :--- | :--- |
| `GET` | `/api/v1/config` | Retorna os metadados e schema configurado da base |
| `GET` | `/api/v1/{{ENTITY_NAME}}` | Lista registros com busca textual, facetas, ordenação e paginação |
| `GET` | `/api/v1/{{ENTITY_NAME}}/:key` | Busca um registro exato por DOI ou ID |
| `GET` | `/api/v1/{{ENTITY_NAME}}/stats` | Retorna métricas consolidadas (rankings, distribuições por ano) |
| `GET` | `/api/v1/{{ENTITY_NAME}}/stats/temporal` | Análise de séries temporais empilhadas |
| `GET` | `/api/v1/{{ENTITY_NAME}}/stats/correlations` | Matriz de coocorrência (ex: ferramentas vs fontes) |
| `GET` | `/api/v1/{{ENTITY_NAME}}/export?format=csv` | Exporta o dataset completo em **CSV (UTF-8 BOM)** ou **JSON** |

---

## 💻 Exemplo de Consumo da API

### cURL
```bash
curl -X GET "http://localhost:3000/api/v1/{{ENTITY_NAME}}?q=ciencia&limit=5"
```

### JavaScript (Fetch)
```javascript
const response = await fetch('http://localhost:3000/api/v1/{{ENTITY_NAME}}?limit=10');
const data = await response.json();
console.log(`Carregados ${data.total} registros de {{DATASET_TITLE}}`);
```

### Python
```python
import requests

url = "http://localhost:3000/api/v1/{{ENTITY_NAME}}"
response = requests.get(url, params={"limit": 10})
data = response.json()
print(f"Total de registros: {data['total']}")
```

---

## 🚀 Como Rodar Localmente

### 1. Clonar o Repositório
```bash
git clone {{REPO_URL}}.git
cd {{REPO_NAME}}
```

### 2. Instalar Dependências
```bash
npm install
```

### 3. Iniciar o Servidor
```bash
# Modo Desenvolvimento
npm run dev

# Modo Produção
npm start
```
Acesse no navegador: `http://localhost:3000`

---

## 🧪 Validação dos Dados
Para testar a integridade do schema antes do deploy:
```bash
npm run data:validate
```

---

## 📖 Como Citar Este Dataset

Se você utilizar estes dados em pesquisas acadêmicas ou software, por favor cite:

```bibtex
@misc{{{ENTITY_NAME}}_{{YEAR}},
  author       = {{{INSTITUTION_NAME}} and BRAN Org},
  title        = {{{DATASET_TITLE}}},
  year         = {{{YEAR}}},
  publisher    = {Zenodo},
  doi          = {{{DATASET_DOI}}},
  url          = {{{DOI_URL}}}
}
```

---

## 📜 Princípios e Licença

- **[Princípios FAIR](https://www.go-fair.org/fair-principles/)**: Dados *Findable, Accessible, Interoperable, Reusable*.
- **[BOAI](https://www.budapestopenaccessinitiative.org/)**: Livre acesso à informação e produção acadêmica.
- **Licenciamento Duplo**:
  - **Código-fonte & Engine**: [GNU General Public License v3.0 (GPL-3.0)](https://www.gnu.org/licenses/gpl-3.0.html) — Garante Ciência Aberta e código livre livre de fechamentos proprietários.
  - **Dataset Científico & Metadados (`data/`)**: [Creative Commons Attribution-NonCommercial-ShareAlike 4.0 (CC BY-NC-SA 4.0)](https://creativecommons.org/licenses/by-nc-sa/4.0/) — Permite uso e distribuição exclusivamente para pesquisa não-comercial, proibindo expressamente a raspagem ou ingestão para treinamento comercial de modelos de Inteligência Artificial sem autorização prévia.

---

## Confiabilidade e Auditagem dos Dados

| Nível de Confiabilidade | Nota & Justificativa do Acervo |
| :---: | :--- |
| {{RELIABILITY_BADGE}} | {{RELIABILITY_JUSTIFICATION}} |

---

<p align="center">
  Mantido com ❤️ pela <strong><a href="https://github.com/BRAN-Org">BRAN Org</a></strong> e <strong>{{INSTITUTION_NAME}}</strong>
</p>
