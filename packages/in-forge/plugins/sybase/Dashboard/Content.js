/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import React from 'react';

import { bytesTwoDecimalPlaces, zeroDecimalPlaces } from 'in-services/formatters/number';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import DashboardNotification from 'in-sdk/components/dashboard/DashboardNotification';
import DatabasesTable from '../Dashboard/DatabasesTable';

export default function SybaseDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');

  const sensorConnectionStatus = snapshot.getIn(['data', 'sensorConnectionStatus'], 'OK');
  if (sensorConnectionStatus !== 'OK') {
    return <DashboardNotification type="info">{sensorConnectionStatus}</DashboardNotification>;
  }

  return (
    <div>
      <DashboardSection title={t('in-forge:plugins.sybase.titleConnections')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['stats.connCount'],
            labels: [t('in-forge:plugins.sybase.labelUserConnections')],
            type: 'line',
            formatter: zeroDecimalPlaces,
            tooltipFormatter: zeroDecimalPlaces
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title={t('in-forge:plugins.sybase.titleDiskReadsWrites')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['stats.diskRead', 'stats.diskWrite'],
            labels: [t('in-forge:plugins.sybase.labelReads'), t('in-forge:plugins.sybase.labelWrites')],
            type: 'line',
            formatter: zeroDecimalPlaces,
            tooltipFormatter: zeroDecimalPlaces
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title={t('in-forge:plugins.sybase.titleBytesReceivedSent')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['stats.bytesReceived', 'stats.bytesSent'],
            labels: [t('in-forge:plugins.sybase.labelReceived'), t('in-forge:plugins.sybase.labelSent')],
            type: 'line',
            formatter: bytesTwoDecimalPlaces,
            tooltipFormatter: bytesTwoDecimalPlaces
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title={t('in-forge:plugins.sybase.titleThreadDeadLocksAvoidedReported')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['stats.threadDeadlocksAvoided', 'stats.threadDeadlocksReported'],
            labels: [t('in-forge:plugins.sybase.labelAvoided'), t('in-forge:plugins.sybase.labelReported')],
            type: 'line',
            formatter: zeroDecimalPlaces,
            tooltipFormatter: zeroDecimalPlaces
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DatabasesTable snapshot={snapshot} timeConfig={timeConfig} />
    </div>
  );
}
