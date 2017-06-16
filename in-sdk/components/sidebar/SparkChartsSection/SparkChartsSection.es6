import React from 'react';

import LabeledSparkChart from 'in-sdk/components/sidebar/LabeledSparkChart';

import './SparkChartsSection.less';

const block = 'in-spark-chart-section';

export default function SparkChartsSection({ snapshot, metrics }) {
  return (
    <div className={block}>
      {metrics.map(metric =>
        <LabeledSparkChart
          key={metric.metric}
          snapshotId={snapshot.get('id')}
          metric={metric.metric}
          label={metric.label}
          formatter={metric.formatter}
        />
      )}
    </div>
  );
}
