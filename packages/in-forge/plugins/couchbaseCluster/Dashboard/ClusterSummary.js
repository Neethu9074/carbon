/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { bytes, number } from 'in-services/formatters/number';
import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import MetricValue from 'in-components/MetricValue';

export default function ClusterSummary({ snapshot }) {
  const snapshotId = snapshot.get('id');

  return (
    <KpiSection>
      <KpiKeyValue label="Nodes">{snapshot.getIn(['data', 'cluster.nodeCount'])}</KpiKeyValue>

      <KpiKeyValue label="Buckets">{snapshot.getIn(['data', 'cluster.bucketCount'])}</KpiKeyValue>

      <KpiKeyValue label="Used Memory / Total Quota">
        <MetricValue snapshotId={snapshotId} metric="cluster.usedMemory" formatter={bytes.detailed} />
        {' / '}
        <MetricValue snapshotId={snapshotId} metric="cluster.memoryQuota" formatter={bytes.detailed} />
      </KpiKeyValue>

      <KpiKeyValue label="Used Disk">
        <MetricValue snapshotId={snapshotId} metric="cluster.usedDisk" formatter={bytes.detailed} />
      </KpiKeyValue>

      <KpiKeyValue label="Items">
        <MetricValue snapshotId={snapshotId} metric="cluster.curr_items" formatter={number.compact} />
      </KpiKeyValue>
    </KpiSection>
  );
}
