/**
 * Componente de Gráficos Leves em Canvas HTML5 (Zero-Dependency)
 * Visual OS inspirado em simeon.sh com fonte Geist & Geist Mono.
 * Suporta tooltips responsivos no mouse-hover (com texto completo)
 * e exportação PNG de alta resolução com Nomes Completos (sem truncamento ..).
 */
export class SimpleChart {
  constructor(canvasId) {
    this.canvas = typeof canvasId === 'string' ? document.getElementById(canvasId) : canvasId;
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.palette = 'simeon';
    this.chartType = 'bar';
    this.lastData = null;
    this.lastLabelKey = 'name';
    this.lastValueKey = 'count';
    this.hoverIndex = -1;
    this.barBounds = []; // Guarda as coordenadas das barras para interatividade do mouse

    this.initTooltip();
    this.initMouseEvents();
  }

  setPalette(paletteName) {
    this.palette = paletteName || 'simeon';
  }

  setChartType(type) {
    this.chartType = type || 'bar';
  }

  getPaletteColors() {
    switch (this.palette) {
      case 'neon':
        return ['#00f0ff', '#ff007f', '#00ff66', '#ff00ff', '#ffff00'];
      case 'pastel':
        return ['#a7f3d0', '#fef08a', '#fbcfe8', '#bae6fd', '#c084fc'];
      case 'monochrome':
        return ['#ffffff', '#d4d4d4', '#a3a3a3', '#737373', '#525252'];
      case 'apple':
        return ['#ffffff', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];
      case 'simeon':
      default:
        return ['#ffffff', '#3064ff', '#30d158', '#ff9f0a', '#fe257f', '#b59aff'];
    }
  }

  initTooltip() {
    let tooltip = document.getElementById('chart-global-tooltip');
    if (!tooltip) {
      tooltip = document.createElement('div');
      tooltip.id = 'chart-global-tooltip';
      tooltip.style.cssText = `
        position: absolute;
        display: none;
        pointer-events: none;
        background: rgba(12, 16, 24, 0.95);
        border: 1px solid rgba(255, 255, 255, 0.2);
        backdrop-filter: blur(10px);
        color: #ffffff;
        padding: 8px 12px;
        border-radius: 8px;
        font-family: "Geist Mono", monospace;
        font-size: 12px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
        z-index: 99999;
        transition: opacity 0.1s ease;
        max-width: 320px;
        word-break: break-word;
      `;
      document.body.appendChild(tooltip);
    }
    this.tooltip = tooltip;
  }

  initMouseEvents() {
    if (!this.canvas) return;

    this.canvas.addEventListener('mousemove', (e) => {
      if (!this.barBounds || this.barBounds.length === 0) return;

      const rect = this.canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      let foundIndex = -1;
      for (let i = 0; i < this.barBounds.length; i++) {
        const b = this.barBounds[i];
        if (mouseX >= b.x && mouseX <= b.x + b.w && mouseY >= b.y && mouseY <= b.y + b.h) {
          foundIndex = i;
          break;
        }
      }

      if (foundIndex !== -1) {
        const bound = this.barBounds[foundIndex];
        this.canvas.style.cursor = 'pointer';
        this.showTooltip(e.pageX, e.pageY, bound.fullLabel, bound.val);

        if (this.hoverIndex !== foundIndex) {
          this.hoverIndex = foundIndex;
          this.render(this.lastData, this.lastLabelKey, this.lastValueKey);
        }
      } else {
        this.canvas.style.cursor = 'default';
        this.hideTooltip();
        if (this.hoverIndex !== -1) {
          this.hoverIndex = -1;
          this.render(this.lastData, this.lastLabelKey, this.lastValueKey);
        }
      }
    });

    this.canvas.addEventListener('mouseleave', () => {
      this.canvas.style.cursor = 'default';
      this.hideTooltip();
      if (this.hoverIndex !== -1) {
        this.hoverIndex = -1;
        this.render(this.lastData, this.lastLabelKey, this.lastValueKey);
      }
    });
  }

  showTooltip(pageX, pageY, fullLabel, val) {
    if (!this.tooltip) return;
    this.tooltip.innerHTML = `<div style="font-weight: 700; color: #30d158; margin-bottom: 2px;">${val} trabalho(s)</div><div style="color: #e2e8f0; line-height: 1.3;">${this.escapeHtml(fullLabel)}</div>`;
    this.tooltip.style.left = `${pageX + 14}px`;
    this.tooltip.style.top = `${pageY + 14}px`;
    this.tooltip.style.display = 'block';
    this.tooltip.style.opacity = '1';
  }

  hideTooltip() {
    if (this.tooltip) {
      this.tooltip.style.display = 'none';
      this.tooltip.style.opacity = '0';
    }
  }

  setupCanvas() {
    const dpr = window.devicePixelRatio || 1;
    const parent = this.canvas.parentElement;

    let width = parent ? parent.clientWidth : this.canvas.getBoundingClientRect().width;
    let height = parent ? parent.clientHeight : this.canvas.getBoundingClientRect().height;

    if (!width || width <= 0) width = 400;
    if (!height || height <= 0) height = 260;

    this.canvas.width = Math.floor(width * dpr);
    this.canvas.height = Math.floor(height * dpr);
    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;

    if (typeof this.ctx.resetTransform === 'function') {
      this.ctx.resetTransform();
    } else {
      this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    }
    this.ctx.scale(dpr, dpr);
    return { width, height };
  }

  render(data, labelKey = 'name', valueKey = 'count') {
    if (!this.ctx || !data) return;
    this.lastData = data;
    this.lastLabelKey = labelKey;
    this.lastValueKey = valueKey;

    if (this.chartType === 'radar') {
      this.renderRadarChart(data, labelKey, valueKey);
    } else if (this.chartType === 'line') {
      this.renderLineChart(data, labelKey, valueKey);
    } else {
      this.renderBarChart(data, labelKey, valueKey);
    }
  }

  renderBarChart(data, labelKey = 'name', valueKey = 'count') {
    const { ctx } = this;
    const { width, height } = this.setupCanvas();
    ctx.clearRect(0, 0, width, height);

    const items = Array.isArray(data) ? data : Object.entries(data).map(([name, count]) => ({ name, count }));
    if (items.length === 0) return;

    this.barBounds = [];
    const colors = this.getPaletteColors();
    const maxVal = Math.max(...items.map(d => d[valueKey] || d.count || 0), 1);
    const barHeight = Math.min(24, Math.floor((height - 20) / items.length - 6));
    const startX = Math.min(145, Math.floor(width * 0.32));
    const rightMargin = 45;
    const chartWidth = Math.max(width - startX - rightMargin, 50);

    items.forEach((item, index) => {
      const fullLabel = String(item[labelKey] || item.name || '');
      const val = item[valueKey] ?? item.count ?? 0;
      const y = 10 + index * (barHeight + 6);
      const barW = Math.min((val / maxVal) * chartWidth, chartWidth);

      // Salvar limites para mouse hover em toda a linha
      this.barBounds.push({
        x: 0,
        y: y - 2,
        w: width,
        h: barHeight + 4,
        fullLabel,
        val,
        index
      });

      const isHovered = this.hoverIndex === index;

      // Label (com truncamento suave na tela para caber no grid)
      ctx.fillStyle = isHovered ? '#ffffff' : '#8a9390';
      ctx.font = isHovered ? '600 11px "Geist Mono", monospace' : '500 11px "Geist Mono", monospace';
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      const truncatedLabel = fullLabel.length > 17 ? fullLabel.substring(0, 15) + '..' : fullLabel;
      ctx.fillText(truncatedLabel, startX - 8, y + barHeight / 2);

      // Track
      ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
      this.drawRoundedRect(startX, y, chartWidth, barHeight, 4);
      ctx.fill();

      // Bar Fill
      ctx.fillStyle = colors[index % colors.length];
      if (barW > 0) {
        this.drawRoundedRect(startX, y, Math.max(barW, 4), barHeight, 4);
        ctx.fill();

        if (isHovered) {
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }
      }

      // Value text
      ctx.fillStyle = isHovered ? '#30d158' : '#ffffff';
      ctx.font = '700 11px "Geist Mono", monospace';
      ctx.textAlign = 'left';
      ctx.fillText(String(val), startX + barW + 6, y + barHeight / 2);
    });
  }

  renderLineChart(data, labelKey = 'name', valueKey = 'count') {
    const { ctx } = this;
    const { width, height } = this.setupCanvas();
    ctx.clearRect(0, 0, width, height);

    const items = Array.isArray(data) ? data : Object.entries(data).map(([name, count]) => ({ name, count }));
    if (items.length === 0) return;

    this.barBounds = [];
    const colors = this.getPaletteColors();
    const padding = 40;
    const chartW = Math.max(width - padding * 2, 50);
    const chartH = Math.max(height - padding * 2, 50);
    const maxVal = Math.max(...items.map(d => d[valueKey] || d.count || 0), 1);

    ctx.beginPath();
    ctx.strokeStyle = colors[0];
    ctx.lineWidth = 3;

    const points = [];
    items.forEach((item, idx) => {
      const fullLabel = String(item[labelKey] || item.name || '');
      const val = item[valueKey] ?? item.count ?? 0;
      const x = padding + (idx / (items.length - 1 || 1)) * chartW;
      const y = height - padding - (val / maxVal) * chartH;
      points.push({ x, y, fullLabel, val, index: idx });

      this.barBounds.push({
        x: x - 15,
        y: 0,
        w: 30,
        h: height,
        fullLabel,
        val,
        index: idx
      });

      if (idx === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    points.forEach(p => {
      const isHovered = this.hoverIndex === p.index;
      ctx.fillStyle = isHovered ? '#ffffff' : (colors[1] || colors[0]);
      ctx.beginPath();
      ctx.arc(p.x, p.y, isHovered ? 7 : 5, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = isHovered ? '#ffffff' : '#8a9390';
      ctx.font = '500 11px "Geist Mono", monospace';
      ctx.textAlign = 'center';
      const truncated = p.fullLabel.length > 10 ? p.fullLabel.substring(0, 8) + '..' : p.fullLabel;
      ctx.fillText(truncated, p.x, height - 15);
      ctx.fillText(String(p.val), p.x, p.y - 10);
    });
  }

  renderRadarChart(data, labelKey = 'name', valueKey = 'count') {
    const { ctx } = this;
    const { width, height } = this.setupCanvas();
    ctx.clearRect(0, 0, width, height);

    const items = Array.isArray(data) ? data : Object.entries(data).map(([name, count]) => ({ name, count }));
    if (items.length === 0) return;

    this.barBounds = [];
    const colors = this.getPaletteColors();
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.max(Math.min(centerX, centerY) - 35, 20);
    const total = items.length;
    const maxVal = Math.max(...items.map(d => d[valueKey] || d.count || 0), 1);

    for (let r = 1; r <= 3; r++) {
      const rad = (radius / 3) * r;
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.arc(centerX, centerY, rad, 0, Math.PI * 2);
      ctx.stroke();
    }

    const points = [];
    items.forEach((item, i) => {
      const angle = (Math.PI * 2 / total) * i - Math.PI / 2;
      const val = item[valueKey] ?? item.count ?? 0;
      const fullLabel = String(item[labelKey] || item.name || '');
      const dist = (val / maxVal) * radius;
      const x = centerX + Math.cos(angle) * dist;
      const y = centerY + Math.sin(angle) * dist;
      points.push({ x, y, fullLabel, angle, dist, val, index: i });

      this.barBounds.push({
        x: x - 15,
        y: y - 15,
        w: 30,
        h: 30,
        fullLabel,
        val,
        index: i
      });
    });

    ctx.beginPath();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.strokeStyle = colors[0];
    ctx.lineWidth = 2;

    points.forEach((p, i) => {
      if (i === 0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    });
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    points.forEach(p => {
      const lx = centerX + Math.cos(p.angle) * (radius + 18);
      const ly = centerY + Math.sin(p.angle) * (radius + 18);
      const isHovered = this.hoverIndex === p.index;

      ctx.fillStyle = isHovered ? '#ffffff' : '#8a9390';
      ctx.font = isHovered ? '600 11px "Geist Mono", monospace' : '500 11px "Geist Mono", monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const truncated = p.fullLabel.length > 10 ? p.fullLabel.substring(0, 8) + '..' : p.fullLabel;
      ctx.fillText(truncated, lx, ly);
    });
  }

  /**
   * EXPORTAÇÃO PNG DE ALTA RESOLUÇÃO COM NOMES 100% COMPLETOS (SEM TRUNCAMENTO)
   */
  exportPNG(chartTitle = 'Gráfico Estatístico', filename = 'grafico-estatistico.png') {
    if (!this.lastData) return;

    const data = this.lastData;
    const items = Array.isArray(data) ? data : Object.entries(data).map(([name, count]) => ({ name, count }));
    if (items.length === 0) return;

    // Criar canvas offscreen de alta definição (1400px x 800px)
    const offCanvas = document.createElement('canvas');
    const exportWidth = 1400;
    const exportHeight = 120 + items.length * 48 + 80;
    offCanvas.width = exportWidth;
    offCanvas.height = exportHeight;

    const ctx = offCanvas.getContext('2d');

    // Fundo escuro premium
    ctx.fillStyle = '#0b0f17';
    ctx.fillRect(0, 0, exportWidth, exportHeight);

    // Borda elegante
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 2;
    this.drawRoundedRectOnCtx(ctx, 16, 16, exportWidth - 32, exportHeight - 32, 12);
    ctx.stroke();

    // Título do Gráfico no PNG
    ctx.fillStyle = '#ffffff';
    ctx.font = '700 24px "Geist Mono", monospace';
    ctx.textAlign = 'left';
    ctx.fillText(chartTitle, 40, 56);

    ctx.fillStyle = '#8a9390';
    ctx.font = '500 14px "Geist Mono", monospace';
    ctx.fillText('BRAN Org OpenData OS — FAIR & BOAI Open Access', 40, 84);

    // Linha divisória
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.beginPath();
    ctx.moveTo(40, 102);
    ctx.lineTo(exportWidth - 40, 102);
    ctx.stroke();

    // Encontrar o maior comprimento de texto em pixels para calcular o recuo ideal (zero truncamento)
    ctx.font = '500 15px "Geist Mono", monospace';
    let maxLabelWidth = 180;
    items.forEach(item => {
      const fullLabel = String(item[this.lastLabelKey] || item.name || '');
      const measured = ctx.measureText(fullLabel).width;
      if (measured > maxLabelWidth) maxLabelWidth = measured;
    });

    const startX = Math.min(Math.max(260, Math.ceil(maxLabelWidth + 60)), 500);
    const rightMargin = 80;
    const chartWidth = exportWidth - startX - rightMargin;
    const colors = this.getPaletteColors();
    const maxVal = Math.max(...items.map(d => d[this.lastValueKey] || d.count || 0), 1);
    const barH = 32;

    items.forEach((item, index) => {
      const fullLabel = String(item[this.lastLabelKey] || item.name || '');
      const val = item[this.lastValueKey] ?? item.count ?? 0;
      const y = 125 + index * (barH + 14);
      const barW = Math.min((val / maxVal) * chartWidth, chartWidth);

      // Nome 100% Completo
      ctx.fillStyle = '#cbd5e1';
      ctx.font = '500 15px "Geist Mono", monospace';
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      ctx.fillText(fullLabel, startX - 16, y + barH / 2);

      // Track de fundo
      ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
      this.drawRoundedRectOnCtx(ctx, startX, y, chartWidth, barH, 6);
      ctx.fill();

      // Barra colorida
      ctx.fillStyle = colors[index % colors.length];
      if (barW > 0) {
        this.drawRoundedRectOnCtx(ctx, startX, y, Math.max(barW, 6), barH, 6);
        ctx.fill();
      }

      // Valor no PNG
      ctx.fillStyle = '#ffffff';
      ctx.font = '700 16px "Geist Mono", monospace';
      ctx.textAlign = 'left';
      ctx.fillText(`${val} trabalho(s)`, startX + barW + 12, y + barH / 2);
    });

    // Rodapé de marca d'água no PNG
    ctx.fillStyle = '#64748b';
    ctx.font = '500 13px "Geist Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('Gerado via BRAN Org OpenData Platform (https://github.com/BRAN-Org)', exportWidth / 2, exportHeight - 28);

    // Download da imagem PNG
    const link = document.createElement('a');
    link.download = filename;
    link.href = offCanvas.toDataURL('image/png');
    link.click();
  }

  drawRoundedRectOnCtx(targetCtx, x, y, w, h, r) {
    if (w < 2 * r) r = w / 2;
    if (h < 2 * r) r = h / 2;
    targetCtx.beginPath();
    targetCtx.moveTo(x + r, y);
    targetCtx.arcTo(x + w, y, x + w, y + h, r);
    targetCtx.arcTo(x + w, y + h, x, y + h, r);
    targetCtx.arcTo(x, y + h, x, y, r);
    targetCtx.arcTo(x, y, x + w, y, r);
    targetCtx.closePath();
  }

  drawRoundedRect(x, y, w, h, r) {
    this.drawRoundedRectOnCtx(this.ctx, x, y, w, h, r);
  }

  escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
}
