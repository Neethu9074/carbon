/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

// @ts-expect-error Module needs to be translated to TS
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { megaBytes, percentagePlain } from 'in-services/formatters/number';
import { SnapshotData } from 'in-stores/snapshot/snapshot';
import { TimeConfig } from 'in-types';
import { t } from 'in-i18n';

export default function DiskUsageChart({ snapshot, timeConfig }: { snapshot: SnapshotData; timeConfig: TimeConfig }) {
  const snapshotId = snapshot.get('id');
  return (
    <DashboardSection title={t('in-forge:plugins.maprNode.diskUsage')}>
      <Chart
        snapshotId={snapshotId}
        timeConfig={timeConfig}
        y1={{
          metrics: ['metrics.disk.diskTotalSpace', 'metrics.disk.diskUsedSpace', 'metrics.disk.diskAvailableSpace'],
          labels: [
            t('in-forge:plugins.maprNode.totalSpace'),
            t('in-forge:plugins.maprNode.usedSpace'),
            t('in-forge:plugins.maprNode.availableSpace')
          ],
          type: 'line',
          formatter: megaBytes.detailed
        }}
        y2={{
          metrics: ['metrics.disk.usedSpacePercent'],
          labels: [t('in-forge:plugins.maprNode.usedSpacePercent')],
          type: 'area',
          formatter: percentagePlain.detailed
        }}
      />
    </DashboardSection>
  );
}
