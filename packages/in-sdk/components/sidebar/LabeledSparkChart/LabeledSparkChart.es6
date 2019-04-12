import React from 'react';

import HistoricMetricSparkChart from 'in-charts/SparkChart';
import MetricValue from 'in-components/MetricValue';
import { timeConfig$ } from 'in-stores/timeline';
import connectTo from 'in-hoc/connectTo';

import './LabeledSparkChart.less';

const block = 'in-labeled-spark-chart';

export default connectTo(
  {
    timeConfig: timeConfig$
  },
  function LabeledSparkChart({ snapshotId, timeConfig, metric, theme = 'light', className }) {
    const { label, formatter, aggregation } = metric;
    const metricName = metric.metric;

    let classes = `${block} ${block}__${theme}`;
    if (className) {
      classes = `${classes} ${className}`;
    }
    return (
      <div className={classes}>
        <HistoricMetricSparkChart
          width={140}
          theme={theme}
          timeConfig={timeConfig}
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
