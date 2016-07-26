import React from 'react';

import SparkChart from 'in-components/SparkChart';

import './SparkChartsSection.less';


const block = 'in-spark-chart-section';


export default function SparkChartsSection({snapshot, metrics}) {
  return (
    <div className={block}>
      {metrics.map(metric =>
        <SparkChart key={metric.metric}
                    snapshotId={snapshot.get('id')}
                    metric={metric.metric}
                    label={metric.label}
                    formatter={metric.formatter} />
      )}
    </div>
  );
}
