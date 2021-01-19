/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { withSiPrefixZeroDecimalPlaces, number, bytes } from 'in-services/formatters/number';
import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import MetricValue from 'in-components/MetricValue';

export default function ClusterSummary({ snapshot }) {
  const snapshotId = snapshot.get('id');

  return (
    <KpiSection>
      <KpiKeyValue label="Nodes">
        <MetricValue snapshotId={snapshotId} metric="nodeCount" formatter={number.compact} />
      </KpiKeyValue>
      <KpiKeyValue label="Total Rows">
        <MetricValue snapshotId={snapshotId} metric="rows" formatter={withSiPrefixZeroDecimalPlaces} />
      </KpiKeyValue>
      <KpiKeyValue label="Total Disk Usage">
        <MetricValue snapshotId={snapshotId} metric="bytes_on_disk" formatter={bytes.detailed} />
      </KpiKeyValue>
    </KpiSection>
  );
}
