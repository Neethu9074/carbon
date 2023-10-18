/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

// @ts-expect-error Module needs to be translated to TS
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
// @ts-expect-error Module needs to be translated to TS
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import { SnapshotData } from 'in-stores/snapshot/snapshot';
import { number } from 'in-services/formatters/number';
import { TimeConfig } from 'in-types';
import { t } from 'in-i18n';

export default function ActiveSessions({ snapshot, timeConfig }: { snapshot: SnapshotData; timeConfig: TimeConfig }) {
  const snapshotId = snapshot.get('id');
  return (
    <DashboardSection title={t('in-forge:plugins.oracleDB.activeSessions')}>
      <Chart
        snapshotId={snapshotId}
        timeConfig={timeConfig}
        y1={{
          formatter: number.detailed,
          metrics: ['stats.activeSessionsCount'],
          labels: [t('in-forge:plugins.oracleDB.count')],
          type: 'area'
        }}
        renderPostChartContent={PluginDashboardsMarkerLanes}
      />
    </DashboardSection>
  );
}
