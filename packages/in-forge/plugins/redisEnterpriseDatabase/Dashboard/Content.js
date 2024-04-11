/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import { number, millis } from 'in-services/formatters/number';
import MetricValue from 'in-components/MetricValue';
import { t } from 'in-i18n';

export default function RedisEnterpriseDatabase({ snapshot }) {
  const snapshotId = snapshot.get('id');

  return (
    <div>
      <KpiSection>
        <KpiKeyValue label={t('in-forge:plugins.redisEnterpriseDatabase.dashboard.totalConnections')}>
          <MetricValue snapshotId={snapshotId} metric="total_connections_received" formatter={number.compact} />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.redisEnterpriseDatabase.dashboard.connections')}>
          <MetricValue snapshotId={snapshotId} metric="conns" formatter={number.compact} />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.redisEnterpriseDatabase.dashboard.latency')}>
          <MetricValue snapshotId={snapshotId} metric="avg_latency" formatter={millis.compact} />
        </KpiKeyValue>
      </KpiSection>
    </div>
  );
}
