import React from 'react';

import VerticalAxis from 'in-new-components/Axis/VerticalAxis';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  props => ({
    scale: props.chart.config.signals
      .on('filteredDataSeriesChanged')
      .map(filteredDataSeries => getAxisScale(props.axis, filteredDataSeries))
  }),
  function MetricAwareAxis({ scale, axis, height, align }) {
    return <VerticalAxis formatter={axis.formatter[0]} scale={scale} align={align} height={height} />;
  }
);

function getAxisScale(axis, filteredDataSeries) {
  const scale = { from: 0 };

  let maxValue = 0;

  const metrics = axis.metrics || [];
  for (let iMetric = 0; iMetric < metrics.length; iMetric++) {
    const isIgnoredIndex = filteredDataSeries.has(axis.labels[iMetric]);
    if (isIgnoredIndex) {
      continue;
    }
    const minMax = getMinMaxValueForDataSeries(metrics[iMetric]);

    if (axis.valuesNeedToBeStacked) {
      maxValue += Math.max(0, minMax.maxValue - maxValue);
    } else {
      maxValue = Math.max(maxValue, minMax.maxValue);
    }
  }

  scale.to = maxValue;
  return scale;
}

function getMinMaxValueForDataSeries(dataSeries) {
  let minValue = Number.MAX_VALUE;
  let maxValue = 0;
  for (let i = 0; i < dataSeries.length; i++) {
    const dataPoint = dataSeries[i];
    maxValue = Math.max(maxValue, dataPoint[1]);
    minValue = Math.min(minValue, dataPoint[1]);
  }
  return { minValue, maxValue };
}
