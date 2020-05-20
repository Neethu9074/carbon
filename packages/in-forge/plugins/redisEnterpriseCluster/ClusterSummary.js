import React from 'react';

import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import { hitRateZeroDecimalPlaces } from 'in-services/formatters/number';
import MetricValue from 'in-components/MetricValue';

export default function RedisClusterSummary({ snapshot }) {
  const snapshotId = snapshot.get('id');

  return (
    <KpiSection>
      <KpiKeyValue label="Keys Hit Rate">
        <MetricValue snapshotId={snapshotId} metric="key_hits" formatter={hitRateZeroDecimalPlaces} />
      </KpiKeyValue>
      <KpiKeyValue label="Evicted Objects">
        <MetricValue snapshotId={snapshotId} metric="evicted_objects" />
      </KpiKeyValue>
      <KpiKeyValue label="Connections">
        <MetricValue snapshotId={snapshotId} metric="conns" />
      </KpiKeyValue>
    </KpiSection>
  );
}
