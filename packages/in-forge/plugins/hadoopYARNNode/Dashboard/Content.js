/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { zeroDecimalPlaces, bytes } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default function Dashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');
  return (
    <div>
      <DashboardSection title={t('in-forge:plugins.hadoopYARNNode.dashboard.containers')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['runningContainers', 'failedContainers'],
            labels: [
              t('in-forge:plugins.hadoopYARNNode.dashboard.runningContainers'),
              t('in-forge:plugins.hadoopYARNNode.dashboard.failedContainers')
            ],
            formatter: zeroDecimalPlaces,
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.hadoopYARNNode.dashboard.memory')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['allocatedMem', 'availableMem'],
            labels: [
              t('in-forge:plugins.hadoopYARNNode.dashboard.allocatedMemory'),
              t('in-forge:plugins.hadoopYARNNode.dashboard.availableMemory')
            ],
            formatter: bytes.compact,
            tooltipFormatter: bytes.detailed,
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.hadoopYARNNode.dashboard.virtualCores')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['allocatedVCores', 'availableVCores'],
            labels: [
              t('in-forge:plugins.hadoopYARNNode.dashboard.allocatedVirtualCores'),
              t('in-forge:plugins.hadoopYARNNode.dashboard.availableVirtualCores')
            ],
            formatter: zeroDecimalPlaces,
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
    </div>
  );
}
