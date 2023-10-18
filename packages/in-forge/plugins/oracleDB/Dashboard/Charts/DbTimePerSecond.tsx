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
import { micros } from 'in-services/formatters/number';
import { TimeConfig } from 'in-types';
import { t } from 'in-i18n';

export default function DbTimePerSecond({ snapshot, timeConfig }: { snapshot: SnapshotData; timeConfig: TimeConfig }) {
  const snapshotId = snapshot.get('id');
  return (
    <DashboardSection title={t('in-forge:plugins.oracleDB.dbTimePerSecond')}>
      <Chart
        snapshotId={snapshotId}
        timeConfig={timeConfig}
        y1={{
          formatter: micros.detailed,
          metrics: ['stats.dbTime', 'stats.cpuTime', 'stats.sqlExecuteTime', 'stats.parseTime'],
          labels: [
            t('in-forge:plugins.oracleDB.db'),
            t('in-forge:plugins.oracleDB.dbCpu'),
            t('in-forge:plugins.oracleDB.sqlExecute'),
            t('in-forge:plugins.oracleDB.parse')
          ],
          type: 'line'
        }}
        renderPostChartContent={PluginDashboardsMarkerLanes}
      />
    </DashboardSection>
  );
}
