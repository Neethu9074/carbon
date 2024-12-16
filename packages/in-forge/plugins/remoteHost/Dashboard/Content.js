/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import {
  twoDecimalPlaces,
  percentageZeroDecimalPlaces,
  percentageTwoDecimalPlaces,
  number,
  bytes
} from 'in-services/formatters/number';
import NetworkInterfacesTable from 'in-forge/plugins/remoteHost/Dashboard/NetworkInterfacesTable';
import FilesystemsTable from 'in-forge/plugins/remoteHost/Dashboard/FilesystemsTable';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import { isWindows, isZos, isLinux } from 'in-forge/plugins/remoteHost/hostUtils';
import ProcessTopList from 'in-forge/plugins/remoteHost/Dashboard/ProcessTopList';
import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import CompanionMetrics from 'in-sdk/components/dashboard/CompanionMetrics';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { getHostCompanions } from 'in-stores/snapshot/graph';
import Columize from 'in-sdk/components/dashboard/Columize';
import MetricValue from 'in-components/MetricValue';
import Footer from 'in-components/Footer';
import { t } from 'in-i18n';

export default function RemoteHostDashboard({ snapshot, timeConfig }) {
  const suppportedCpuMetrics = {
    'cpu.user': t('in-forge:plugins.host.dashboard.user'),
    'cpu.sys': t('in-forge:plugins.host.dashboard.system'),
    'cpu.wait': t('in-forge:plugins.host.dashboard.wait'),
    'cpu.nice': t('in-forge:plugins.host.dashboard.nice'),
    'cpu.steal': t('in-forge:plugins.host.dashboard.steal')
  };

  const cpuAllMetric = 'cpu.all';
  let cpuMetriconKpiSelection = 'cpu.used';
  let cpuMetrics = [];
  let cpuMetricLabels = [];

  if (snapshot.get('metricIds').includes(cpuAllMetric)) {
    cpuMetriconKpiSelection = cpuAllMetric;
    cpuMetrics.push(cpuAllMetric);
    cpuMetricLabels.push(t('in-forge:plugins.host.dashboard.cpu'));
  }

  if (cpuMetrics.length === 0) {
    for (let metric of snapshot.get('metricIds')) {
      if (metric.startsWith('cpu') && metric in suppportedCpuMetrics) {
        cpuMetrics.push(metric);
        cpuMetricLabels.push(suppportedCpuMetrics[metric]);
      }
    }
  }

  let hasCpuMetrics = cpuMetrics.length > 0;
  let hasCpuUsage = snapshot.get('metricIds').includes(cpuMetriconKpiSelection);
  let hasCpuLoad = snapshot.get('metricIds').includes('load.1min');
  let hasMemUsed = snapshot.get('metricIds').includes('memory.used');
  let hasContextSwitch = snapshot.get('metricIds').includes('ctxt');

  return (
    <div>
      <KpiSection>
        {hasCpuUsage && (
          <KpiKeyValue label={t('in-forge:plugins.host.dashboard.cpuUsage')}>
            <MetricValue
              snapshotId={snapshot.get('id')}
              metric={cpuMetriconKpiSelection}
              formatter={percentageZeroDecimalPlaces}
            />
          </KpiKeyValue>
        )}

        {hasMemUsed && (
          <KpiKeyValue label={t('in-forge:plugins.host.dashboard.memoryUsage')}>
            <MetricValue snapshotId={snapshot.get('id')} metric="memory.used" formatter={percentageZeroDecimalPlaces} />
          </KpiKeyValue>
        )}

        {hasCpuLoad && !(isWindows(snapshot) || isZos(snapshot)) && (
          <KpiKeyValue label={t('in-forge:plugins.host.dashboard.cpuLoad')}>
            <MetricValue snapshotId={snapshot.get('id')} metric="load.1min" formatter={twoDecimalPlaces} />
          </KpiKeyValue>
        )}
      </KpiSection>

      <Columize>
        {hasCpuMetrics && (
          <DashboardSection title={t('in-forge:plugins.host.dashboard.cpuUsage')}>
            <Chart
              snapshotId={snapshot.get('id')}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                max: 1,
                formatter: percentageZeroDecimalPlaces,
                metrics: cpuMetrics,
                labels: cpuMetricLabels,
                type: 'stackedArea'
              }}
              renderPostChartContent={PluginDashboardsMarkerLanes}
            />
          </DashboardSection>
        )}

        {isLinux(snapshot) && hasContextSwitch && (
          <DashboardSection title={t('in-forge:plugins.host.dashboard.contextSwitches')}>
            <Chart
              snapshotId={snapshot.get('id')}
              timeConfig={timeConfig}
              y1={{
                formatter: number.compact,
                metrics: ['ctxt'],
                labels: [t('in-forge:plugins.host.dashboard.contextSwitches')],
                type: 'line'
              }}
              renderPostChartContent={PluginDashboardsMarkerLanes}
            />
          </DashboardSection>
        )}

        {!(isWindows(snapshot) || isZos(snapshot)) && hasCpuLoad && (
          <DashboardSection title={t('in-forge:plugins.host.dashboard.cpuLoad')}>
            <Chart
              snapshotId={snapshot.get('id')}
              timeConfig={timeConfig}
              minRollup={5000}
              y1={{
                min: 0,
                formatter: twoDecimalPlaces,
                tooltipFormatter: twoDecimalPlaces,
                metrics: ['load.1min'],
                labels: [t('in-forge:plugins.host.dashboard.load')],
                type: 'stackedArea'
              }}
              renderPostChartContent={PluginDashboardsMarkerLanes}
            />
          </DashboardSection>
        )}
      </Columize>

      {hasMemUsed && (
        <DashboardSection title={t('in-forge:plugins.host.dashboard.memory')}>
          <Chart
            snapshotId={snapshot.get('id')}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              max: 1,
              formatter: percentageZeroDecimalPlaces,
              tooltipFormatter: percentageTwoDecimalPlaces,
              metrics: ['memory.used'],
              labels: [t('in-forge:plugins.host.dashboard.used')],
              type: 'stackedArea'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
          {isLinux(snapshot) && (
            <Chart
              snapshotId={snapshot.get('id')}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                formatter: bytes.detailed,
                metrics: ['memory.swapTotal', 'memory.swapFree'],
                labels: [t('in-forge:plugins.host.dashboard.swapTotal'), t('in-forge:plugins.host.dashboard.swapFree')],
                type: 'line'
              }}
              renderPostChartContent={PluginDashboardsMarkerLanes}
            />
          )}
        </DashboardSection>
      )}

      <FilesystemsTable snapshot={snapshot} timeConfig={timeConfig} />

      <NetworkInterfacesTable snapshot={snapshot} timeConfig={timeConfig} />

      <ProcessTopList snapshot={snapshot} />

      <CompanionMetrics companions$={getHostCompanions(snapshot.get('id'))} timeConfig={timeConfig} />

      <Footer smallMargin />
    </div>
  );
}
