/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { Fragment } from 'react';

import DiskSummaryStats from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs/DiskSummaryStats';
import CombinedMetrics from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs/CombinedMetrics';
import AbapShortDumps from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs/AbapShortDumps';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import InfraMetricKpiCard from 'in-components/KpiCard/InfraMetricKpiCard';
import { number, bytes, millis } from 'in-services/formatters/number';
import Columize from 'in-sdk/components/dashboard/Columize';
import { Row, Col } from 'in-components/layout/Grid';
import { t } from 'in-i18n';

export default function Summary({ timeConfig, data: sap }) {
  const snapshotId = sap.id;
  const statusFormatter = status => {
    switch (status) {
      case 1:
        return 'ACTIVE';
      case 0:
        return 'INACTIVE';
      default:
        return '-';
    }
  };
  return (
    <Fragment>
      <Row>
        <Col lg={3}>
          <InfraMetricKpiCard
            title={t('in-sap:abapsensor.connectionStatus')}
            snapshotId={snapshotId}
            metric="sapMetricsStats.status"
            formatter={statusFormatter}
          />
        </Col>
        <Col lg={3}>
          <InfraMetricKpiCard
            title={t('in-sap:dashboards.workProcessCount')}
            snapshotId={snapshotId}
            metric="workloadcounts.workProcessRowCount"
            formatter={number.compact}
          />
        </Col>
        <Col lg={3}>
          <InfraMetricKpiCard
            title={t('in-sap:dashboards.dbConnectionCount')}
            snapshotId={snapshotId}
            metric="sapMetricsStats.dbConnectionCount"
            formatter={number.compact}
          />
        </Col>
        <Col lg={3}>
          <InfraMetricKpiCard
            title={t('in-sap:dashboards.totalMemory')}
            snapshotId={snapshotId}
            metric="sapMetricsStats.totalMemory"
            formatter={bytes.compact}
          />
        </Col>
      </Row>
      <Row>
        <Col lg={3}>
          <InfraMetricKpiCard
            title={t('in-sap:abapsensor.recentNoOfDumps')}
            snapshotId={snapshotId}
            metric="sapMetricsStats.numberOfDumps"
            formatter={number.compact}
          />
        </Col>
      </Row>
      <Columize>
        <DashboardSection title={t('in-sap:dashboards.userStats')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['sapMetricsStats.userName', 'sapMetricsStats.userSession'],
              labels: [t('in-sap:dashboards.numberOfUsers'), t('in-sap:dashboards.userSession')],
              type: 'line',
              formatter: number
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-sap:dashboards.rfcStats')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['sapMetricsStats.totalRFCCalls'],
              labels: [t('in-sap:dashboards.totalRFCCalls')],
              type: 'line',
              formatter: number
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-sap:dashboards.cpuUtilization')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['sapMetricsStats.totalCpuUtilization'],
              labels: [t('in-sap:dashboards.cpuUtilization')],
              type: 'line',
              formatter: millis.compact
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>
      <Columize>
        <DashboardSection title={t('in-sap:dashboards.processMaxRequestTime')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: [
                'queueStats.nowpWait',
                'queueStats.dialogWait',
                'queueStats.updateWait',
                'queueStats.enqueueWait',
                'queueStats.btcWait',
                'queueStats.spoolWait',
                'queueStats.update2Wait'
              ],
              labels: [
                t('in-sap:dashboards.nowpWait'),
                t('in-sap:dashboards.dialogWait'),
                t('in-sap:dashboards.updateWait'),
                t('in-sap:dashboards.enqueueWait'),
                t('in-sap:dashboards.btcWait'),
                t('in-sap:dashboards.spoolWait'),
                t('in-sap:dashboards.update2Wait')
              ],
              type: 'line',
              formatter: number
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>
      <Columize>
        <DashboardSection title={t('in-sap:dashboards.workProcessType')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: [
                'workloadcounts.numberOfDialogProcess',
                'workloadcounts.numberOfSpoolProcess',
                'workloadcounts.numberOfBatchProcess',
                'workloadcounts.numberOfEnqueueProcess',
                'workloadcounts.numberOfUpdateProcess',
                'workloadcounts.numberOfUpdate2Process'
              ],
              labels: [
                t('in-sap:dashboards.numberOfDialogProcess'),
                t('in-sap:dashboards.numberOfSpoolProcess'),
                t('in-sap:dashboards.numberOfBatchProcess'),
                t('in-sap:dashboards.numberOfEnqueueProcess'),
                t('in-sap:dashboards.numberOfUpdateProcess'),
                t('in-sap:dashboards.numberOfUpdate2Process')
              ],
              type: 'stackedBar',
              formatter: number
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>
      <Columize>
        <DashboardSection title={t('in-sap:dashboards.workProcessState')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['workloadcounts.onHold', 'workloadcounts.running', 'workloadcounts.waiting'],
              labels: [t('in-sap:dashboards.onHold'), t('in-sap:dashboards.running'), t('in-sap:dashboards.waiting')],
              type: 'line',
              formatter: number
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-sap:abapsensor.metrics.backgroundJobCounts')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['sapMetricsStats.jobCount'],
              labels: [t('in-sap:abapsensor.metrics.jobCounts')],
              type: 'line',
              formatter: number
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>
      <Columize>
        <DashboardSection title={t('in-sap:dashboards.memoryStats')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['swapmemory.swapConf', 'swapmemory.freeSwap', 'swapmemory.swapSize', 'swapmemory.swapMax'],
              labels: [
                t('in-sap:dashboards.swapConf'),
                t('in-sap:dashboards.freeSwap'),
                t('in-sap:dashboards.swapSize'),
                t('in-sap:dashboards.swapMax')
              ],
              type: 'line',
              formatter: bytes
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>
      <CombinedMetrics snapshotId={snapshotId} timeConfig={timeConfig} />
      <DiskSummaryStats snapshotId={snapshotId} timeConfig={timeConfig} />
      <AbapShortDumps snapshotId={snapshotId} timeConfig={timeConfig} />
    </Fragment>
  );
}
