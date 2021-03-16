/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { zeroDecimalPlaces, bytesZeroDecimalPlaces, bytesTwoDecimalPlaces } from 'in-services/formatters/number';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import Columize from 'in-sdk/components/dashboard/Columize';
import WorkersTable from './WorkersTable';
import DriversTable from './DriversTable';
import AppsTable from './AppsTable';
import { t } from 'in-i18n';

export default function Dashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');
  return (
    <div>
      <DashboardSection title={t('in-forge:plugins.sparkStandalone.titleClusterWorkers')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: [
              'workers.aliveWorkers',
              'workers.deadWorkers',
              'workers.decommissionedWorkers',
              'workers.workersInUnknownState'
            ],
            labels: [
              t('in-forge:plugins.sparkStandalone.labelAliveWorkers'),
              t('in-forge:plugins.sparkStandalone.labelDeadWorkers'),
              t('in-forge:plugins.sparkStandalone.labelDecommissionedWorkers'),
              t('in-forge:plugins.sparkStandalone.labelWorkersInUnknownState')
            ],
            formatter: zeroDecimalPlaces,
            type: 'stackedArea'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <Columize>
        <DashboardSection title={t('in-forge:plugins.sparkStandalone.titleClusterMemory')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              metrics: ['workers.memoryInUseTotal', 'workers.memoryTotal'],
              labels: [
                t('in-forge:plugins.sparkStandalone.labelUsedMemory'),
                t('in-forge:plugins.sparkStandalone.labelTotalMemory')
              ],
              formatter: bytesZeroDecimalPlaces,
              tooltipFormatter: bytesTwoDecimalPlaces,
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.sparkStandalone.titleClusterCores')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              metrics: ['workers.coresInUseTotal', 'workers.coresTotal'],
              labels: [
                t('in-forge:plugins.sparkStandalone.labelUsedCores'),
                t('in-forge:plugins.sparkStandalone.labelTotalCores')
              ],
              formatter: zeroDecimalPlaces,
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>
      <WorkersTable snapshot={snapshot} timeConfig={timeConfig} />
      <AppsTable snapshot={snapshot} />
      <DriversTable snapshot={snapshot} />
    </div>
  );
}
