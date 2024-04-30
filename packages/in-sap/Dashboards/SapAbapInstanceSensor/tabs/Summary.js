/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { Fragment } from 'react';

import InfraMetricKpiCard from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs/InfraMetricKpiCardSap';
import DiskSummaryStats from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs/DiskSummaryStats';
import CombinedMetrics from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs/CombinedMetrics';
import AbapShortDumps from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs/AbapShortDumps';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import { number, kiloBytes, percentage } from 'in-services/formatters/number';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
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
            iconAction={{
              icon: 'lib_sap_status'
            }}
            snapshotId={snapshotId}
            metric="sapMetricsStats.status"
            formatter={statusFormatter}
          />
        </Col>
        <Col lg={3}>
          <InfraMetricKpiCard
            title={t('in-sap:dashboards.workProcessCount')}
            iconAction={{
              icon: 'lib_sap_wpCount'
            }}
            snapshotId={snapshotId}
            metric="workloadcounts.workProcessRowCount"
            formatter={number.compact}
          />
        </Col>
        <Col lg={3}>
          <InfraMetricKpiCard
            title={t('in-sap:dashboards.dbConnectionCount')}
            iconAction={{
              icon: 'lib_sap_db'
            }}
            snapshotId={snapshotId}
            metric="sapMetricsStats.dbConnectionCount"
            formatter={number.compact}
          />
        </Col>
        <Col lg={3}>
          <InfraMetricKpiCard
            title={t('in-sap:dashboards.memoryAvailable')}
            iconAction={{
              icon: 'lib_sap_memory'
            }}
            snapshotId={snapshotId}
            metric="swapmemory.memoryAvailablePercent"
            formatter={percentage.detailed}
          />
        </Col>
      </Row>
      <Row>
        <Col lg={3}>
          <InfraMetricKpiCard
            title={t('in-sap:abapsensor.recentNoOfDumps')}
            iconAction={{
              icon: 'lib_sap_dumps'
            }}
            snapshotId={snapshotId}
            metric="sapMetricsStats.numberOfDumps"
            formatter={number.compact}
          />
        </Col>
        <Col lg={3}>
          <InfraMetricKpiCard
            title={t('in-sap:abapsensor.inboundIdocErrors')}
            iconAction={{
              icon: 'lib_sap_inBound'
            }}
            snapshotId={snapshotId}
            metric="sapMetricsStats.totalInboundIdocError"
            formatter={number.compact}
          />
        </Col>
        <Col lg={3}>
          <InfraMetricKpiCard
            title={t('in-sap:abapsensor.outboundIdocErrors')}
            iconAction={{
              icon: 'lib_sap_outBound'
            }}
            snapshotId={snapshotId}
            metric="sapMetricsStats.totalOutboundIdocError"
            formatter={number.compact}
          />
        </Col>
        <Col lg={3}>
          <InfraMetricKpiCard
            title={t('in-sap:dashboards.cancelledJob')}
            iconAction={{
              icon: 'lib_sap_jobCancelled'
            }}
            snapshotId={snapshotId}
            metric="sapMetricsStats.cancelledJobCount"
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
              metrics: ['cpuMetricStats.usrTotal', 'cpuMetricStats.sysTotal', 'cpuMetricStats.totalUtilization'],
              labels: [
                t('in-sap:dashboards.userUtilization'),
                t('in-sap:dashboards.systemUtilization'),
                t('in-sap:abapsensor.metrics.total')
              ],
              type: 'line',
              formatter: number.compact
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
                t('in-sap:dashboards.enqueue'),
                t('in-sap:dashboards.background'),
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
              metrics: [
                'sapMetricsStats.jobCount',
                'sapMetricsStats.runningJobCount',
                'sapMetricsStats.releasedJobCount',
                'sapMetricsStats.successJobCount',
                'sapMetricsStats.cancelledJobCount'
              ],
              labels: [
                t('in-sap:abapsensor.metrics.total'),
                t('in-sap:dashboards.runningJobs'),
                t('in-sap:dashboards.releasedJobs'),
                t('in-sap:dashboards.finishedJobs'),
                t('in-sap:dashboards.abortedOrCancelledJob')
              ],
              type: 'line',
              formatter: number
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>
      <Columize>
        <DashboardSection title={t('in-sap:dashboards.freeMemoryStats')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['swapmemory.physMem', 'swapmemory.freeMemory'],
              labels: [t('in-sap:dashboards.physMem'), t('in-sap:dashboards.freeMemory')],
              type: 'line',
              formatter: kiloBytes.detailed
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-sap:dashboards.swapMemoryStats')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['swapmemory.freeSwap', 'swapmemory.swapSize'],
              labels: [t('in-sap:dashboards.freeSwap'), t('in-sap:dashboards.swapSize')],
              type: 'line',
              formatter: kiloBytes.detailed
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-sap:dashboards.paging')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['pagingStats.pageIn', 'pagingStats.pageOut'],
              labels: [t('in-sap:dashboards.pageIn'), t('in-sap:dashboards.pageOut')],
              type: 'line',
              formatter: number
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>
      <Columize>
        <DashboardSection title={t('in-sap:dashboards.cpuMetrics')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['cpuMetricStats.usrTotal', 'cpuMetricStats.sysTotal', 'cpuMetricStats.idleTotal'],
              labels: [
                t('in-sap:dashboards.userTotal'),
                t('in-sap:dashboards.systemTotal'),
                t('in-sap:dashboards.idleTotal')
              ],
              type: 'line',
              formatter: number
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-sap:dashboards.cpuCalls')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['cpuMetricStats.intSec', 'cpuMetricStats.syscSec', 'cpuMetricStats.csSec'],
              labels: [
                t('in-sap:dashboards.interrupts'),
                t('in-sap:dashboards.systemCalls'),
                t('in-sap:dashboards.contextSwitch')
              ],
              type: 'line',
              formatter: number
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-sap:dashboards.loadAverage')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['cpuMetricStats.loadAvg1', 'cpuMetricStats.loadAvg5', 'cpuMetricStats.loadAvg15'],
              labels: [
                t('in-sap:dashboards.loadAvg1'),
                t('in-sap:dashboards.loadAvg5'),
                t('in-sap:dashboards.loadAvg15')
              ],
              type: 'line',
              formatter: number
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
