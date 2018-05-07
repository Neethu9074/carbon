import React from 'react';

import HistoricMetricSparkChart from 'in-charts/SparkChart';
import { timeConfig$ } from 'in-stores/timeline';
import connectTo from 'in-hoc/connectTo';

import './SparkChartWithValue.less';

const block = 'in-table-spark-chart';
const valueElement = `${block}__value`;

export default connectTo({ timeConfig: timeConfig$ }, function SparkChartWithValue({
  timeConfig,
  value,
  formatter,
  snapshotId,
  metric,
  aggregation
}) {
  if (!timeConfig) {
    return null;
  }

  return (
    <div className={block}>
      <HistoricMetricSparkChart
        timeConfig={timeConfig}
        snapshotId={snapshotId}
        metric={metric}
        tooltipFormatter={formatter}
        aggregation={aggregation}
      />

      <span className={valueElement}>{value != null ? formatter(value) : null}</span>
    </div>
  );
});
