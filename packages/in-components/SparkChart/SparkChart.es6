import LineMetricRenderer from 'in-components/SparkChart/LineMetricRenderer';
import { updateCanvasDimensions } from 'in-charts/canvas';

export default class SparkChart {
  constructor(canvas, width, height) {
    this.canvas = canvas;

    updateCanvasDimensions(canvas, canvas.getContext('2d'), width, height);

    this.lineMetricRenderer = new LineMetricRenderer(canvas, {
      width,
      height,
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
