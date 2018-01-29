import React from 'react';

import HistoricMetricSparkChart from 'in-charts/SparkChart';
import { timeframe$ } from 'in-stores/timeline';
import connectTo from 'in-hoc/connectTo';

import './SparkChartWithValue.less';

const block = 'in-table-spark-chart';
const valueElement = `${block}__value`;

export default connectTo({ timeframe: timeframe$ }, function SparkChartWithValue({
  timeframe,
  value,
  formatter,
  snapshotId,
  metric,
  aggregation
}) {
  if (!timeframe) {
    return null;
  }

  return (
    <div className={block}>
      <HistoricMetricSparkChart
        timeframe={timeframe}
        snapshotId={snapshotId}
        metric={metric}
        tooltipFormatter={formatter}
        aggregation={aggregation}
      />

      <span className={valueElement}>{value != null ? formatter(value) : null}</span>
    </div>
  );
});
