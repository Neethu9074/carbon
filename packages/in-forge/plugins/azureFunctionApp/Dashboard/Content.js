/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import FunctionsTable from 'in-forge/plugins/azureFunctionApp/Dashboard/FunctionsTable.js';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { number, bytes, seconds } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default function AzureFunctionAppDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');

  return (
    <div>
      <FunctionsTable snapshot={snapshot} timeConfig={timeConfig} />

      <DashboardSection title={t('in-forge:plugins.azureFunctionApp.dashboard.titleRequests')}>
      <Chart
        snapshotId={snapshotId}
        timeConfig={timeConfig}
        y1={{
          metrics: ['re_to'],
          labels: [t('in-forge:plugins.azureFunctionApp.dashboard.labelRequests')],
          formatter: number.detailed,
          type: 'bar'
        }}
        y2={{
          metrics: ['re_co', 're_av', 're_mi', 're_mx'],
          labels: [
            t('in-forge:plugins.azureFunctionApp.dashboard.labelCount'),
            t('in-forge:plugins.azureFunctionApp.dashboard.labelAverage'),
            t('in-forge:plugins.azureFunctionApp.dashboard.labelMinimum'),
            t('in-forge:plugins.azureFunctionApp.dashboard.labelMaximum')
          ],
          formatter: number.detailed,
          type: 'line'
        }}
        renderPostChartContent={PluginDashboardsMarkerLanes}
      />
      </DashboardSection>

      <DashboardSection title={t('in-forge:plugins.azureFunctionApp.dashboard.titleBytesReceived')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['br_to'],
            labels: [t('in-forge:plugins.azureFunctionApp.dashboard.labelBytesReceived')],
            formatter: number.detailed,
            type: 'bar'
          }}
          y2={{
            metrics: ['br_co', 'br_av', 'br_mi', 'br_mx'],
            labels: [
              t('in-forge:plugins.azureFunctionApp.dashboard.labelCount'),
              t('in-forge:plugins.azureFunctionApp.dashboard.labelAverage'),
              t('in-forge:plugins.azureFunctionApp.dashboard.labelMinimum'),
              t('in-forge:plugins.azureFunctionApp.dashboard.labelMaximum')
            ],
            formatter: bytes.compact,
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title={t('in-forge:plugins.azureFunctionApp.dashboard.titleBytesSent')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['bs_to'],
            labels: [t('in-forge:plugins.azureFunctionApp.dashboard.labelBytesSent')],
            formatter: number.detailed,
            type: 'bar'
          }}
          y2={{
            metrics: ['bs_co', 'bs_av', 'bs_mi', 'bs_mx'],
            labels: [
              t('in-forge:plugins.azureFunctionApp.dashboard.labelCount'),
              t('in-forge:plugins.azureFunctionApp.dashboard.labelAverage'),
              t('in-forge:plugins.azureFunctionApp.dashboard.labelMinimum'),
              t('in-forge:plugins.azureFunctionApp.dashboard.labelMaximum')
            ],
            formatter: bytes.compact,
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title={t('in-forge:plugins.azureFunctionApp.dashboard.titleHttp101')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['h1_to'],
            labels: [t('in-forge:plugins.azureFunctionApp.dashboard.labelHttp101')],
            formatter: number.detailed,
            type: 'bar'
          }}
          y2={{
            metrics: ['h1_co', 'h1_av', 'h1_mi', 'h1_mx'],
            labels: [
              t('in-forge:plugins.azureFunctionApp.dashboard.labelCount'),
              t('in-forge:plugins.azureFunctionApp.dashboard.labelAverage'),
              t('in-forge:plugins.azureFunctionApp.dashboard.labelMinimum'),
              t('in-forge:plugins.azureFunctionApp.dashboard.labelMaximum')
            ],
            formatter: number.detailed,
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title={t('in-forge:plugins.azureFunctionApp.dashboard.titleHttp2xx')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['h2_to'],
            labels: [t('in-forge:plugins.azureFunctionApp.dashboard.labelHttp2xx')],
            formatter: number.detailed,
            type: 'bar'
          }}
          y2={{
            metrics: ['h2_co', 'h2_av', 'h2_mi', 'h2_mx'],
            labels: [
              t('in-forge:plugins.azureFunctionApp.dashboard.labelCount'),
              t('in-forge:plugins.azureFunctionApp.dashboard.labelAverage'),
              t('in-forge:plugins.azureFunctionApp.dashboard.labelMinimum'),
              t('in-forge:plugins.azureFunctionApp.dashboard.labelMaximum')
            ],
            formatter: number.detailed,
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title={t('in-forge:plugins.azureFunctionApp.dashboard.titleHttp3xx')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['h3_to'],
            labels: [t('in-forge:plugins.azureFunctionApp.dashboard.labelHttp3xx')],
            formatter: number.detailed,
            type: 'bar'
          }}
          y2={{
            metrics: ['h3_co', 'h3_av', 'h3_mi', 'h3_mx'],
            labels: [
              t('in-forge:plugins.azureFunctionApp.dashboard.labelCount'),
              t('in-forge:plugins.azureFunctionApp.dashboard.labelAverage'),
              t('in-forge:plugins.azureFunctionApp.dashboard.labelMinimum'),
              t('in-forge:plugins.azureFunctionApp.dashboard.labelMaximum')
            ],
            formatter: number.detailed,
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title={t('in-forge:plugins.azureFunctionApp.dashboard.titleHttp4xx')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['h4_to'],
            labels: [t('in-forge:plugins.azureFunctionApp.dashboard.labelHttp4xx')],
            formatter: number.detailed,
            type: 'bar'
          }}
          y2={{
            metrics: ['h4_co', 'h4_av', 'h4_mi', 'h4_mx'],
            labels: [
              t('in-forge:plugins.azureFunctionApp.dashboard.labelCount'),
              t('in-forge:plugins.azureFunctionApp.dashboard.labelAverage'),
              t('in-forge:plugins.azureFunctionApp.dashboard.labelMinimum'),
              t('in-forge:plugins.azureFunctionApp.dashboard.labelMaximum')
            ],
            formatter: number.detailed,
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title={t('in-forge:plugins.azureFunctionApp.dashboard.titleHttp5xx')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['h5_to'],
            labels: [t('in-forge:plugins.azureFunctionApp.dashboard.labelHttp5xx')],
            formatter: number.detailed,
            type: 'bar'
          }}
          y2={{
            metrics: ['h5_co', 'h5_av', 'h5_mi', 'h5_mx'],
            labels: [
              t('in-forge:plugins.azureFunctionApp.dashboard.labelCount'),
              t('in-forge:plugins.azureFunctionApp.dashboard.labelAverage'),
              t('in-forge:plugins.azureFunctionApp.dashboard.labelMinimum'),
              t('in-forge:plugins.azureFunctionApp.dashboard.labelMaximum')
            ],
            formatter: number.detailed,
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title={t('in-forge:plugins.azureFunctionApp.dashboard.titleMemoryWorkingSet')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['mws_to'],
            labels: [t('in-forge:plugins.azureFunctionApp.dashboard.labelMemoryWorkingSet')],
            formatter: number.detailed,
            type: 'bar'
          }}
          y2={{
            metrics: ['mws_co', 'mws_av', 'mws_mi', 'mws_mx'],
            labels: [
              t('in-forge:plugins.azureFunctionApp.dashboard.labelCount'),
              t('in-forge:plugins.azureFunctionApp.dashboard.labelAverage'),
              t('in-forge:plugins.azureFunctionApp.dashboard.labelMinimum'),
              t('in-forge:plugins.azureFunctionApp.dashboard.labelMaximum')
            ],
            formatter: bytes.compact,
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title={t('in-forge:plugins.azureFunctionApp.dashboard.titleAverageMemoryWorkingSet')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['amws_to'],
            labels: [t('in-forge:plugins.azureFunctionApp.dashboard.labelAverageMemoryWorkingSet')],
            formatter: number.detailed,
            type: 'bar'
          }}
          y2={{
            metrics: ['amws_co', 'amws_av', 'amws_mi', 'amws_mx'],
            labels: [
              t('in-forge:plugins.azureFunctionApp.dashboard.labelCount'),
              t('in-forge:plugins.azureFunctionApp.dashboard.labelAverage'),
              t('in-forge:plugins.azureFunctionApp.dashboard.labelMinimum'),
              t('in-forge:plugins.azureFunctionApp.dashboard.labelMaximum')
            ],
            formatter: bytes.compact,
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title={t('in-forge:plugins.azureFunctionApp.dashboard.titleHttpResponseTime')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['hrt_to'],
            labels: [t('in-forge:plugins.azureFunctionApp.dashboard.labelHttpResponseTime')],
            formatter: number.detailed,
            type: 'bar'
          }}
          y2={{
            metrics: ['hrt_co', 'hrt_av', 'hrt_mi', 'hrt_mx'],
            labels: [
              t('in-forge:plugins.azureFunctionApp.dashboard.labelCount'),
              t('in-forge:plugins.azureFunctionApp.dashboard.labelAverage'),
              t('in-forge:plugins.azureFunctionApp.dashboard.labelMinimum'),
              t('in-forge:plugins.azureFunctionApp.dashboard.labelMaximum')
            ],
            formatter: seconds.detailed,
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title={t('in-forge:plugins.azureFunctionApp.dashboard.titleIoReadBytesPerSecond')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['irbps_to'],
            labels: [t('in-forge:plugins.azureFunctionApp.dashboard.labelIoReadBytesPerSecond')],
            formatter: number.detailed,
            type: 'bar'
          }}
          y2={{
            metrics: ['irbps_co', 'irbps_av', 'irbps_mi', 'irbps_mx'],
            labels: [
              t('in-forge:plugins.azureFunctionApp.dashboard.labelCount'),
              t('in-forge:plugins.azureFunctionApp.dashboard.labelAverage'),
              t('in-forge:plugins.azureFunctionApp.dashboard.labelMinimum'),
              t('in-forge:plugins.azureFunctionApp.dashboard.labelMaximum')
            ],
            formatter: bytes.compact,
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title={t('in-forge:plugins.azureFunctionApp.dashboard.titleIoWriteBytesPerSecond')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['iwbps_to'],
            labels: [t('in-forge:plugins.azureFunctionApp.dashboard.labelIoWriteBytesPerSecond')],
            formatter: number.detailed,
            type: 'bar'
          }}
          y2={{
            metrics: ['iwbps_co', 'iwbps_av', 'iwbps_mi', 'iwbps_mx'],
            labels: [
              t('in-forge:plugins.azureFunctionApp.dashboard.labelCount'),
              t('in-forge:plugins.azureFunctionApp.dashboard.labelAverage'),
              t('in-forge:plugins.azureFunctionApp.dashboard.labelMinimum'),
              t('in-forge:plugins.azureFunctionApp.dashboard.labelMaximum')
            ],
            formatter: bytes.compact,
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title={t('in-forge:plugins.azureFunctionApp.dashboard.titleIoReadOperationsPerSecond')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['irobps_to'],
            labels: [t('in-forge:plugins.azureFunctionApp.dashboard.labelIoReadOperationsPerSecond')],
            formatter: number.detailed,
            type: 'bar'
          }}
          y2={{
            metrics: ['irobps_co', 'irobps_av', 'irobps_mi', 'irobps_mx'],
            labels: [
              t('in-forge:plugins.azureFunctionApp.dashboard.labelCount'),
              t('in-forge:plugins.azureFunctionApp.dashboard.labelAverage'),
              t('in-forge:plugins.azureFunctionApp.dashboard.labelMinimum'),
              t('in-forge:plugins.azureFunctionApp.dashboard.labelMaximum')
            ],
            formatter: bytes.compact,
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title={t('in-forge:plugins.azureFunctionApp.dashboard.titleIoWriteOperationsPerSecond')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['iwobps_to'],
            labels: [t('in-forge:plugins.azureFunctionApp.dashboard.labelIoWriteOperationsPerSecond')],
            formatter: number.detailed,
            type: 'bar'
          }}
          y2={{
            metrics: ['iwobps_co', 'iwobps_av', 'iwobps_mi', 'iwobps_mx'],
            labels: [
              t('in-forge:plugins.azureFunctionApp.dashboard.labelCount'),
              t('in-forge:plugins.azureFunctionApp.dashboard.labelAverage'),
              t('in-forge:plugins.azureFunctionApp.dashboard.labelMinimum'),
              t('in-forge:plugins.azureFunctionApp.dashboard.labelMaximum')
            ],
            formatter: bytes.compact,
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title={t('in-forge:plugins.azureFunctionApp.dashboard.titleRequestsInApplicationQueue')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['riaq_to'],
            labels: [t('in-forge:plugins.azureFunctionApp.dashboard.labelRequestsInApplicationQueue')],
            formatter: number.detailed,
            type: 'bar'
          }}
          y2={{
            metrics: ['riaq_co', 'riaq_av', 'riaq_mi', 'riaq_mx'],
            labels: [
              t('in-forge:plugins.azureFunctionApp.dashboard.labelCount'),
              t('in-forge:plugins.azureFunctionApp.dashboard.labelAverage'),
              t('in-forge:plugins.azureFunctionApp.dashboard.labelMinimum'),
              t('in-forge:plugins.azureFunctionApp.dashboard.labelMaximum')
            ],
            formatter: number.detailed,
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title={t('in-forge:plugins.azureFunctionApp.dashboard.titleHealthCheckStatus')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['hcs_to'],
            labels: [t('in-forge:plugins.azureFunctionApp.dashboard.labelHealthCheckStatus')],
            formatter: number.detailed,
            type: 'bar'
          }}
          y2={{
            metrics: ['hcs_co', 'hcs_av', 'hcs_mi', 'hcs_mx'],
            labels: [
              t('in-forge:plugins.azureFunctionApp.dashboard.labelCount'),
              t('in-forge:plugins.azureFunctionApp.dashboard.labelAverage'),
              t('in-forge:plugins.azureFunctionApp.dashboard.labelMinimum'),
              t('in-forge:plugins.azureFunctionApp.dashboard.labelMaximum')
            ],
            formatter: number.detailed,
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title={t('in-forge:plugins.azureFunctionApp.dashboard.titleFileSystemUsage')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['fsu_to'],
            labels: [t('in-forge:plugins.azureFunctionApp.dashboard.labelFileSystemUsage')],
            formatter: number.detailed,
            type: 'bar'
          }}
          y2={{
            metrics: ['fsu_co', 'fsu_av', 'fsu_mi', 'fsu_mx'],
            labels: [
              t('in-forge:plugins.azureFunctionApp.dashboard.labelCount'),
              t('in-forge:plugins.azureFunctionApp.dashboard.labelAverage'),
              t('in-forge:plugins.azureFunctionApp.dashboard.labelMinimum'),
              t('in-forge:plugins.azureFunctionApp.dashboard.labelMaximum')
            ],
            formatter: bytes.compact,
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
    </div>
  );
}
