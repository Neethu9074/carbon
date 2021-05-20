/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import PackagesTable from 'in-forge/plugins/ibmCloudFunctions/Dashboard/PackagesTable';
import { KpiKeyValue, KpiSection } from 'in-sdk/components/dashboard/KpiSection';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import Columize from 'in-sdk/components/dashboard/Columize';
import { number } from 'in-services/formatters/number';
import MetricValue from 'in-components/MetricValue';
import { t } from 'in-i18n';

export default function IbmCloudFunctionsDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');

  return (
    <div>
      <KpiSection>
        <KpiKeyValue label={t('in-forge:plugins.ibmCloudFunctions.concurrentInvocations')}>
          <MetricValue snapshotId={snapshotId} metric="concurrent-invocations" formatter={number.compact} />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.ibmCloudFunctions.concurrentRateLimit')}>
          <MetricValue snapshotId={snapshotId} metric="concurrent-rate-limit" formatter={number.compact} />
        </KpiKeyValue>
      </KpiSection>
      <DashboardSection>
        <Columize>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              formatter: number.compact,
              metrics: ['concurrent-invocations'],
              labels: [t('in-forge:plugins.ibmCloudFunctions.concurrentInvocations')],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              formatter: number.compact,
              metrics: ['concurrent-rate-limit'],
              labels: [t('in-forge:plugins.ibmCloudFunctions.concurrentRateLimit')],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </Columize>
      </DashboardSection>

      <PackagesTable snapshot={snapshot} timeConfig={timeConfig} />
    </div>
  );
}
