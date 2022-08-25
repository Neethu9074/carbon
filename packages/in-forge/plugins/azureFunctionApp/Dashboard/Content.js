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

      <DashboardSection title={t('in-forge:plugins.azureFunctionApp.dashboard.titlePrivateBytes')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['pb_to'],
            labels: [t('in-forge:plugins.azureFunctionApp.dashboard.labelPrivateBytes')],
            formatter: number.detailed,
            type: 'bar'
          }}
          y2={{
            metrics: ['pb_co', 'pb_av', 'pb_mi', 'pb_mx'],
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

      <DashboardSection title={t('in-forge:plugins.azureFunctionApp.dashboard.titleRequests')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['rq_to'],
            labels: [t('in-forge:plugins.azureFunctionApp.dashboard.labelRequests')],
            formatter: number.detailed,
            type: 'bar'
          }}
          y2={{
            metrics: ['rq_co', 'rq_av', 'rq_mi', 'rq_mx'],
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

      <DashboardSection title={t('in-forge:plugins.azureFunctionApp.dashboard.titleHttp401')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['h41_to'],
            labels: [t('in-forge:plugins.azureFunctionApp.dashboard.labelHttp401')],
            formatter: number.detailed,
            type: 'bar'
          }}
          y2={{
            metrics: ['h41_co', 'h41_av', 'h41_mi', 'h41_mx'],
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

      <DashboardSection title={t('in-forge:plugins.azureFunctionApp.dashboard.titleHttp403')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['h43_to'],
            labels: [t('in-forge:plugins.azureFunctionApp.dashboard.labelHttp403')],
            formatter: number.detailed,
            type: 'bar'
          }}
          y2={{
            metrics: ['h43_co', 'h43_av', 'h43_mi', 'h43_mx'],
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

      <DashboardSection title={t('in-forge:plugins.azureFunctionApp.dashboard.titleHttp404')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['h44_to'],
            labels: [t('in-forge:plugins.azureFunctionApp.dashboard.labelHttp404')],
            formatter: number.detailed,
            type: 'bar'
          }}
          y2={{
            metrics: ['h44_co', 'h44_av', 'h44_mi', 'h44_mx'],
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

      <DashboardSection title={t('in-forge:plugins.azureFunctionApp.dashboard.titleHttp406')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['h46_to'],
            labels: [t('in-forge:plugins.azureFunctionApp.dashboard.labelHttp406')],
            formatter: number.detailed,
            type: 'bar'
          }}
          y2={{
            metrics: ['h46_co', 'h46_av', 'h46_mi', 'h46_mx'],
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

      <DashboardSection title={t('in-forge:plugins.azureFunctionApp.dashboard.titleAverageResponseTime')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['art_to'],
            labels: [t('in-forge:plugins.azureFunctionApp.dashboard.labelAverageResponseTime')],
            formatter: number.detailed,
            type: 'bar'
          }}
          y2={{
            metrics: ['art_co', 'art_av', 'art_mi', 'art_mx'],
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

      <DashboardSection title={t('in-forge:plugins.azureFunctionApp.dashboard.titleHandles')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['ha_to'],
            labels: [t('in-forge:plugins.azureFunctionApp.dashboard.labelHandles')],
            formatter: number.detailed,
            type: 'bar'
          }}
          y2={{
            metrics: ['ha_co', 'ha_av', 'ha_mi', 'ha_mx'],
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

      <DashboardSection title={t('in-forge:plugins.azureFunctionApp.dashboard.titleThreads')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['th_to'],
            labels: [t('in-forge:plugins.azureFunctionApp.dashboard.labelThreads')],
            formatter: number.detailed,
            type: 'bar'
          }}
          y2={{
            metrics: ['th_co', 'th_av', 'th_mi', 'th_mx'],
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

      <DashboardSection title={t('in-forge:plugins.azureFunctionApp.dashboard.titleFunctionExecutionUnits')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['feu_to'],
            labels: [t('in-forge:plugins.azureFunctionApp.dashboard.labelFunctionExecutionUnits')],
            formatter: number.detailed,
            type: 'bar'
          }}
          y2={{
            metrics: ['feu_co', 'feu_av', 'feu_mi', 'feu_mx'],
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

      <DashboardSection title={t('in-forge:plugins.azureFunctionApp.dashboard.titleFunctionExecutionCount')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['fec_to'],
            labels: [t('in-forge:plugins.azureFunctionApp.dashboard.labelFunctionExecutionCount')],
            formatter: number.detailed,
            type: 'bar'
          }}
          y2={{
            metrics: ['fec_co', 'fec_av', 'fec_mi', 'fec_mx'],
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

      <DashboardSection title={t('in-forge:plugins.azureFunctionApp.dashboard.titleIoReadBytesPerSecond')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['iorbps_to'],
            labels: [t('in-forge:plugins.azureFunctionApp.dashboard.labelIoReadBytesPerSecond')],
            formatter: number.detailed,
            type: 'bar'
          }}
          y2={{
            metrics: ['iorbps_co', 'iorbps_av', 'iorbps_mi', 'iorbps_mx'],
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
            metrics: ['iowbps_to'],
            labels: [t('in-forge:plugins.azureFunctionApp.dashboard.labelIoWriteBytesPerSecond')],
            formatter: number.detailed,
            type: 'bar'
          }}
          y2={{
            metrics: ['iowbps_co', 'iowbps_av', 'iowbps_mi', 'iowbps_mx'],
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

      <DashboardSection title={t('in-forge:plugins.azureFunctionApp.dashboard.titleIoOtherBytesPerSecond')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['ioobps_to'],
            labels: [t('in-forge:plugins.azureFunctionApp.dashboard.labelIoOtherBytesPerSecond')],
            formatter: number.detailed,
            type: 'bar'
          }}
          y2={{
            metrics: ['ioobps_co', 'ioobps_av', 'ioobps_mi', 'ioobps_mx'],
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
            metrics: ['iorops_to'],
            labels: [t('in-forge:plugins.azureFunctionApp.dashboard.labelIoReadOperationsPerSecond')],
            formatter: number.detailed,
            type: 'bar'
          }}
          y2={{
            metrics: ['iorops_co', 'iorops_av', 'iorops_mi', 'iorops_mx'],
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
            metrics: ['iowops_to'],
            labels: [t('in-forge:plugins.azureFunctionApp.dashboard.labelIoWriteOperationsPerSecond')],
            formatter: number.detailed,
            type: 'bar'
          }}
          y2={{
            metrics: ['iowops_co', 'iowops_av', 'iowops_mi', 'iowops_mx'],
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

      <DashboardSection title={t('in-forge:plugins.azureFunctionApp.dashboard.titleIoOtherOperationsPerSecond')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['iooops_to'],
            labels: [t('in-forge:plugins.azureFunctionApp.dashboard.labelIoOtherOperationsPerSecond')],
            formatter: number.detailed,
            type: 'bar'
          }}
          y2={{
            metrics: ['iooops_co', 'iooops_av', 'iooops_mi', 'iooops_mx'],
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

      <DashboardSection title={t('in-forge:plugins.azureFunctionApp.dashboard.titleTotalAppDomains')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['tad_to'],
            labels: [t('in-forge:plugins.azureFunctionApp.dashboard.labelTotalAppDomains')],
            formatter: number.detailed,
            type: 'bar'
          }}
          y2={{
            metrics: ['tad_co', 'tad_av', 'tad_mi', 'tad_mx'],
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

      <DashboardSection title={t('in-forge:plugins.azureFunctionApp.dashboard.titleTotalAppDomainsUnloaded')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['tadu_to'],
            labels: [t('in-forge:plugins.azureFunctionApp.dashboard.labelTotalAppDomainsUnloaded')],
            formatter: number.detailed,
            type: 'bar'
          }}
          y2={{
            metrics: ['tadu_co', 'tadu_av', 'tadu_mi', 'tadu_mx'],
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

      <DashboardSection title={t('in-forge:plugins.azureFunctionApp.dashboard.titleGen0Collections')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['g0c_to'],
            labels: [t('in-forge:plugins.azureFunctionApp.dashboard.labelGen0Collections')],
            formatter: number.detailed,
            type: 'bar'
          }}
          y2={{
            metrics: ['g0c_co', 'g0c_av', 'g0c_mi', 'g0c_mx'],
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

      <DashboardSection title={t('in-forge:plugins.azureFunctionApp.dashboard.titleGen1Collections')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['g1c_to'],
            labels: [t('in-forge:plugins.azureFunctionApp.dashboard.labelGen1Collections')],
            formatter: number.detailed,
            type: 'bar'
          }}
          y2={{
            metrics: ['g1c_co', 'g1c_av', 'g1c_mi', 'g1c_mx'],
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

      <DashboardSection title={t('in-forge:plugins.azureFunctionApp.dashboard.titleGen2Collections')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['g2c_to'],
            labels: [t('in-forge:plugins.azureFunctionApp.dashboard.labelGen2Collections')],
            formatter: number.detailed,
            type: 'bar'
          }}
          y2={{
            metrics: ['g2c_co', 'g2c_av', 'g2c_mi', 'g2c_mx'],
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

      <DashboardSection title={t('in-forge:plugins.azureFunctionApp.dashboard.titleAppConnections')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['ac_co', 'ac_av', 'ac_mi', 'ac_mx'],
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

      <DashboardSection title={t('in-forge:plugins.azureFunctionApp.dashboard.titleCurrentAssemblies')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['ca_to'],
            labels: [t('in-forge:plugins.azureFunctionApp.dashboard.labelCurrentAssemblies')],
            formatter: number.detailed,
            type: 'bar'
          }}
          y2={{
            metrics: ['ca_co', 'ca_av', 'ca_mi', 'ca_mx'],
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

      <FunctionsTable snapshot={snapshot} timeConfig={timeConfig} />
    </div>
  );
}
