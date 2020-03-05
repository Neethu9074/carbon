import React from 'react';

import { valueMissingPlaceholder } from 'in-new-components/valueMissingPlaceholder';
import SparkChart from 'in-components/SparkChart';

export default function TableSparkChart(props) {
  const {
    timeConfig,
    metric,
    metrics,
    tooltipFormatter,
    label,
    customValueTooltip,
    showDashOnMissingOrNullMetric
  } = props;
  let aggregationContent = '';

  const aggregatedValueIsNull = metric && metric[0][1] === 0;
  if (showDashOnMissingOrNullMetric && aggregatedValueIsNull) {
    aggregationContent = valueMissingPlaceholder;
  } else if (typeof metric === 'number') {
    aggregationContent = tooltipFormatter(metric);
  } else if (metric instanceof Array && metric.length === 1 && metric[0].length === 2) {
    aggregationContent = tooltipFormatter(metric[0][1]);
  }
  const loading = !timeConfig || (!metrics && metric == null);

  return (
    <SparkChart
      {...props}
      loading={loading}
      horizontalMetricValue={aggregationContent}
      customValueTooltip={customValueTooltip}
      label={label}
    />
  );
}
