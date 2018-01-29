import React from 'react';

import HistoricMetricSparkChart from 'in-charts/SparkChart';
import MetricValue from 'in-components/MetricValue';
import { timeframe$ } from 'in-stores/timeline';
import connectTo from 'in-hoc/connectTo';

import './LabeledSparkChart.less';

const block = 'in-labeled-spark-chart';

export default connectTo(
  {
    timeframe: timeframe$
  },
  function LabeledSparkChart({ snapshotId, timeframe, metric, className }) {
    const { label, formatter, aggregation } = metric;
    const metricName = metric.metric;

    let classes = block;
    if (className) {
      classes = `${classes} ${className}`;
    }
    return (
      <div className={classes}>
        <HistoricMetricSparkChart
          timeframe={timeframe}
          snapshotId={snapshotId}
          metric={metricName}
          tooltipFormatter={formatter.detailed}
          aggregation={aggregation}
        />
        <div className={block + '__description'}>
          <span className={block + '__title'}>{label}</span>
          <MetricValue
            snapshotId={snapshotId}
            metric={metricName}
            className={block + '__value'}
            formatter={formatter.compact}
            timeWindowAggregation={aggregation}
          />
        </div>
      </div>
    );
  }
);
