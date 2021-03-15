/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { number } from 'in-services/formatters/number';
import MetricValue from 'in-components/MetricValue';
import { t } from 'in-i18n';

export default function IbmDataPowerQueueManagerDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');
  return (
    <div>
      <KpiSection>
        <KpiKeyValue label={t('in-forge:plugins.ibmDataPowerQueueManager.backendActiveConnections')}>
          <MetricValue snapshotId={snapshotId} metric="backendActiveConnections" formatter={number.compact} />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.ibmDataPowerQueueManager.frontendActiveConnections')}>
          <MetricValue snapshotId={snapshotId} metric="frontendActiveConnections" formatter={number.compact} />
        </KpiKeyValue>
      </KpiSection>
      <DashboardSection title={t('in-forge:plugins.ibmDataPowerQueueManager.activeConnections')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            formatter: number.compact,
            tooltipFormatter: number.compact,
            metrics: ['backendActiveConnections', 'frontendActiveConnections'],
            labels: [
              t('in-forge:plugins.ibmDataPowerQueueManager.backendActiveConnections'),
              t('in-forge:plugins.ibmDataPowerQueueManager.frontendActiveConnections')
            ],
            type: 'line'
          }}
        />
      </DashboardSection>
    </div>
  );
}
