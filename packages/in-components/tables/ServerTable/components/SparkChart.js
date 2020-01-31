import React from 'react';

import SparkChart from 'in-components/SparkChart';

export default function TableSparkChart(props) {
  const {
    timeConfig,
    metric,
    metrics,
    tooltipFormatter,
    label,
    companionMetric,
    companionMetricLabel,
    companionMetricFormatter
  } = props;
  let aggregationContent = '';
  let aggregationCompanionContent = '';

  if (typeof metric === 'number') {
    aggregationContent = tooltipFormatter(metric);
  } else if (metric instanceof Array && metric.length === 1 && metric[0].length === 2) {
    aggregationContent = tooltipFormatter(metric[0][1]);
  }

  if (companionMetric && typeof companionMetric === 'number') {
    aggregationCompanionContent = companionMetricFormatter(companionMetric);
  } else if (companionMetric instanceof Array && companionMetric.length === 1 && companionMetric[0].length === 2) {
    aggregationCompanionContent = companionMetricFormatter(companionMetric[0][1]);
  }

  const loading = !timeConfig || (!metrics && !metric);
  return (
    <SparkChart
      {...props}
      loading={loading}
      horizontalMetricValue={aggregationContent}
      companionMetricTooltip={companionMetric ? `${companionMetricLabel} ${aggregationCompanionContent}` : null}
      label={label}
    />
  );
}
