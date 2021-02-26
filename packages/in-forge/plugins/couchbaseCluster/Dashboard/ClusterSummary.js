/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import React from 'react';

import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import { bytes, number } from 'in-services/formatters/number';
import MetricValue from 'in-components/MetricValue';

export default function ClusterSummary({ snapshot }) {
  const snapshotId = snapshot.get('id');

  return (
    <KpiSection>
      <KpiKeyValue label={t('in-forge:plugins.couchbaseCluster.dashboard.labelNodes')}>
        {snapshot.getIn(['data', 'cluster.nodeCount'])}
      </KpiKeyValue>

      <KpiKeyValue label={t('in-forge:plugins.couchbaseCluster.dashboard.labelBuckets')}>
        {snapshot.getIn(['data', 'cluster.bucketCount'])}
      </KpiKeyValue>

      <KpiKeyValue label={t('in-forge:plugins.couchbaseCluster.dashboard.labelUsedMemory')}>
        <MetricValue snapshotId={snapshotId} metric="cluster.usedMemory" formatter={bytes.detailed} />
        {' / '}
        <MetricValue snapshotId={snapshotId} metric="cluster.memoryQuota" formatter={bytes.detailed} />
      </KpiKeyValue>

      <KpiKeyValue label={t('in-forge:plugins.couchbaseCluster.dashboard.labelUsedDisk')}>
        <MetricValue snapshotId={snapshotId} metric="cluster.usedDisk" formatter={bytes.detailed} />
      </KpiKeyValue>

      <KpiKeyValue label={t('in-forge:plugins.couchbaseCluster.dashboard.labelItems')}>
        <MetricValue snapshotId={snapshotId} metric="cluster.curr_items" formatter={number.compact} />
      </KpiKeyValue>
    </KpiSection>
  );
}
