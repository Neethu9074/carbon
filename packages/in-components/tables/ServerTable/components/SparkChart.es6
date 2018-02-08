import React from 'react';

import SparkChart from 'in-components/SparkChart';

export default function TableSparkChart(props) {
  const { metric, tooltipFormatter } = props;
  let aggregationContent = '';
  if (typeof metric === 'number') {
    aggregationContent = tooltipFormatter(metric);
  } else if (metric instanceof Array && metric.length === 1 && metric[0].length === 2) {
    aggregationContent = tooltipFormatter(metric[0][1]);
  }

  return (
    <div>
      <SparkChart {...props} />
      <span>{aggregationContent}</span>
    </div>
  );
}
