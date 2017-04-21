import React from 'react';

import HistoricMetricSparkChart from 'in-charts/SparkChart/HistoricMetricSparkChart';
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
  metric
}) {
  if (!timeframe) {
    return null;
  }

  return (
    <div className={block}>
      <HistoricMetricSparkChart
        width={100}
        height={30}
        timeframe={timeframe}
        snapshotId={snapshotId}
        metric={metric}
        tooltipFormatter={formatter}
      />

      <span className={valueElement}>{value}</span>
    </div>
  );
});
