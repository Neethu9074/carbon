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
import { hitRateTwoDecimalPlaces } from 'in-services/formatters/number';
import { SnapshotData } from 'in-stores/snapshot/snapshot';
import { TimeConfig } from 'in-types';
import { t } from 'in-i18n';

export default function DbSlashCpuTime({ snapshot, timeConfig }: { snapshot: SnapshotData; timeConfig: TimeConfig }) {
  const snapshotId = snapshot.get('id');
  return (
    <DashboardSection title={t('in-forge:plugins.oracleDB.dbSlashCpuTime')}>
      <Chart
        snapshotId={snapshotId}
        timeConfig={timeConfig}
        y1={{
          min: 0,
          formatter: hitRateTwoDecimalPlaces,
          metrics: ['stats.cpuTimeDbTimeRatio'],
          labels: [t('in-forge:plugins.oracleDB.ratio')],
          type: 'area'
        }}
        renderPostChartContent={PluginDashboardsMarkerLanes}
      />
    </DashboardSection>
  );
}
