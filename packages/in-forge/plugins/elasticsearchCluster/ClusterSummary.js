/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { withSiPrefixZeroDecimalPlaces, withSiPrefixThreeDecimalPlaces } from 'in-services/formatters/number';
import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import MetricValue from 'in-components/MetricValue';

export default function ClusterSummary({ snapshot }) {
  const snapshotId = snapshot.get('id');

  return (
    <KpiSection>
      <KpiKeyValue label="Nodes">
        <MetricValue snapshotId={snapshotId} metric="node_count" formatter={withSiPrefixZeroDecimalPlaces} />
      </KpiKeyValue>

      <KpiKeyValue label="Indices">
        <MetricValue snapshotId={snapshotId} metric="indices_count" formatter={withSiPrefixZeroDecimalPlaces} />
      </KpiKeyValue>

      <KpiKeyValue label="Active Shards">
        <MetricValue snapshotId={snapshotId} metric="active_shards_count" formatter={withSiPrefixZeroDecimalPlaces} />
      </KpiKeyValue>

      <KpiKeyValue label="Documents">
        <MetricValue snapshotId={snapshotId} metric="document_count" formatter={withSiPrefixThreeDecimalPlaces} />
      </KpiKeyValue>

      <KpiKeyValue label="Store Size">
        <MetricValue snapshotId={snapshotId} metric="store_size" formatter={withSiPrefixThreeDecimalPlaces} />
      </KpiKeyValue>
    </KpiSection>
  );
}
