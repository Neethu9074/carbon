import React from 'react';

import SparkChart from 'in-components/SparkChart';

export default function TableSparkChart(props) {
  const { timeConfig, metric, metrics, tooltipFormatter } = props;
  let aggregationContent = '';
  if (typeof metric === 'number') {
    aggregationContent = tooltipFormatter(metric);
  } else if (metric instanceof Array && metric.length === 1 && metric[0].length === 2) {
    aggregationContent = tooltipFormatter(metric[0][1]);
  }

  const loading = !timeConfig || (!metrics && !metric);
  return <SparkChart {...props} loading={loading} horizontalMetricValue={aggregationContent} />;
}
