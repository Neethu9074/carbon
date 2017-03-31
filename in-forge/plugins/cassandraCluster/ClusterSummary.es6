import React from 'react';

import { KpiSection, KpiHeading, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import MetricValue from 'in-components/MetricValue';

import { withSiPrefixZeroDecimalPlaces, bytesTwoDecimalPlaces } from 'in-services/formatters/number';

export default function ClusterSummary({ snapshot }) {
  const snapshotId = snapshot.get('id');
  const data = snapshot.get('data');
  return (
    <KpiSection>
      <KpiHeading>{data.get('groupId')}</KpiHeading>
      <KpiKeyValue label="Nodes">
        <MetricValue snapshotId={snapshotId} metric="nodeCount" formatter={withSiPrefixZeroDecimalPlaces} />
      </KpiKeyValue>
      <KpiKeyValue label="Keyspaces">
        <MetricValue snapshotId={snapshotId} metric="keyspaceCount" formatter={withSiPrefixZeroDecimalPlaces} />
      </KpiKeyValue>
      <KpiKeyValue label="Store Size">
        <MetricValue snapshotId={snapshotId} metric="overallDiskSize" formatter={bytesTwoDecimalPlaces} />
      </KpiKeyValue>
    </KpiSection>
  );
}
