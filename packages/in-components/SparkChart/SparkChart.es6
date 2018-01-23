import LineMetricRenderer from 'in-components/SparkChart/LineMetricRenderer';

export default class SparkChart {
  constructor(canvas) {
    this.canvas = canvas;

    const width = 100;
    const height = 28;

    canvas.setAttribute('width', width);
    canvas.setAttribute('height', height);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    this.lineMetricRenderer = new LineMetricRenderer(canvas, {
      paddingLeft: 1,
      paddingRight: 1,
      paddingTop: 1,
      paddingBottom: 1
    });
  }

  update(props) {
    this.lineMetricRenderer.update(props);
    this.lineMetricRenderer.render();
  }

  dispose() {
    this.lineMetricRenderer = null;
  }
}
