import React from 'react';

import MetricValue from 'in-components/MetricValue';

import locals from './KpiMetricValue.mless';

export default function KpiMetricValue({ snapshotId, metric, formatter }) {
  return <MetricValue className={locals.value} snapshotId={snapshotId} metric={metric} formatter={formatter} />;
}
