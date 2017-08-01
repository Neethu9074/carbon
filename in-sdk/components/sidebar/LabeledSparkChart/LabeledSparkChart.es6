import React from 'react';

import HistoricMetricSparkChart from 'in-charts/SparkChart/HistoricMetricSparkChart';
import MetricValue from 'in-components/MetricValue';
import { timeframe$ } from 'in-stores/timeline';
import connectTo from 'in-hoc/connectTo';

import './LabeledSparkChart.less';

const block = 'in-labeled-spark-chart';

export default connectTo(
  {
    timeframe: timeframe$
  },
  function LabeledSparkChart({ snapshotId, timeframe, metric, className, design }) {
    const { label, formatter, aggregation, timeWindowAggregation } = metric;
    const metricName = metric.metric;

    let classes = block;
    if (className) {
      classes = `${classes} ${className}`;
    }
    return (
      <div className={classes}>
        <HistoricMetricSparkChart
          width={115}
          height={30}
          timeframe={timeframe}
          snapshotId={snapshotId}
          design={design ? design : 'light'}
          metric={metricName}
          tooltipFormatter={formatter.detailed}
          aggregation={aggregation}
        />
        <div className={block + '__description'}>
          <span className={block + '__title'}>
            {label}
          </span>
          <MetricValue
            snapshotId={snapshotId}
            metric={metricName}
            className={block + '__value'}
            formatter={formatter.compact}
            optionalTimeWindowAggregation={timeWindowAggregation}
          />
        </div>
      </div>
    );
  }
);
