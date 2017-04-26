import React from 'react';

import { withSiPrefixZeroDecimalPlaces, withSiPrefixThreeDecimalPlaces } from 'in-services/formatters/number';
import { KpiSection, KpiHeading, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import MetricValue from 'in-components/MetricValue';

export default function NodeSummary({ snapshot }) {
  const snapshotId = snapshot.get('id');

  return (
    <KpiSection>
      <KpiHeading>{snapshot.getIn(['data', 'node.name'])}</KpiHeading>

      <KpiKeyValue label="Indices">
        <MetricValue snapshotId={snapshotId} metric="indices_count" formatter={withSiPrefixZeroDecimalPlaces} />
      </KpiKeyValue>

      <KpiKeyValue label="Active Shards">
        <MetricValue
          snapshotId={snapshotId}
          metric="shards.node_active_shards"
          formatter={withSiPrefixZeroDecimalPlaces}
        />
      </KpiKeyValue>

      <KpiKeyValue label="Documents">
        <MetricValue
          snapshotId={snapshotId}
          metric="indices.document_count"
          formatter={withSiPrefixThreeDecimalPlaces}
        />
      </KpiKeyValue>

      <KpiKeyValue label="Store Size">
        <MetricValue snapshotId={snapshotId} metric="indices.store_size" formatter={withSiPrefixThreeDecimalPlaces} />
      </KpiKeyValue>
    </KpiSection>
  );
}
