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
import { SnapshotData } from 'in-stores/snapshot/snapshot';
import { percentagePlain } from 'in-services/formatters/number';
import { TimeConfig } from 'in-types';
import { t } from 'in-i18n';

export default function CPUUtilizationChart({ snapshot, timeConfig }: { snapshot: SnapshotData; timeConfig: TimeConfig }) {
  const snapshotId = snapshot.get('id');
  return (
    <DashboardSection title={t('in-forge:plugins.maprNode.cpuUtilization')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['metrics.utilization'],
            labels: [
              t('in-forge:plugins.maprNode.utilization')
            ],
            type: 'line',
            formatter: percentagePlain.compact
          }}
        />
      </DashboardSection>
  );
}
