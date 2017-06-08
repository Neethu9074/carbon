import React from 'react';

import PageResourcesAndConnections from 'in-forge/plugins/browserLogicalService/Dashboard/PageResourcesAndConnections';
import { KpiSection, KpiHeading, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import EndpointsTable from 'in-forge/plugins/browserLogicalService/Dashboard/EndpointsTable';
import { msTwoDecimalPlaces, zeroDecimalPlaces } from 'in-services/formatters/number';
import ErrorTable from 'in-forge/plugins/browserLogicalService/Dashboard/ErrorTable';
import PageCharts from 'in-forge/plugins/browserLogicalService/Dashboard/PageCharts';
import TimeWindowSizeLabel from 'in-components/TimeWindowSizeLabel';
import MetricValue from 'in-components/MetricValue';
import { getLabel } from 'in-sdk/snapshot';

export default function DefaultLogicalServiceDashboard({ snapshot, timeframe }) {
  const snapshotId = snapshot.get('id');
  return (
    <div>
      <KpiSection>
        <KpiHeading>
          {getLabel(snapshot)}
        </KpiHeading>
        <KpiKeyValue label="calls/s">
          <MetricValue snapshotId={snapshotId} metric="count" formatter={zeroDecimalPlaces} />
        </KpiKeyValue>
        <KpiKeyValue label={<TimeWindowSizeLabel prefix="calls in " />}>
          <MetricValue
            snapshotId={snapshotId}
            formatter={zeroDecimalPlaces}
            metric="count"
            timeWindowAggregation="adjustedCount"
          />
        </KpiKeyValue>
        <KpiKeyValue label="time to page load (95th)">
          <MetricValue snapshotId={snapshotId} metric="duration.95th" formatter={msTwoDecimalPlaces} />
        </KpiKeyValue>
        <KpiKeyValue label={<TimeWindowSizeLabel prefix="avg. time to page load in " />}>
          <MetricValue
            snapshotId={snapshotId}
            metric="duration.95th"
            formatter={msTwoDecimalPlaces}
            timeWindowAggregation="mean"
          />
        </KpiKeyValue>
        <KpiKeyValue label="time to first paint (95th)">
          <MetricValue snapshotId={snapshotId} metric="fp" formatter={msTwoDecimalPlaces} />
        </KpiKeyValue>
        <KpiKeyValue label={<TimeWindowSizeLabel prefix="avg. time to first paint in " />}>
          <MetricValue
            snapshotId={snapshotId}
            metric="fp"
            formatter={msTwoDecimalPlaces}
            timeWindowAggregation="mean"
          />
        </KpiKeyValue>
      </KpiSection>

      <PageCharts snapshotId={snapshotId} timeframe={timeframe} />
      <EndpointsTable snapshot={snapshot} timeframe={timeframe} />
      <PageResourcesAndConnections snapshotId={snapshotId} timeframe={timeframe} />
      <ErrorTable snapshotId={snapshotId} timeframe={timeframe} />
    </div>
  );
}
