/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import { withSiPrefixZeroDecimalPlaces, bytes } from 'in-services/formatters/number';
import MetricValue from 'in-components/MetricValue';

export default function ESClusterSummary({ snapshot }) {
  const snapshotId = snapshot.get('id');

  return (
    <KpiSection>
      <KpiKeyValue label="Nodes">
        <MetricValue snapshotId={snapshotId} metric="nodes" formatter={withSiPrefixZeroDecimalPlaces} />
      </KpiKeyValue>

      <KpiKeyValue label="Documents">
        <MetricValue snapshotId={snapshotId} metric="searchable_documents" formatter={withSiPrefixZeroDecimalPlaces} />
      </KpiKeyValue>

      <KpiKeyValue label="Free storage space">
        <MetricValue snapshotId={snapshotId} metric="free_storage_space" formatter={bytes.detailed} />
      </KpiKeyValue>
    </KpiSection>
  );
}
