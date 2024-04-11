/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import { number } from 'in-services/formatters/number';
import MetricValue from 'in-components/MetricValue';
import { t } from 'in-i18n';

export default function RedisEnterpriseShard({ snapshot }) {
  const snapshotId = snapshot.get('id');

  return (
    <div>
      <KpiSection>
        <KpiKeyValue label={t('in-forge:plugins.redisEnterpriseShard.dashboard.connectedClients')}>
          <MetricValue snapshotId={snapshotId} metric="connected_clients" formatter={number.compact} />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.redisEnterpriseShard.dashboard.blockedClients')}>
          <MetricValue snapshotId={snapshotId} metric="blocked_clients" formatter={number.compact} />
        </KpiKeyValue>
      </KpiSection>
    </div>
  );
}
