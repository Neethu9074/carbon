import LineMetricRenderer from 'in-components/SparkChart/LineMetricRenderer';
import createScale from 'in-charts/scale';

export default class SparkChart {
  constructor(canvas, timeframe, metrics) {
    this.canvas = canvas;

    const width = 100;
    const height = 28;

    canvas.setAttribute('width', width);
    canvas.setAttribute('height', height);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    this.scale = createScale();
    this.scale.setRangeFrom(0);
    this.scale.setRangeTo(width - 2);
    this.scale.setDomainFrom(timeframe.to - timeframe.windowSize);
    this.scale.setDomainTo(timeframe.to);

    this.lineMetricRenderer = new LineMetricRenderer(canvas, this.scale);
    this.lineMetricRenderer.render(metrics);
  }

  update(timeframe, metrics) {
    this.scale.setDomainFrom(timeframe.to - timeframe.windowSize);
    this.scale.setDomainTo(timeframe.to);

    this.lineMetricRenderer.render(metrics);
  }

  dispose() {
    this.lineMetricRenderer = null;
  }
}
