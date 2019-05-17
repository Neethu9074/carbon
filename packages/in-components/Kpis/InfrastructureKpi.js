import React from 'react';

import MetricValue from 'in-components/MetricValue';

import locals from './Kpis.mless';

/**

 DEFAULT USAGE:
 <InfrastructureKpi
      label="some label"
      snapshotId={snapshotId}
      formatter={bytesZeroDecimalPlaces}
      timeWindowAggregation="mean"
      metric={'totalDbSize'}
 />

 */
export default function InfrastructureKpi({ label, snapshotId, metric, formatter, timeWindowAggregation }) {
  return (
    <div className={locals.kpi}>
      <div className={locals.metric}>
        <MetricValue
          snapshotId={snapshotId}
          metric={metric}
          formatter={formatter}
          timeWindowAggregation={timeWindowAggregation}
        />
      </div>
      <div>{label}</div>
    </div>
  );
}
