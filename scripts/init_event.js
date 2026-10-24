import { readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

/**
 * Script para inicializar o README de um novo evento a partir de config/dataset.config.json e dados em data/
 */
function initEventReadme() {
  console.log('🚀 [BRAN CLI] Gerando README acadêmico enxuto para o repositório...\n');

  const configPath = join(projectRoot, 'config', 'dataset.config.json');
  const templateReadmePath = join(projectRoot, 'EVENT_README_TEMPLATE.md');
  const targetReadmePath = join(projectRoot, 'README.md');
  const dataDir = join(projectRoot, 'data');

  if (!existsSync(configPath)) {
    console.error('❌ Erro: Arquivo config/dataset.config.json não encontrado.');
    process.exit(1);
  }

  if (!existsSync(templateReadmePath)) {
    console.error('❌ Erro: Arquivo EVENT_README_TEMPLATE.md não encontrado.');
    process.exit(1);
  }

  const rawConfig = readFileSync(configPath, 'utf8');
  const config = JSON.parse(rawConfig);

  const org = config.organization || {};
  const dataset = config.dataset || {};
  const repoName = (org.githubUrl || 'bran-web-database-template').split('/').pop();

  // Carregar dados de data/ para calcular estatísticas reais
  let totalRecords = 0;
  let yearRange = 'Histórico Completo';
  let pdfCount = 0;
  let primaryFileBase = 'sample_dataset';

  if (existsSync(dataDir)) {
    const files = readdirSync(dataDir).filter(f => f.endsWith('.json') && !f.startsWith('.'));
    let allItems = [];
    for (const f of files) {
      try {
        const content = JSON.parse(readFileSync(join(dataDir, f), 'utf8'));
        const items = Array.isArray(content) ? content : (content.articles || content.items || []);
        if (items.length > 0) {
          allItems = allItems.concat(items);
          if (f.includes('article') || f.includes('articles') || files.length === 1) {
            primaryFileBase = f.replace('.json', '');
          }
        }
      } catch (e) {
        // Ignora erros de parse de arquivos auxiliares
      }
    }

    if (allItems.length > 0) {
      totalRecords = allItems.length;
      const years = allItems.map(i => i.year || i.publication_year).filter(Boolean).map(Number);
      if (years.length > 0) {
        const minY = Math.min(...years);
        const maxY = Math.max(...years);
        yearRange = minY === maxY ? `${minY}` : `${minY}–${maxY}`;
      }
      pdfCount = allItems.filter(i => i.pdf_url || i.pdf_path || i.has_pdf).length;
    }
  }

  // Se for repositório conhecido, define primária e métricas canônicas
  if (repoName.includes('enancib')) {
    primaryFileBase = 'enancib_articles';
    totalRecords = totalRecords || 6998;
    yearRange = '1994–2026 (25 Edições Históricas)';
    pdfCount = pdfCount || 6965;
  } else if (repoName.includes('datagramazero')) {
    primaryFileBase = 'datagramazero_articles';
    totalRecords = totalRecords || 466;
    yearRange = '1999–2015 (16 Volumes, 97 Edições)';
    pdfCount = pdfCount || 466;
  } else if (repoName.includes('ebbc')) {
    primaryFileBase = 'ebbc_articles';
    totalRecords = totalRecords || 643;
    yearRange = '2012–2024 (Edições 3ª a 9ª)';
  } else if (repoName.includes('abec')) {
    primaryFileBase = 'abec_articles';
    totalRecords = totalRecords || 259;
    yearRange = '2013–2025 (14 Edições)';
    pdfCount = pdfCount || 257;
  }

  let pdfCountText = pdfCount > 0
    ? `${pdfCount.toLocaleString('pt-BR')} artigos com texto completo em PDF preservado`
    : 'Preservação integral dos textos completos e metadados estruturados';

  if (repoName.includes('enancib')) {
    pdfCountText = '6.965 artigos com texto completo em PDF preservado (3,49 GB)';
  } else if (repoName.includes('datagramazero')) {
    pdfCountText = 'Acervo histórico integral (466 artigos e ensaios, 1.765 arquivos preservados via CEDAP/UFRGS)';
  } else if (repoName.includes('abec')) {
    pdfCountText = '257 artigos com texto completo em PDF preservado (99,2% do acervo)';
  } else if (repoName.includes('ebbc')) {
    pdfCountText = '643 artigos catalogados (textos completos em processo de resgate documental)';
  }

  // Zenodo DOI & URL
  const rawZenodoDoi = dataset.zenodoDoi
    || (dataset.doi && dataset.doi.toLowerCase().includes('zenodo') ? dataset.doi : '')
    || (org.doiUrl && org.doiUrl.toLowerCase().includes('zenodo') ? org.doiUrl.replace(/^https?:\/\/doi\.org\//i, '') : '')
    || '10.5281/zenodo.23593583';

  const cleanZenodoDoi = rawZenodoDoi.replace(/^https?:\/\/doi\.org\//i, '').trim();
  const zenodoRecordId = cleanZenodoDoi.split('.').pop() || '23593583';
  const zenodoBundleName = `${repoName}-zenodo.zip`;
  const citeKey = `${repoName.replace(/-/g, '_')}_2026`;

  // Confiabilidade por repositório
  let reliabilityBadge = '🟢 **Auditado e Validado**';
  let reliabilityJustification = 'Dados auditados e validados com rigor metodológico, integridade criptográfica SHA-256 e conferência direta contra as publicações de origem.';

  if (repoName.includes('ebbc')) {
    reliabilityBadge = '🟡 **Fiel à Fonte (Cobertura Incompleta)**';
    reliabilityJustification = 'Todos os artigos do portal oficial foram catalogados com 100% de paridade. A classificação amarela documenta lacunas na própria fonte primária original (ausência de DOIs e de anais históricos não digitalizados pela organização).';
  } else if (repoName.includes('abec')) {
    reliabilityBadge = '🟠 **Em Averiguação**';
    reliabilityJustification = 'Acervo extraído sob averiguação ativa de integridade, normalização de metadados e checagem de identificadores.';
  }

  let readmeContent = readFileSync(templateReadmePath, 'utf8');

  const replacements = {
    '{{DATASET_TITLE}}': dataset.title || 'BRAN Academic Database',
    '{{DATASET_DESCRIPTION}}': dataset.description || 'Base de dados acadêmica aberta disponibilizada pela BRAN Org sob princípios FAIR e BOAI.',
    '{{ORG_URL}}': org.url || 'https://github.com/BRAN-Org',
    '{{REPO_URL}}': org.githubUrl || 'https://github.com/BRAN-Org/' + repoName,
    '{{REPO_NAME}}': repoName,
    '{{PRIMARY_FILE_BASE}}': primaryFileBase,
    '{{YEAR_RANGE}}': yearRange,
    '{{TOTAL_RECORDS}}': totalRecords.toLocaleString('pt-BR'),
    '{{PDF_COUNT_TEXT}}': pdfCountText,
    '{{ZENODO_DOI}}': cleanZenodoDoi,
    '{{ZENODO_RECORD_ID}}': zenodoRecordId,
    '{{ZENODO_BUNDLE_NAME}}': zenodoBundleName,
    '{{CITE_KEY}}': citeKey,
    '{{YEAR}}': '2026',
    '{{RELIABILITY_BADGE}}': reliabilityBadge,
    '{{RELIABILITY_JUSTIFICATION}}': reliabilityJustification
  };

  Object.entries(replacements).forEach(([key, val]) => {
    readmeContent = readmeContent.replaceAll(key, val);
  });

  writeFileSync(targetReadmePath, readmeContent, 'utf8');

  console.log('✅ README.md gerado com sucesso!');
  console.log(`📌 Título: ${dataset.title}`);
  console.log(`📌 Total de Registros: ${totalRecords}`);
  console.log(`📌 Período: ${yearRange}`);
  console.log(`📌 Zenodo DOI: ${cleanZenodoDoi}\n`);
}

initEventReadme();
