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
import NodesTable from './NodesTable';
import AppsTable from './AppsTable';
import { t } from 'in-i18n';

export default function Dashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');
  return (
    <div>
      <DashboardSection title={t('in-forge:plugins.hadoopYARN.dashboard.clusterNodes')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['activeNodes', 'lostNodes', 'unhealthyNodes', 'decommissionedNodes'],
            labels: [
              t('in-forge:plugins.hadoopYARN.dashboard.activeNodes'),
              t('in-forge:plugins.hadoopYARN.dashboard.lostNodes'),
              t('in-forge:plugins.hadoopYARN.dashboard.unhealthyNodes'),
              t('in-forge:plugins.hadoopYARN.dashboard.decommissionedNodes')
            ],
            formatter: zeroDecimalPlaces,
            type: 'stackedArea'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <Columize>
        <DashboardSection title={t('in-forge:plugins.hadoopYARN.dashboard.apps')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              metrics: ['appsRunning', 'appsPending', 'appsFailed'],
              labels: [
                t('in-forge:plugins.hadoopYARN.dashboard.appsRunning'),
                t('in-forge:plugins.hadoopYARN.dashboard.appsPending'),
                t('in-forge:plugins.hadoopYARN.dashboard.appsFailed')
              ],
              formatter: zeroDecimalPlaces,
              type: 'stackedArea'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.hadoopYARN.dashboard.clusterContainers')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              metrics: ['containersRunning'],
              labels: [t('in-forge:plugins.hadoopYARN.dashboard.containersRunning')],
              formatter: zeroDecimalPlaces,
              type: 'stackedArea'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>
      <Columize>
        <DashboardSection title={t('in-forge:plugins.hadoopYARN.dashboard.clusterMemory')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              metrics: ['usedMemory', 'availableMemory', 'reservedMemory'],
              labels: [
                t('in-forge:plugins.hadoopYARN.dashboard.usedMemory'),
                t('in-forge:plugins.hadoopYARN.dashboard.availableMemory'),
                t('in-forge:plugins.hadoopYARN.dashboard.reservedMemory')
              ],
              formatter: bytesZeroDecimalPlaces,
              tooltipFormatter: bytesTwoDecimalPlaces,
              type: 'stackedArea'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.hadoopYARN.dashboard.clusterVirtualCores')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              metrics: ['usedVirtualCores', 'availableVirtualCores', 'reservedVirtualCores'],
              labels: [
                t('in-forge:plugins.hadoopYARN.dashboard.usedVirtualCores'),
                t('in-forge:plugins.hadoopYARN.dashboard.availableVirtualCores'),
                t('in-forge:plugins.hadoopYARN.dashboard.reservedVirtualCores')
              ],
              formatter: zeroDecimalPlaces,
              type: 'stackedArea'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>
      <NodesTable snapshot={snapshot} timeConfig={timeConfig} />
      <AppsTable snapshot={snapshot} />
    </div>
  );
}
