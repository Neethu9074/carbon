/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import React from 'react';

import { number, bytesTwoDecimalPlaces, percentageTwoDecimalPlaces } from 'in-services/formatters/number';
import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import FilesystemsTable from 'in-forge/plugins/lxc/Dashboard/FilesystemsTable';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import MetricValue from 'in-components/MetricValue';

export default function LxcDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');
  const networkInterface = snapshot.getIn(['data', 'networkInterface']);

  return (
    <div>
      <KpiSection>
        <KpiKeyValue label={t('in-forge:plugins.lxc.memoryUsage', 'Memory Usage')}>
          <MetricValue snapshotId={snapshotId} metric="memory.usage" formatter={bytesTwoDecimalPlaces} />
        </KpiKeyValue>
      </KpiSection>

      <DashboardSection title={t('in-forge:plugins.lxc.cpu', 'CPU')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['cpu.system_usage', 'cpu.user_usage'],
            labels: [t('in-forge:plugins.lxc.kernel', 'Kernel'), t('in-forge:plugins.lxc.user', 'User')],
            formatter: percentageTwoDecimalPlaces,
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title={t('in-forge:plugins.lxc.memory', 'Memory')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['memory.usage', 'memory.rss', 'memory.cache', 'memory.swap'],
            labels: [
              t('in-forge:plugins.lxc.usage', 'Usage'),
              t('in-forge:plugins.lxc.rss', 'RSS'),
              t('in-forge:plugins.lxc.cache', 'Cache'),
              t('in-forge:plugins.lxc.swap', 'Swap')
            ],
            formatter: bytesTwoDecimalPlaces,
            type: 'line'
          }}
          y2={{
            min: 0,
            metrics: ['memory.usedPercentage', 'memory.swapPercentage'],
            labels: [t('in-forge:plugins.lxc.used', 'Used'), t('in-forge:plugins.lxc.swap', 'Swap')],
            formatter: percentageTwoDecimalPlaces,
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['memory.active_anon', 'memory.active_file', 'memory.inactive_anon', 'memory.inactive_file'],
            labels: [
              t('in-forge:plugins.lxc.activeAnonymous', 'Active anonymous'),
              t('in-forge:plugins.lxc.activeCache', 'Active cache'),
              t('in-forge:plugins.lxc.inactiveAnonymous', 'Inactive anonymous'),
              t('in-forge:plugins.lxc.inactiveCache', 'Inactive cache')
            ],
            formatter: bytesTwoDecimalPlaces,
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection
        title={
          networkInterface
            ? t('in-forge:plugins.lxc.networkWithNetworkInterface', { networkInterface: networkInterface })
            : t('in-forge:plugins.lxc.network')
        }
      >
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            formatter: bytesTwoDecimalPlaces,
            metrics: ['network.rxBytes', 'network.txBytes'],
            labels: [t('in-forge:plugins.lxc.rxBytes', 'RX Bytes'), t('in-forge:plugins.lxc.txBytes', 'TX Bytes')],
            type: 'line'
          }}
          y2={{
            min: 0,
            max: 1,
            metrics: ['network.rxPackets', 'network.txPackets'],
            labels: [
              t('in-forge:plugins.lxc.rxPackets', 'RX Packets'),
              t('in-forge:plugins.lxc.txPackets', 'TX Packets')
            ],
            formatter: number.compact,
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <FilesystemsTable snapshot={snapshot} timeConfig={timeConfig} />
    </div>
  );
}
