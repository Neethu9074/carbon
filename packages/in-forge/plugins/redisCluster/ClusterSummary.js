/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import { hitRateZeroDecimalPlaces, number } from 'in-services/formatters/number';
import MetricValue from 'in-components/MetricValue';
import { t } from 'in-i18n';

export default function RedisClusterSummary({ snapshot }) {
  const snapshotId = snapshot.get('id');
  return (
    <KpiSection>
      <KpiKeyValue label={t('in-forge:plugins.redisCluster.throughput')}>
        <MetricValue snapshotId={snapshotId} metric="throughput" formatter={number.compact} />
      </KpiKeyValue>
      <KpiKeyValue label={t('in-forge:plugins.redisCluster.hitRateKpiLabel')}>
        <MetricValue snapshotId={snapshotId} metric="hit_rate" formatter={hitRateZeroDecimalPlaces} />
      </KpiKeyValue>
      <KpiKeyValue label={t('in-forge:plugins.redisCluster.keysEvicted')}>
        <MetricValue snapshotId={snapshotId} metric="evicted_keys" />
      </KpiKeyValue>
      <KpiKeyValue label={t('in-forge:plugins.redisCluster.connections')}>
        <MetricValue snapshotId={snapshotId} metric="connected_clients" />
      </KpiKeyValue>
    </KpiSection>
  );
}
