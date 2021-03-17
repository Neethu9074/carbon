/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { KpiKeyValue, KpiSection } from 'in-sdk/components/dashboard/KpiSection';
import { number, hitRate } from 'in-services/formatters/number';
import MetricValue from 'in-components/MetricValue';
import { t } from 'in-i18n';

export default function ibmcloudLoadBalancerDashboard({ snapshot }) {
  const snapshotId = snapshot.get('id');

  return (
    <div>
      <KpiSection>
        <KpiKeyValue label={t('in-forge:plugins.ibmcloudLoadBalancer.activeConnections')}>
          <MetricValue snapshotId={snapshotId} metric="active_connection" formatter={number.compact} />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.ibmcloudLoadBalancer.connectionRate')}>
          <MetricValue snapshotId={snapshotId} metric="connection_rate" formatter={hitRate.compact} />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.ibmcloudLoadBalancer.throughput')}>
          <MetricValue snapshotId={snapshotId} metric="throughput" formatter={hitRate.compact} />
        </KpiKeyValue>
      </KpiSection>
    </div>
  );
}
