import React from 'react';

import SparkChart from 'in-components/SparkChart';

import locals from './SparkChart.mless';

export default function TableSparkChart(props) {
  const { metric, tooltipFormatter } = props;
  let aggregationContent = '';
  if (typeof metric === 'number') {
    aggregationContent = tooltipFormatter(metric);
  } else if (metric instanceof Array && metric.length === 1 && metric[0].length === 2) {
    aggregationContent = tooltipFormatter(metric[0][1]);
  }

  return (
    <div className={locals.sparkChart}>
      <SparkChart {...props} />
      <span className={locals.value}>{aggregationContent}</span>
    </div>
  );
}
