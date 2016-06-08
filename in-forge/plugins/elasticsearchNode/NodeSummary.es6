import React from 'react';

import {KpiSummary, KpiHeading, KpiKeyValue} from 'in-components/KpiSummary';
import MetricValue from 'in-components/MetricValue';
import {
  withSiPrefixZeroDecimalPlaces,
  withSiPrefixThreeDecimalPlaces
} from 'in-services/formatters/number';

export default function NodeSummary({snapshot}) {
  const snapshotId = snapshot.get('id');

  return (
    <KpiSummary>
      <KpiHeading>{snapshot.getIn(['data', 'node.name'])}</KpiHeading>

      <KpiKeyValue label='Indices'>
        <MetricValue snapshotId={snapshotId}
                     metric='indices_count'
                     formatter={withSiPrefixZeroDecimalPlaces} />
      </KpiKeyValue>

      <KpiKeyValue label='Active Shards'>
        <MetricValue snapshotId={snapshotId}
                     metric='shards.node_active_shards'
                     formatter={withSiPrefixZeroDecimalPlaces} />
      </KpiKeyValue>

      <KpiKeyValue label='Documents'>
        <MetricValue snapshotId={snapshotId}
                     metric='indices.document_count'
                     formatter={withSiPrefixThreeDecimalPlaces} />
      </KpiKeyValue>

      <KpiKeyValue label='Size of Store'>
        <MetricValue snapshotId={snapshotId}
                     metric='indices.store_size'
                     formatter={withSiPrefixThreeDecimalPlaces} />
      </KpiKeyValue>
    </KpiSummary>
  );
}
