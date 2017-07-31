import React from 'react';

import { KpiSection, KpiHeading, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import { msTwoDecimalPlaces, zeroDecimalPlaces } from 'in-services/formatters/number';
import TimeWindowSizeLabel from 'in-components/TimeWindowSizeLabel';
import MetricValue from 'in-components/MetricValue';
import { getLabel } from 'in-sdk/snapshot';

export default function PageResourceLogicalServiceKpis({ snapshot }) {
  const snapshotId = snapshot.get('id');

  return (
    <KpiSection>
      <KpiHeading>
        {getLabel(snapshot)}
      </KpiHeading>
      <KpiKeyValue label={<TimeWindowSizeLabel prefix="requests in " />}>
        <MetricValue snapshotId={snapshotId} formatter={zeroDecimalPlaces} metric="count" timeWindowAggregation="sum" />
      </KpiKeyValue>
      <KpiKeyValue label={<TimeWindowSizeLabel prefix="avg. latency in " />}>
        <MetricValue
          snapshotId={snapshotId}
          formatter={msTwoDecimalPlaces}
          metric="duration.mean"
          timeWindowAggregation="mean"
        />
      </KpiKeyValue>
    </KpiSection>
  );
}
