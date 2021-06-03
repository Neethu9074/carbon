/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import { KpiKeyValue, KpiSection } from 'in-sdk/components/dashboard/KpiSection';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { bytes } from 'in-services/formatters/number';
import MetricValue from 'in-components/MetricValue';
import { t } from 'in-i18n';

export default function IbmCloudContainerRegistryDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');

  return (
    <div>
      <KpiSection>
        <KpiKeyValue label={t('in-forge:plugins.ibmCloudContainerRegistry.pullTraffic')}>
          <MetricValue snapshotId={snapshotId} metric="pull_traffic" formatter={bytes.detailed} />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.ibmCloudContainerRegistry.pullTrafficQuota')}>
          <MetricValue snapshotId={snapshotId} metric="pull_traffic_quota" formatter={bytes.detailed} />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.ibmCloudContainerRegistry.storage')}>
          <MetricValue snapshotId={snapshotId} metric="storage" formatter={bytes.detailed} />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.ibmCloudContainerRegistry.storageQuota')}>
          <MetricValue snapshotId={snapshotId} metric="storage_quota" formatter={bytes.detailed} />
        </KpiKeyValue>
      </KpiSection>
      <DashboardSection title={t('in-forge:plugins.ibmCloudContainerRegistry.titlePullTraffic')}>
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            formatter: bytes.detailed,
            metrics: ['pull_traffic_quota', 'pull_traffic'],
            labels: [
              t('in-forge:plugins.ibmCloudContainerRegistry.pullTrafficQuota'),
              t('in-forge:plugins.ibmCloudContainerRegistry.pullTraffic')
            ],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.ibmCloudContainerRegistry.titleStorage')}>
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            formatter: bytes.detailed,
            metrics: ['storage_quota', 'storage'],
            labels: [
              t('in-forge:plugins.ibmCloudContainerRegistry.storageQuota'),
              t('in-forge:plugins.ibmCloudContainerRegistry.storage')
            ],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
    </div>
  );
}
