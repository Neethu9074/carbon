import React from 'react';

import PageCharts from 'in-forge/plugins/browserLogicalService/Dashboard/new/components/PageCharts';
import { KpiSection, KpiHeading, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import { msTwoDecimalPlaces, zeroDecimalPlaces } from 'in-services/formatters/number';
import DashboardTile from 'in-components/Dashboard/components/DashboardTile';
import TimeWindowSizeLabel from 'in-components/TimeWindowSizeLabel';
import MetricValue from 'in-components/MetricValue';
import { getLabel } from 'in-sdk/snapshot';

export default function Summary({ snapshot, timeframe }) {
  const snapshotId = snapshot.get('id');
  return (
    <div>
      <DashboardTile title="Quick overview">
        <KpiSection>
          <KpiHeading>
            {getLabel(snapshot)}
          </KpiHeading>
          <KpiKeyValue label={<TimeWindowSizeLabel prefix="Views in " />}>
            <MetricValue
              snapshotId={snapshotId}
              formatter={zeroDecimalPlaces}
              metric="count"
              timeWindowAggregation="sum"
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
      </DashboardTile>

      <DashboardTile title="Detailed Charts">
        <PageCharts snapshotId={snapshotId} timeframe={timeframe} />
      </DashboardTile>
    </div>
  );
}
