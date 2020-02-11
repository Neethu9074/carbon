import React from 'react';

import KeyValue, { themes } from 'in-new-components/KeyValue/KeyValue';
import MetricValue from 'in-components/MetricValue';

import locals from './KpiChart.mless';

export default function KpiChart({ snapshotId, label, metric, formatter }) {
  return (
    <KeyValue
      className={locals.chart}
      label={label}
      value={<MetricValue className={locals.value} snapshotId={snapshotId} metric={metric} formatter={formatter} />}
      theme={themes.blue}
      accentuated
    />
  );
}
