import { drawPoint } from 'in-components/Chart/renderer/point';

export const hourlyBudgetMetricId = 'hourlyBudget';

export default {
  render: ({ color, scale, config, dataSeries, metricId }) => {
    if (!dataSeries || dataSeries.length === 0) {
      return;
    }

    if (dataSeries.length === 1) {
      // only draw a dot if just a single data point is available
      const dataPoint = dataSeries[0];
      const posX = config.xScaleBackBuffer.getRange(dataPoint[0]);
      const posY = scale.getRange(dataPoint[1]);
      config.backBufferCtx.beginPath();
      drawPoint(config, posX, posY, color);
      config.backBufferCtx.stroke();
      return;
    }

    const lineWidth = config.y1?.lineWidth ?? 2;
    const markerPaneHeight = config.markerPaneHeight;

    let previousPosY;
    const lineVertices = [];
    for (let i = 0; i < dataSeries.length; i++) {
      const dataPoint = dataSeries[i];
      if (!dataPoint) {
        continue;
      }

      const posX = config.xScaleBackBuffer.getRange(dataPoint[0]);
      const posY = scale.getRange(dataPoint[1]);
      if (previousPosY) {
        lineVertices.push([posX, previousPosY]);
      }
      lineVertices.push([posX, posY]);

      previousPosY = posY;
    }

    config.backBufferCtx.beginPath();
    config.backBufferCtx.strokeStyle = color;
    config.backBufferCtx.lineWidth = lineWidth;
    drawLines(lineVertices, config);
    config.backBufferCtx.stroke();

    // FIXME currently the renderer is dependent that this specific metricId is used, to apply filled background just
    //       for this specific metric. There must be a better way to parameterize one of the metrics that this one is
    //       rendered differently from the others, similar to assigning them different colors
    const fillTopBackground = metricId === hourlyBudgetMetricId;

    if (fillTopBackground) {
      const startVertex = lineVertices[0];
      const endVertex = lineVertices[lineVertices.length - 1];

      // background are above
      config.backBufferCtx.save();
      config.backBufferCtx.beginPath();
      config.backBufferCtx.fillStyle = color;
      config.backBufferCtx.globalAlpha = 0.25;
      drawLines(lineVertices, config);
      config.backBufferCtx.lineTo(endVertex[0], markerPaneHeight);
      config.backBufferCtx.lineTo(startVertex[0], markerPaneHeight);
      config.backBufferCtx.closePath();
      config.backBufferCtx.fill();
      config.backBufferCtx.restore();
    }
  }
};

function drawLines(lineVertices, config) {
  const startVertex = lineVertices[0];
  config.backBufferCtx.moveTo(startVertex[0], startVertex[1]);
  for (let i = 1; i < lineVertices.length; i++) {
    const thisVertex = lineVertices[i];
    config.backBufferCtx.lineTo(thisVertex[0], thisVertex[1]);
  }
}
