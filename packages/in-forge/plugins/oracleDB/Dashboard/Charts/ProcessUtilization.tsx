/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

// @ts-expect-error Module needs to be translated to TS
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { SnapshotData } from 'in-stores/snapshot/snapshot';
import { number } from 'in-services/formatters/number';
import { TimeConfig } from 'in-types';
import { t } from 'in-i18n';

export default function ProcessUtilization({
  snapshot,
  timeConfig
}: {
  snapshot: SnapshotData;
  timeConfig: TimeConfig;
}) {
  const snapshotId = snapshot.get('id');
  return (
    <DashboardSection title={t('in-forge:plugins.oracleDB.processUtilization')}>
      <Chart
        snapshotId={snapshotId}
        timeConfig={timeConfig}
        y1={{
          formatter: number.compact,
          metrics: [
            'stats.processUtilization.maxUtilization',
            'stats.processUtilization.currentUtilization',
            'stats.processUtilization.initialAllocation',
            'stats.processUtilization.limitValue'
          ],
          labels: [
            t('in-forge:plugins.oracleDB.processMaxUtilization'),
            t('in-forge:plugins.oracleDB.processCurrentUtilization'),
            t('in-forge:plugins.oracleDB.processInitialAllocation'),
            t('in-forge:plugins.oracleDB.processLimitValue')
          ],
          type: 'line'
        }}
        renderPostChartContent={PluginDashboardsMarkerLanes}
      />
    </DashboardSection>
  );
}
