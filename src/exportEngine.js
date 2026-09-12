import { queryItems } from './dataManager.js';
import { getDatasetConfig } from './config.js';

/**
 * Exporta dados filtrados no formato JSON ou CSV (com BOM UTF-8)
 */
export function exportDataset(req, res) {
  // Executa a busca aplicando filtros (sem limite/paginação para exportar o conjunto completo filtrado)
  const queryParams = { ...req.query, limit: 0, offset: 0 };
  const { results } = queryItems(queryParams);
  const config = getDatasetConfig();

  const format = (req.query.format || 'json').toLowerCase();
  const entityName = config.dataset?.entityName || 'dataset';

  if (format === 'csv') {
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename=${entityName}_export.csv`);

    // Inserir BOM UTF-8 (\uFEFF) para garantir suporte correto de acentos no Excel
    res.write('\uFEFF');

    if (results.length === 0) {
      res.write('Nenhum registro encontrado\n');
      return res.end();
    }

    // Descobrir todas as colunas dinamicamente a partir dos objetos
    const keysSet = new Set();
    results.forEach(item => {
      Object.keys(item).forEach(k => keysSet.add(k));
    });
    const headers = Array.from(keysSet);

    // Escrever linha do cabeçalho
    res.write(headers.map(h => `"${h.replace(/"/g, '""')}"`).join(',') + '\n');

    // Escrever cada linha
    results.forEach(item => {
      const row = headers.map(header => {
        let val = item[header];
        if (val === undefined || val === null) val = '';
        if (Array.isArray(val)) val = val.join('; ');
        if (typeof val === 'object') val = JSON.stringify(val);

        const strVal = String(val);
        return `"${strVal.replace(/"/g, '""')}"`;
      });
      res.write(row.join(',') + '\n');
    });

    return res.end();
  } else {
    // Exportação JSON padrão
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename=${entityName}_export.json`);
    return res.json(results);
  }
}
