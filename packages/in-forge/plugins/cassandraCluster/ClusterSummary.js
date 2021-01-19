/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import MetricValue from 'in-components/MetricValue';
import { number } from 'in-services/formatters/number';

import { withSiPrefixZeroDecimalPlaces, bytesTwoDecimalPlaces } from 'in-services/formatters/number';

export default function ClusterSummary({ snapshot }) {
  const snapshotId = snapshot.get('id');
  return (
    <KpiSection>
      <KpiKeyValue label="Available Nodes">
        <MetricValue snapshotId={snapshotId} metric="nodeCount" formatter={number.compact} />
      </KpiKeyValue>
      <KpiKeyValue label="Unreachable Nodes">
        <MetricValue snapshotId={snapshotId} metric="unreachableNodeCount" formatter={number.compact} />
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
