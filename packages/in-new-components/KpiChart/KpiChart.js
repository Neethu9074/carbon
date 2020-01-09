import React from 'react';

import KpiMetricValue from 'in-new-components/KpiChart/components/KpiMetricValue';
import KpiLabel from 'in-new-components/KpiChart/components/KpiLabel';

import locals from './KpiChart.mless';

export default function KpiChart({ snapshotId, label, metric, formatter }) {
  return (
    <div className={locals.chart}>
      <KpiLabel label={label} />
      <KpiMetricValue snapshotId={snapshotId} metric={metric} formatter={formatter} />
    </div>
  );
}
