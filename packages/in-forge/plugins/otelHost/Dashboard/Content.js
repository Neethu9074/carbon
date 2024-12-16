/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import {
  zeroDecimalPlaces,
  twoDecimalPlaces,
  percentageTwoDecimalPlaces,
  bytes,
  bytesTwoDecimalPlaces
} from 'in-services/formatters/number';
import { WINDOW_FOR_LATEST_METRIC, DISTANCE_BETWEEN_DATAPOINTS } from 'in-forge/plugins/otelHost/constants';
import NetworkInterfacesTable from 'in-forge/plugins/otelHost/Dashboard/NetworkInterfacesTable';
import CustomMetricsV2, { AVAILABLE_SPECS } from 'in-sdk/components/dashboard/CustomMetricsV2';
import FileSystemsTable from 'in-forge/plugins/otelHost/Dashboard/FileSystemsTable';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import { isWindows, isZos, isLinux } from 'in-forge/plugins/otelHost/hostUtils';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import CompanionMetrics from 'in-sdk/components/dashboard/CompanionMetrics';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import DisksTable from 'in-forge/plugins/otelHost/Dashboard/DisksTable';
import CpuTable from 'in-forge/plugins/otelHost/Dashboard/CpuTable';
import { getHostCompanions } from 'in-stores/snapshot/graph';
import Columize from 'in-sdk/components/dashboard/Columize';
import MetricValue from 'in-components/MetricValue';
import Footer from 'in-components/Footer';
import { t } from 'in-i18n';

export default function OtelHostDashboard({ snapshot, timeConfig }) {
  const metricIds = snapshot.get('metricIds');
  return (
    <div>
      <KpiSection>
        <KpiKeyValue label={t('in-forge:plugins.otelHost.dashboard.cpuUsage')}>
          <MetricValue
            snapshotId={snapshot.get('id')}
            metric="cpu.user"
            formatter={percentageTwoDecimalPlaces}
            windowForLatest={WINDOW_FOR_LATEST_METRIC}
          />
        </KpiKeyValue>

        <KpiKeyValue label={t('in-forge:plugins.otelHost.dashboard.memoryUsage')}>
          <MetricValue
            snapshotId={snapshot.get('id')}
            metric="memory.used"
            formatter={bytesTwoDecimalPlaces}
            windowForLatest={WINDOW_FOR_LATEST_METRIC}
          />
        </KpiKeyValue>

        {!(isWindows(snapshot) || isZos(snapshot)) && (
          <KpiKeyValue label={t('in-forge:plugins.otelHost.dashboard.cpuLoad')}>
            <MetricValue
              snapshotId={snapshot.get('id')}
              metric="load.avg_1m"
              formatter={twoDecimalPlaces}
              windowForLatest={WINDOW_FOR_LATEST_METRIC}
            />
          </KpiKeyValue>
        )}
      </KpiSection>

      <Columize>
        <DashboardSection title={t('in-forge:plugins.otelHost.dashboard.cpuUsage')}>
          <Chart
            distanceBetweenDatapointsInMillis={DISTANCE_BETWEEN_DATAPOINTS}
            snapshotId={snapshot.get('id')}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              max: 1,
              formatter: percentageTwoDecimalPlaces,
              metrics: ['cpu.user', 'cpu.system', 'cpu.wait', 'cpu.nice', 'cpu.steal', 'cpu.interrupt', 'cpu.softirq'],
              labels: [
                t('in-forge:plugins.otelHost.dashboard.user'),
                t('in-forge:plugins.otelHost.dashboard.system'),
                t('in-forge:plugins.otelHost.dashboard.wait'),
                t('in-forge:plugins.otelHost.dashboard.nice'),
                t('in-forge:plugins.otelHost.dashboard.steal'),
                t('in-forge:plugins.otelHost.dashboard.interrupt'),
                t('in-forge:plugins.otelHost.dashboard.softirq')
              ],
              type: 'stackedArea'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>

        {!(isWindows(snapshot) || isZos(snapshot)) && (
          <DashboardSection title={t('in-forge:plugins.otelHost.dashboard.cpuLoad')}>
            <Chart
              distanceBetweenDatapointsInMillis={DISTANCE_BETWEEN_DATAPOINTS}
              snapshotId={snapshot.get('id')}
              timeConfig={timeConfig}
              minRollup={5000}
              y1={{
                min: 0,
                formatter: twoDecimalPlaces,
                tooltipFormatter: twoDecimalPlaces,
                metrics: ['load.avg_1m', 'load.avg_5m', 'load.avg_15m'],
                labels: [
                  t('in-forge:plugins.otelHost.dashboard.load1'),
                  t('in-forge:plugins.otelHost.dashboard.load5'),
                  t('in-forge:plugins.otelHost.dashboard.load15')
                ],
                type: 'stackedArea'
              }}
              renderPostChartContent={PluginDashboardsMarkerLanes}
            />
          </DashboardSection>
        )}
      </Columize>

      <CpuTable snapshot={snapshot} timeConfig={timeConfig} />

      <DisksTable snapshot={snapshot} timeConfig={timeConfig} />

      <DashboardSection title={t('in-forge:plugins.otelHost.dashboard.memory')}>
        <Chart
          distanceBetweenDatapointsInMillis={DISTANCE_BETWEEN_DATAPOINTS}
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            formatter: bytes.detailed,
            metrics: [
              'memory.used',
              'memory.free',
              'memory.buffered',
              'memory.cached',
              'memory.slab_reclaimable',
              'memory.slab_unreclaimable'
            ],
            labels: [
              t('in-forge:plugins.otelHost.dashboard.used'),
              t('in-forge:plugins.otelHost.dashboard.free'),
              t('in-forge:plugins.otelHost.dashboard.buffered'),
              t('in-forge:plugins.otelHost.dashboard.cached'),
              t('in-forge:plugins.otelHost.dashboard.slab_reclaimable'),
              t('in-forge:plugins.otelHost.dashboard.slab_unreclaimable')
            ],
            type: 'stackedArea'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
        {isLinux(snapshot) && (
          <Chart
            distanceBetweenDatapointsInMillis={DISTANCE_BETWEEN_DATAPOINTS}
            snapshotId={snapshot.get('id')}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              formatter: bytes.detailed,
              metrics: ['memory.buffers', 'memory.cached', 'memory.slab_reclaimable', 'memory.slab_unreclaimable'],
              labels: [
                t('in-forge:plugins.otelHost.dashboard.buffers'),
                t('in-forge:plugins.otelHost.dashboard.cached'),
                t('in-forge:plugins.otelHost.dashboard.slab_reclaimable'),
                t('in-forge:plugins.otelHost.dashboard.slab_unreclaimable')
              ],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        )}
      </DashboardSection>

      <FileSystemsTable snapshot={snapshot} timeConfig={timeConfig} />

      <NetworkInterfacesTable snapshot={snapshot} timeConfig={timeConfig} />

      {metricIds.includes('tcp.listen') === true && (
        <DashboardSection title={t('in-forge:plugins.otelHost.dashboard.tcpActivity')}>
          <Chart
            distanceBetweenDatapointsInMillis={DISTANCE_BETWEEN_DATAPOINTS}
            snapshotId={snapshot.get('id')}
            timeConfig={timeConfig}
            customHeight={300}
            y1={{
              type: 'line',
              metrics: [
                'tcp.listen',
                'tcp.established',
                'tcp.syn_sent',
                'tcp.syn_recv',
                'tcp.fin_wait_1',
                'tcp.fin_wait_2'
              ],
              labels: [
                t('in-forge:plugins.otelHost.dashboard.listen'),
                t('in-forge:plugins.otelHost.dashboard.established'),
                t('in-forge:plugins.otelHost.dashboard.syn_sent'),
                t('in-forge:plugins.otelHost.dashboard.syn_recv'),
                t('in-forge:plugins.otelHost.dashboard.fin_wait_1'),
                t('in-forge:plugins.otelHost.dashboard.fin_wait_2')
              ],
              min: 0,
              formatter: zeroDecimalPlaces,
              tooltipFormatter: twoDecimalPlaces
            }}
            y2={{
              type: 'line',
              metrics: ['tcp.last_ack', 'tcp.time_wait', 'tcp.close', 'tcp.close_wait', 'tcp.closing', 'tcp.delete'],
              labels: [
                t('in-forge:plugins.otelHost.dashboard.last_ack'),
                t('in-forge:plugins.otelHost.dashboard.time_wait'),
                t('in-forge:plugins.otelHost.dashboard.close'),
                t('in-forge:plugins.otelHost.dashboard.close_wait'),
                t('in-forge:plugins.otelHost.dashboard.closing'),
                t('in-forge:plugins.otelHost.dashboard.delete')
              ],
              min: 0,
              formatter: zeroDecimalPlaces,
              tooltipFormatter: twoDecimalPlaces
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      )}
      <CompanionMetrics companions$={getHostCompanions(snapshot.get('id'))} timeConfig={timeConfig} />
      <CustomMetricsV2
        snapshot={snapshot}
        timeConfig={timeConfig}
        titlePrefix={t('in-forge:plugins.otelHost.type')}
        specs={SPECS}
      />
      <Footer smallMargin />
    </div>
  );
}
export const SPECS = [AVAILABLE_SPECS.GAUGE, AVAILABLE_SPECS.HISTOGRAM, AVAILABLE_SPECS.SUM, AVAILABLE_SPECS.SUMMARY];
