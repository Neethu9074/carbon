/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

export function calculateMetricMap(metrics) {
  const metricMap = {};

  for (let iMetric = 0; iMetric < metrics.length; iMetric++) {
    const dataSeries = metrics[iMetric];

    for (let i = 0; i < dataSeries.length; i++) {
      const dataPoint = dataSeries[i];
      if (!dataPoint) {
        continue;
      }
      const previousValue = iMetric > 0 && metricMap[dataPoint[0]] != null ? metricMap[dataPoint[0]] : 0;
      const value = dataPoint[1] + previousValue;
      metricMap[dataPoint[0]] = value;
    }
  }
  return metricMap;
}

export function drawCircleWithLine({ renderingContext, config, xPos, yPos, circleStyle, lineStyle }) {
  renderingContext.lineWidth = 2;

  // area below the lone data point will be represented by a simple line
  renderingContext.beginPath();
  renderingContext.strokeStyle = lineStyle;
  renderingContext.moveTo(xPos - 2, yPos + 2);
  renderingContext.lineTo(xPos - 2, config.height - config.timeAxisHeight);
  renderingContext.stroke();

  // a circle represents the lone data point
  renderingContext.beginPath();
  renderingContext.strokeStyle = circleStyle;
  renderingContext.moveTo(xPos, yPos);
  renderingContext.arc(xPos - 2, yPos, 2, 0, 2 * Math.PI);
  renderingContext.stroke();
}
