import React from 'react';

import HistoricMetricSparkChart from 'in-charts/SparkChart/HistoricMetricSparkChart';
import MetricValue from 'in-components/MetricValue';

import './HistoricMetricSparkChartWithLabel.less';

const block = 'in-spark-chart-with-label';

export default function HistoricMetricSparkChartWithLabel({ snapshotId, metric, formatter, design }) {
  return (
    <div className={block}>
      <MetricValue snapshotId={snapshotId} metric={metric} formatter={formatter} className={block + '__value'} />
      <HistoricMetricSparkChart
        {...this.props}
        design={design}
        className={block + '__chart'}
        tooltipFormatter={formatter}
      />
    </div>
  );
}
