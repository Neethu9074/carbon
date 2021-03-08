/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import React from 'react';

import { zeroDecimalPlaces, msZeroDecimalPlaces } from 'in-services/formatters/number';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';

export default function ZKStandaloneDashboard({ snapshot, timeConfig }) {
  return (
    <div>
      <DashboardSection title={t('in-forge:plugins.zooKeeper.titleLatency')}>
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['avg_request_latency'],
            labels: [t('in-forge:plugins.zooKeeper.labelAverageRequestLatency')],
            type: 'line',
            formatter: msZeroDecimalPlaces
          }}
          y2={{
            min: 0,
            metrics: ['max_request_latency', 'min_request_latency'],
            labels: [
              t('in-forge:plugins.zooKeeper.labelMaxRequestLatency'),
              t('in-forge:plugins.zooKeeper.labelMinRequestLatency')
            ],
            type: 'line',
            formatter: msZeroDecimalPlaces
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.zooKeeper.titleRequests')}>
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['outstanding_requests'],
            labels: [t('in-forge:plugins.zooKeeper.labelOutstandingRequests')],
            type: 'line',
            formatter: zeroDecimalPlaces
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.zooKeeper.titleConnections')}>
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['num_alive_connections'],
            labels: [t('in-forge:plugins.zooKeeper.labelAliveConnections')],
            type: 'line',
            formatter: zeroDecimalPlaces
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.zooKeeper.titlePackets')}>
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['packets_received'],
            labels: [t('in-forge:plugins.zooKeeper.labelPacketsReceived')],
            type: 'line',
            formatter: zeroDecimalPlaces
          }}
          y2={{
            min: 0,
            metrics: ['packets_sent'],
            labels: [t('in-forge:plugins.zooKeeper.labelPacketsSent')],
            type: 'line',
            formatter: zeroDecimalPlaces
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
    </div>
  );
}
