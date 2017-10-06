import { updateCanvasDimensions } from 'in-charts/canvas';

export default function createController(canvas) {
  const ctx = canvas.getContext('2d');
  const anomaliesCanvas = document.createElement('canvas');
  const ctxAnomalies = anomaliesCanvas.getContext('2d');

  let sensitivity = 100;
  let width = 0;
  let height = 0;

  return {
    update
  };

  function update(_sensitivity, _width, _height) {
    sensitivity = _sensitivity / 100;
    width = _width;
    height = _height;

    updateCanvasDimensions(canvas, ctx, width, height, 1);
    updateCanvasDimensions(anomaliesCanvas, ctxAnomalies, width, height, 1);

    render();
  }

  function render() {
    ctx.clearRect(0, 0, width, height);
    renderCorridor(ctx);
    renderMetric(ctx, '#5da6da');

    ctxAnomalies.clearRect(0, 0, width, height);
    ctxAnomalies.globalCompositeOperation = 'source-over';
    renderMetric(ctxAnomalies, '#ff0000');
    ctxAnomalies.globalCompositeOperation = 'destination-out';
    renderCorridor(ctxAnomalies);
    ctxAnomalies.globalCompositeOperation = 'source-over';
    ctx.drawImage(anomaliesCanvas, 0, 0, width, height);
  }

  function renderMetric(context, color) {
    const metricCurve = [
      [0, 0.5],
      [0.1, 0.074],
      [0.2, 0.251],
      [0.3, 0.622],
      [0.4, 0.509],
      [0.5, 0.037],
      [0.6, 0.058],
      [0.7, 0.241],
      [0.8, 0.544],
      [0.9, 0.785],
      [1, 0.478]
    ];

    context.beginPath();
    for (let i = 0, length = metricCurve.length; i < length; i++) {
      const dataPoint = metricCurve[i];
      context.lineTo(width * dataPoint[0], height * dataPoint[1]);
    }
    context.lineWidth = 2;
    context.strokeStyle = color;
    context.stroke();
  }

  function renderCorridor(context) {
    context.beginPath();

    const upperCurve = [
      [0, 0.45, 0.35],
      [0.2, 0.2, 0],
      [0.4, 0.45, 0.41],
      [0.6, 0.25, 0.03],
      [0.8, 0.4, 0.25],
      [1, 0.45, 0.41]
    ];
    const lowerCurve = [
      [0, 0.55, 0.65],
      [0.2, 0.65, 0.9],
      [0.4, 0.55, 0.67],
      [0.6, 0.7, 0.92],
      [0.8, 0.55, 0.67],
      [1, 0.53, 0.62]
    ];

    for (let i = 0, length = upperCurve.length; i < length; i++) {
      const dataPoint = upperCurve[i];
      const x = width * dataPoint[0];
      const yMin = height * dataPoint[1];
      const yMax = height * dataPoint[2];
      context.lineTo(x, yMin + (yMax - yMin) * sensitivity);
    }

    for (let i = lowerCurve.length - 1; i >= 0; i--) {
      const dataPoint = lowerCurve[i];
      const x = width * dataPoint[0];
      const yMin = height * dataPoint[1];
      const yMax = height * dataPoint[2];
      context.lineTo(x, yMin + (yMax - yMin) * sensitivity);
    }

    context.closePath();
    context.fillStyle = '#e5e5e5';
    context.fill();
  }
}
