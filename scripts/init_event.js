import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

/**
 * Script para inicializar o README de um novo evento a partir de config/dataset.config.json
 * Substitui o README.md genérico do template pelo README final do evento.
 */
function initEventReadme() {
  console.log('🚀 [BRAN CLI] Inicializando o README final do Evento...\n');

  const configPath = join(projectRoot, 'config', 'dataset.config.json');
  const templateReadmePath = join(projectRoot, 'EVENT_README_TEMPLATE.md');
  const targetReadmePath = join(projectRoot, 'README.md');

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

  let readmeContent = readFileSync(templateReadmePath, 'utf8');

  const hasDoi = dataset.doi && !dataset.doi.includes('0000000') && dataset.doi.trim() !== '';
  const doiUrl = org.doiUrl || (hasDoi ? `https://doi.org/${dataset.doi}` : '');
  const doiLine = hasDoi ? `- **DOI Oficial**: [${dataset.doi}](${doiUrl})` : '';

  const replacements = {
    '{{DATASET_TITLE}}': dataset.title || 'BRAN Academic Database',
    '{{DATASET_DESCRIPTION}}': dataset.description || 'Base de dados acadêmica aberta.',
    '{{INSTITUTION_NAME}}': org.institutionName || 'BRAN Org',
    '{{ENTITY_NAME}}': dataset.entityName || 'articles',
    '{{DATASET_LICENSE}}': dataset.license || 'MIT / CC-BY 4.0',
    '{{DOI_LINE}}': doiLine,
    '{{ORG_URL}}': org.url || 'https://github.com/BRAN-Org',
    '{{REPO_URL}}': org.githubUrl || 'https://github.com/BRAN-Org/bran-web-database-template',
    '{{REPO_NAME}}': (org.githubUrl || 'bran-web-database-template').split('/').pop(),
    '{{YEAR}}': new Date().getFullYear().toString()
  };

  Object.entries(replacements).forEach(([key, val]) => {
    readmeContent = readmeContent.replaceAll(key, val);
  });

  writeFileSync(targetReadmePath, readmeContent, 'utf8');

  console.log('✅ README.md atualizado com sucesso com os metadados do evento!');
  console.log(`📌 Título: ${dataset.title}`);
  console.log(`📌 Entidade: ${dataset.entityName}`);
  console.log(`📌 Arquivo gravado em: ${targetReadmePath}\n`);
}

initEventReadme();
