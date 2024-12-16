/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

export function calculateMetricMap(metrics, extrapolateMissing = false) {
  const metricMap = {};
  for (let iMetric = 0; iMetric < metrics.length; iMetric++) {
    const dataSeries = metrics[iMetric];
    const previousValues = Object.entries(metricMap).flatMap(entry => [entry]);
    for (let i = 0; i < dataSeries.length; i++) {
      const dataPoint = dataSeries[i];
      if (!dataPoint) {
        continue;
      }
      let metricMapElement = metricMap[dataPoint[0]];
      if (iMetric > 0 && metricMapElement === undefined && extrapolateMissing) {
        metricMapElement = findClosestValue(dataPoint[0], previousValues);
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

function findClosestValue(timestamp, dataSeries) {
  const sortedDataSeries = dataSeries.sort((t1, t2) => +t1[0] - +t2[0]);
  let timestampIdxBefore = 0;
  let timestampIdxAfter = sortedDataSeries.length - 1;

  //binary search for closest timestamp index
  while (timestampIdxBefore <= timestampIdxAfter) {
    const mid = Math.floor((timestampIdxBefore + timestampIdxAfter) / 2);
    if (sortedDataSeries[mid][0] === timestamp) {
      return sortedDataSeries[mid][1];
    } else if (sortedDataSeries[mid][0] < timestamp) {
      timestampIdxBefore = mid + 1;
    } else {
      timestampIdxAfter = mid - 1;
    }
  }

  const datapointBefore = sortedDataSeries[timestampIdxBefore] ?? sortedDataSeries[timestampIdxAfter - 1];
  const datapointAfter = sortedDataSeries[timestampIdxAfter] ?? sortedDataSeries[timestampIdxBefore + 1];

  if (!datapointBefore || !datapointAfter) {
    return null;
  }

  // (difference in value /  difference in time)
  const slope = (datapointAfter[1] - datapointBefore[1]) / (datapointAfter[0] - datapointBefore[0]);
  return slope * (timestamp - datapointBefore[0]) + datapointBefore[1];
}
