# 🛠️ Guia de Contribuição e Manutenção do Template Base (`abec-open-database_template`)
> **Instruções Oficiais para Alterações Estruturais, Frontend, Layouts e APIs das Bases de Dados**

Este repositório é o **TEMPLATE BASE OFICIAL** utilizado pela **BRAN Org** para instanciar e gerenciar bases de dados acadêmicas (como `abec-open-database`, `ebbc-open-database`, etc.).

---

## 🎯 Regra de Ouro da Arquitetura de Templates

> ⚠️ **NUNCA altere o layout, estilos CSS, componentes de interface, servidor backend (`server.js`) ou scripts de infraestrutura diretamente em um repositório de base de dados final.**
> 
> **Todas as mudanças estruturais e visuais DEVEM ser realizadas NESTE REPOSITÓRIO TEMPLATE.**

Quando uma alteração é aprovada e mesclada na branch `main` deste template, o robô de sincronização (*GitHub Template Sync*) propaga automaticamente as melhorias de código e layout para **TODAS** as bases de dados ativas da organização!

---

## 🛠️ Como Contribuir com Mudanças no Template

### 1. Ambientes e Teste Local
1. Clone este repositório template:
   ```bash
   git clone https://github.com/BRAN-Org/abec-open-database_template.git
   cd abec-open-database_template
   ```
2. Instale as dependências e inicie o ambiente de desenvolvimento local:
   ```bash
   npm install
   npm run dev
   ```
3. Teste os componentes de visualização com os dados de demonstração contidos na pasta `mock/` ou `data/`.

### 2. Cuidados com o `.templatesyncignore`
Ao adicionar novos arquivos de infraestrutura ao template, certifique-se de respeitar o arquivo `.templatesyncignore`:
* Arquivos como `data/`, `provenance.json` e `health_check.json` contêm dados **específicos de cada evento/acervo** e são ignorados pelo sync para não sobrescrever os dados reais das bases de dados consumidoras.

### 3. Submetendo Alterações no Template
1. Crie uma branch descritiva a partir da `development`:
   `git checkout -b feat/novo-header-responsivo development`
2. Garanta que o servidor `server.js` e as rotas de API continuam funcionando perfeitamente.
3. **Abertura do Pull Request**:
   > ⚠️ **REGRA OBRIGATÓRIA**: Todo Pull Request DEVE ter como branch de destino a **`development`** (`base: development`).
   > **NÃO abra Pull Request direto para a branch `main`.** O merge para a `main` é realizado exclusivamente pelos mantenedores após testes de homologação.

---

## 🔄 Fluxo de Propagação para as Bases de Dados

```text
[1. PR Aprovado na branch development] ➔ [2. Homologação & Merge na branch main] ➔ [3. Template Sync Disparado] ➔ [4. Atualização Automática nas Bases de Dados]
```

Obrigado por ajudar a evoluir a infraestrutura visual e tecnológica da BRAN Org! 🚀✨
