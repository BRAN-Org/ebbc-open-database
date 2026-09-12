import { test, describe } from 'node:test';
import assert from 'node:assert';
import { loadData, queryItems, getItemByKey, normalizeString } from '../src/dataManager.js';
import { 
  calculateStats, 
  calculateCooccurrenceMatrix, 
  calculateTemporalStacked, 
  calculateScatterData, 
  calculateParetoData 
} from '../src/statsEngine.js';

describe('Unit Tests - DataManager & StatsEngine', () => {
  test('normalizeString deve remover acentos e converter para caixa baixa', () => {
    assert.strictEqual(normalizeString('Ação Científica!'), 'acao cientifica!');
    assert.strictEqual(normalizeString(''), '');
  });

  test('loadData deve carregar o dataset de exemplo', () => {
    const items = loadData();
    assert.ok(Array.isArray(items));
    assert.ok(items.length > 0, 'Deve conter ao menos 1 registro');
  });

  test('queryItems deve filtrar por busca textual global', () => {
    const items = loadData();
    const sampleWord = items[0]?.title ? items[0].title.split(' ')[0] : 'a';
    const res = queryItems({ search: sampleWord });
    assert.ok(res.filteredCount >= 1);
    assert.ok(res.results.length > 0 && res.results.length <= res.filteredCount);
  });

  test('queryItems deve filtrar por faceta de ano', () => {
    const items = loadData();
    const sampleYear = items[0]?.year;
    if (sampleYear) {
      const res = queryItems({ year: String(sampleYear) });
      assert.ok(res.filteredCount >= 1);
    }
  });

  test('getItemByKey deve buscar por DOI completo e ID', () => {
    const items = loadData();
    assert.ok(items.length > 0);
    const sampleItem = items[0];
    const sampleKey = sampleItem.doi || sampleItem.id;
    const foundItem = getItemByKey(sampleKey);
    assert.ok(foundItem, `Deve encontrar o registro pela chave ${sampleKey}`);
  });

  test('calculateStats deve agregar métricas e top listas corretamente', () => {
    const stats = calculateStats();
    assert.ok(stats.totalRecords > 0);
    assert.ok(stats.topLists.topAuthors);
    assert.ok(Array.isArray(stats.topLists.topAuthors.data));
  });

  test('calculateCooccurrenceMatrix deve calcular a matriz de coocorrência 2D 100% interna', () => {
    const matrixData = calculateCooccurrenceMatrix('tools', 'data_sources', 5);
    assert.ok(Array.isArray(matrixData.rows));
    assert.ok(Array.isArray(matrixData.cols));
    assert.ok(typeof matrixData.matrix === 'object');
  });

  test('calculateTemporalStacked deve calcular séries empilhadas por ano', () => {
    const temporalData = calculateTemporalStacked('tools', 3);
    assert.ok(Array.isArray(temporalData.years));
    assert.ok(Array.isArray(temporalData.series));
  });

  test('calculateScatterData deve gerar coordenadas de dispersão e linha de tendência', () => {
    const scatterData = calculateScatterData();
    assert.ok(Array.isArray(scatterData.points));
    assert.ok(typeof scatterData.trendline.slope === 'number');
  });

  test('calculateParetoData deve calcular acumulação percentual de frequências', () => {
    const paretoData = calculateParetoData('authors', 5);
    assert.ok(Array.isArray(paretoData.data));
    assert.ok(paretoData.totalOccurrences >= 0);
  });
});
