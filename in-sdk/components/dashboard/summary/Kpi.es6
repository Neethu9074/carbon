import React from 'react';

import MetricValue from 'in-components/MetricValue';

import './Kpi.less';

const block = 'in-dash-sum-kpi';

export default function Kpi({ snapshotId, timeframe, metric, timeWindowAggregation, formatter, label }) {
  return (
    <div className={block}>
      <span className={`${block}__label`}>
        {label}
      </span>
      <MetricValue
        snapshotId={snapshotId}
        metric={metric}
        timeframe={timeframe}
        timeWindowAggregation={timeWindowAggregation}
        formatter={formatter}
        className={`${block}__value`}
      />
    </div>
  );
}
