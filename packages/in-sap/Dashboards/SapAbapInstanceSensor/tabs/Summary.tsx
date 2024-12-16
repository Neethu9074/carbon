/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { Fragment } from 'react';

import { themes } from '@instana/design-tokens';
import { useObservable } from '@instana/hooks';

// @ts-expect-error needs TS migration
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import { number, kiloBytes, percentage, percentagePlain, millis } from 'in-services/formatters/number';
import AbapShortDumps from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs/AbapShortDumps';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { capitalizeValue } from 'in-components/Capitalize/Capitalize';
import { productAreas } from 'in-services/tracking/productAreas';
import { SnapshotData, getSnapshot } from 'in-stores/snapshot';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import Columize from 'in-sdk/components/dashboard/Columize';
import { pageNames } from 'in-services/tracking/pageNames';
import { Row, Col } from 'in-components/layout/Grid';
import KpiCard from 'in-components/KpiCard/KpiCard';
import MetricValue from 'in-components/MetricValue';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { t } from 'in-i18n';

import locals from './Summary.mless';

export default function Summary({ data }: { data: SnapshotData }) {
  const timeConfig = useTimeConfig();
  const snapshotId = data.id;
  const snapshot = useObservable(getSnapshot(snapshotId, timeConfig), [snapshotId, timeConfig]);
  if (!snapshot) {
    return null;
  }
  let upTime: string = snapshot.get('data').get('upTime');

  return (
    <Fragment>
      <ViewTrackingMeta
        data={{
          productArea: productAreas.sap,
          pageRootName: pageNames.abap_instance_summary
        }}
      />
      <Row>
        <Col lg={3}>
          <KpiCard
            title={t('in-sap:dashboards.upTime')}
            value={upTime}
            renderValue={capitalizeValue}
            raw
            icon={'lib_sap_upTime'}
            borderless
            iconClassName={locals.uptime}
          />
        </Col>
        <Col lg={3}>
          <KpiCard icon={'lib_sap_wpCount'} title={t('in-sap:dashboards.workProcessCount')}>
            <MetricValue
              snapshotId={snapshotId}
              metric={'workloadcounts.workProcessRowCount'}
              formatter={number.compact}
            />
          </KpiCard>
        </Col>
        <Col lg={3}>
          <KpiCard icon={'lib_sap_db'} title={t('in-sap:dashboards.dbConnectionCount')}>
            <MetricValue
              snapshotId={snapshotId}
              metric={'sapMetricsStats.dbConnectionCount'}
              formatter={number.compact}
            />
          </KpiCard>
        </Col>
        <Col lg={3}>
          <KpiCard icon={'lib_sap_memory'} title={t('in-sap:dashboards.memoryAvailable')}>
            <MetricValue
              snapshotId={snapshotId}
              metric={'swapmemory.memoryAvailablePercent'}
              formatter={percentage.detailed}
            />
          </KpiCard>
        </Col>
      </Row>
      <Row>
        <Col lg={3}>
          <KpiCard icon={'lib_sap_dumps'} title={t('in-sap:abapsensor.recentNoOfDumps')}>
            <MetricValue snapshotId={snapshotId} metric={'sapMetricsStats.numberOfDumps'} formatter={number.compact} />
          </KpiCard>
        </Col>
        <Col lg={3}>
          <KpiCard icon={'lib_sap_inBound'} title={t('in-sap:abapsensor.inboundIdocErrors')}>
            <MetricValue
              snapshotId={snapshotId}
              metric={'sapMetricsStats.totalInboundIdocError'}
              formatter={number.compact}
            />
          </KpiCard>
        </Col>
        <Col lg={3}>
          <KpiCard icon={'lib_sap_outBound'} title={t('in-sap:abapsensor.outboundIdocErrors')}>
            <MetricValue
              snapshotId={snapshotId}
              metric={'sapMetricsStats.totalOutboundIdocError'}
              formatter={number.compact}
            />
          </KpiCard>
        </Col>
        <Col lg={3}>
          <KpiCard icon={'lib_sap_jobCancelled'} title={t('in-sap:dashboards.cancelledJob')}>
            <MetricValue snapshotId={snapshotId} metric={'sapMetricsStats.cancelJobs'} formatter={number.compact} />
          </KpiCard>
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
              formatter: number.compact
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
              formatter: number.compact
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-sap:dashboards.totalcpuUtilization')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['cpuMetricStats.totalUtilization'],
              labels: [t('in-sap:abapsensor.metrics.total')],
              type: 'line',
              formatter: percentagePlain.detailed
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
                'workloadcounts.numberOfUpdateProcess',
                'workloadcounts.numberOfEnqueueProcess',
                'workloadcounts.numberOfBatchProcess',
                'workloadcounts.numberOfSpoolProcess',
                'workloadcounts.numberOfUpdate2Process'
              ],
              labels: [
                t('in-sap:dashboards.numberOfDialogProcess'),
                t('in-sap:dashboards.numberOfUpdateProcess'),
                t('in-sap:dashboards.numberOfEnqueueProcess'),
                t('in-sap:dashboards.numberOfBatchProcess'),
                t('in-sap:dashboards.numberOfSpoolProcess'),
                t('in-sap:dashboards.numberOfUpdate2Process')
              ],
              type: 'stackedBar',
              formatter: number.compact
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
              metrics: [
                'workloadcounts.waiting',
                'workloadcounts.running',
                'workloadcounts.onHold',
                'workloadcounts.stopped',
                'workloadcounts.shutdown',
                'workloadcounts.reserviert'
              ],
              labels: [
                t('in-sap:dashboards.waiting'),
                t('in-sap:dashboards.running'),
                t('in-sap:dashboards.onHold'),
                t('in-sap:dashboards.stopped'),
                t('in-sap:dashboards.shutdown'),
                t('in-sap:dashboards.reserved')
              ],
              type: 'line',
              formatter: number.compact
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
              formatter: number.compact
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
              metrics: ['swapmemory.swapSize', 'swapmemory.freeSwap'],
              labels: [t('in-sap:dashboards.swapSize'), t('in-sap:dashboards.freeSwap')],
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
              formatter: kiloBytes.detailed
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
              formatter: percentagePlain.detailed
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
              formatter: number.perSecond.compact
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
              formatter: number.compact
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>
      <Columize>
        <DashboardSection title={t('in-sap:dashboards.icm')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['icminfodatastats.curConn', 'icminfodatastats.curQueue', 'icminfodatastats.curThr'],
              labels: [t('in-sap:dashboards.curConn'), t('in-sap:dashboards.curQueue'), t('in-sap:dashboards.curThr')],
              type: 'line',
              formatter: number.compact
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-sap:dashboards.loginAttempts')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['sapMetricsStats.successLogins', 'sapMetricsStats.failedLogins'],
              labels: [t('in-sap:dashboards.successLogins'), t('in-sap:dashboards.failureLogins')],
              type: 'line',
              formatter: number.detailed,
              // @ts-expect-error Module needs to be translated to TS
              colors: [[themes.default.ids.color.option.green['500']], [themes.default.ids.color.option.red['700']]]
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-sap:dashboards.systemLogErrors')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['sapMetricsStats.concernedSystemLogCount', 'sapMetricsStats.urgentSystemLogCount'],
              labels: [t('in-sap:dashboards.severity1'), t('in-sap:dashboards.severity2')],
              type: 'line',
              // @ts-expect-error Module needs to be translated to TS
              colors: [[themes.default.ids.color.option.red['700']], [themes.default.ids.color.option.orange['500']]],
              formatter: number.compact
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>
      <Columize>
        <DashboardSection title={t('in-sap:dashboards.workLoadOverview')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: [
                'workLoadStats.dialogResponseTime',
                'workLoadStats.updateResponseTime',
                'workLoadStats.enqueueResponseTime',
                'workLoadStats.bckgrdResponseTime',
                'workLoadStats.spoolResponseTime',
                'workLoadStats.update2ResponseTime',
                'workLoadStats.rfcResponseTime',
                'workLoadStats.httpResponseTime',
                'workLoadStats.httpsResponseTime'
              ],
              labels: [
                t('in-sap:dashboards.dialogRespTime'),
                t('in-sap:dashboards.updateRespTime'),
                t('in-sap:dashboards.enqueueRespTime'),
                t('in-sap:dashboards.bckgrdRespTime'),
                t('in-sap:dashboards.spoolRespTime'),
                t('in-sap:dashboards.update2RespTime'),
                t('in-sap:dashboards.rfcRespTime'),
                t('in-sap:dashboards.httpRespTime'),
                t('in-sap:dashboards.httpsRespTime')
              ],
              type: 'line',
              formatter: millis.detailed
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-sap:dashboards.avgWorkLoadOverview')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: [
                'workLoadStats.avgDialogResponseTime',
                'workLoadStats.avgUpdateResponseTime',
                'workLoadStats.avgEnqueueResponseTime',
                'workLoadStats.avgBckgrdResponseTime',
                'workLoadStats.avgSpoolResponseTime',
                'workLoadStats.avgUpdate2ResponseTime',
                'workLoadStats.avgRfcResponseTime',
                'workLoadStats.avgHttpResponseTime',
                'workLoadStats.avgHttpsResponseTime'
              ],
              labels: [
                t('in-sap:dashboards.dialogRespTime'),
                t('in-sap:dashboards.updateRespTime'),
                t('in-sap:dashboards.enqueueRespTime'),
                t('in-sap:dashboards.bckgrdRespTime'),
                t('in-sap:dashboards.spoolRespTime'),
                t('in-sap:dashboards.update2RespTime'),
                t('in-sap:dashboards.rfcRespTime'),
                t('in-sap:dashboards.httpRespTime'),
                t('in-sap:dashboards.httpsRespTime')
              ],
              type: 'line',
              formatter: millis.detailed
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>
      <AbapShortDumps snapshotId={snapshotId} timeConfig={timeConfig} />
    </Fragment>
  );
}
