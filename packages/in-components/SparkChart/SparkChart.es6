import LineMetricRenderer from 'in-components/SparkChart/LineMetricRenderer';

export default class SparkChart {
  constructor(canvas, width, height) {
    this.canvas = canvas;

    canvas.setAttribute('width', width);
    canvas.setAttribute('height', height);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    this.lineMetricRenderer = new LineMetricRenderer(canvas, {
      paddingLeft: 2,
      paddingRight: 2,
      paddingTop: 2,
      paddingBottom: 2
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
