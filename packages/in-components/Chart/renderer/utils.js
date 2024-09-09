/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

export function calculateMetricMap(metrics, extrapolateMissing = false) {
  const metricMap = {};

  for (let iMetric = 0; iMetric < metrics.length; iMetric++) {
    const dataSeries = metrics[iMetric];

    for (let i = 0; i < dataSeries.length; i++) {
      const dataPoint = dataSeries[i];
      if (!dataPoint) {
        continue;
      }
      let metricMapElement = metricMap[dataPoint[0]];
      if (iMetric > 0) {
        //Not the first line
        if (metricMapElement === undefined) {
          if (extrapolateMissing) {
            metricMapElement = calculateClosest(metrics[iMetric - 1], dataPoint[0]);
          }
        }
      }
      const previousValue = iMetric > 0 && metricMapElement != null ? metricMapElement : 0;
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
function calculateClosest(dataSeries, targetTime) {
  let extrapolatedValueY;
  let beforeTimeX1, beforeValueY1;
  let afterTimeX2, afterValueY2;
  for (let i = 0; i < dataSeries.length; i++) {
    const datapoint = dataSeries[i];
    if (datapoint) {
      let time = datapoint[0];
      let value = datapoint[1];
      if (time < targetTime) {
        beforeTimeX1 = time;
        beforeValueY1 = value;
      }
    }
  }
  for (let i = dataSeries.length - 1; i >= 0; i--) {
    const datapoint = dataSeries[i];
    if (datapoint) {
      let time = datapoint[0];
      let value = datapoint[1];
      if (time > targetTime) {
        afterTimeX2 = time;
        afterValueY2 = value;
      }
    }
  }
  if (beforeTimeX1 && beforeValueY1 && afterTimeX2 && afterValueY2) {
    let slope = (afterValueY2 - beforeValueY1) / (afterTimeX2 - beforeTimeX1);
    extrapolatedValueY = slope * (targetTime - beforeTimeX1) + beforeValueY1;
  }
  return extrapolatedValueY;
}
