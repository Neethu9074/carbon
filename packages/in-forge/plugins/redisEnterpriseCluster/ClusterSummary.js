/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import MetricValue from 'in-components/MetricValue';
import { t } from 'in-i18n';

export default function RedisClusterSummary({ snapshot }) {
  const snapshotId = snapshot.get('id');

  return (
    <KpiSection>
      <KpiKeyValue label={t('in-forge:plugins.redisEnterpriseCluster.keyHits')}>
        <MetricValue snapshotId={snapshotId} metric="key_hits" />
      </KpiKeyValue>
      <KpiKeyValue label={t('in-forge:plugins.redisEnterpriseCluster.evictedObjects')}>
        <MetricValue snapshotId={snapshotId} metric="evicted_objects" />
      </KpiKeyValue>
      <KpiKeyValue label={t('in-forge:plugins.redisEnterpriseCluster.connections')}>
        <MetricValue snapshotId={snapshotId} metric="conns" />
      </KpiKeyValue>
    </KpiSection>
  );
}
