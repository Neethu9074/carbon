/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { Fragment } from 'react';

import { useObservable } from '@instana/hooks';

// @ts-expect-error Module needs to be translated to TS
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import { nanos, number, twoDecimalPlacesPerSecond, megaBytes, bytes } from 'in-services/formatters/number';
import DiskUsageKPI from 'in-sap/Dashboards/SapJavaNetWeaverInstanceSensor/tabs/DiskUsageKPI';
import UpTimeKPI from 'in-sap/Dashboards/SapJavaNetWeaverInstanceSensor/tabs/upTime';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { productAreas } from 'in-services/tracking/productAreas';
import { SnapshotData, getSnapshot } from 'in-stores/snapshot';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import Columize from 'in-sdk/components/dashboard/Columize';
import { pageNames } from 'in-services/tracking/pageNames';
import { percentage } from 'in-services/formatters/number';
import KpiCard from 'in-components/KpiCard/KpiCard';
import MetricValue from 'in-components/MetricValue';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { t } from 'in-i18n';

export default function Summary({ data }: { data: SnapshotData }) {
  const timeConfig = useTimeConfig();
  const snapshotId = data.id;
  const snapshot = useObservable(getSnapshot(snapshotId, timeConfig), [snapshotId, timeConfig]);

  if (!snapshot) {
    return null;
  }
  return (
    <Fragment>
      <ViewTrackingMeta
        data={{
          productArea: productAreas.sap,
          pageRootName: pageNames.sap_java_instance
        }}
      />
      <Columize>
        <UpTimeKPI data={data} />
        <KpiCard title={t('in-sap:dashboards.cpuUsageKpi')}>
          <MetricValue snapshotId={snapshotId} metric={'customMetrics.kpi.cpuUsage'} formatter={percentage.detailed} />
        </KpiCard>
        <KpiCard title={t('in-sap:dashboards.memoryUsageKpi')}>
          <MetricValue
            snapshotId={snapshotId}
            metric={'customMetrics.kpi.memoryUsage'}
            formatter={percentage.detailed}
          />
        </KpiCard>
        <DiskUsageKPI data={data} />
      </Columize>
      <Columize>
        <KpiCard title={t('in-sap:dashboards.userLogins')}>
          <MetricValue
            snapshotId={snapshotId}
            metric={'customMetrics.session.loggedInUsers'}
            formatter={number.compact}
          />
        </KpiCard>
        <KpiCard title={t('in-sap:dashboards.systemLoadAverage')}>
          <MetricValue
            snapshotId={snapshotId}
            metric={'customMetrics.kpi.systemLoadAverage'}
            formatter={percentage.detailed}
          />
        </KpiCard>
        <KpiCard title={t('in-sap:dashboards.systemProblems')}>
          <MetricValue snapshotId={snapshotId} metric={'customMetrics.kpi.systemProblems'} formatter={number.compact} />
        </KpiCard>
        <KpiCard title={t('in-sap:dashboards.gcProblems')}>
          <MetricValue snapshotId={snapshotId} metric={'customMetrics.kpi.gcProblems'} formatter={number.compact} />
        </KpiCard>
      </Columize>
      <Columize>
        <DashboardSection title={t('in-sap:dashboards.cpuUsage')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              formatter: percentage.detailed,
              metrics: ['customMetrics.kpi.cpuUsage'],
              labels: [t('in-sap:dashboards.cpuUsage')],
              type: 'area'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-sap:dashboards.memoryMetrics')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              formatter: megaBytes.detailed,
              metrics: ['customMetrics.memory.allocated', 'customMetrics.memory.used'],
              labels: [t('in-sap:dashboards.allocated'), t('in-sap:dashboards.used')],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>
      <Columize>
        <DashboardSection title={t('in-sap:dashboards.diskSpace')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              formatter: number.detailed,
              metrics: ['customMetrics.disk.totalDiskSpace', 'customMetrics.disk.freeDiskSpace'],
              labels: [t('in-sap:dashboards.totalDiskSpace'), t('in-sap:dashboards.freeDiskSpace')],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-sap:dashboards.sessions')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              formatter: number.compact,
              metrics: [
                'customMetrics.session.loggedInUsers',
                'customMetrics.session.ejbSession',
                'customMetrics.session.securitySession',
                'customMetrics.session.activeWebSessionCount'
              ],
              labels: [
                t('in-sap:dashboards.loggedInUsers'),
                t('in-sap:dashboards.ejbSession'),
                t('in-sap:dashboards.securitySession'),
                t('in-sap:dashboards.activeWebSessionCount')
              ],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>
      <Columize>
        <DashboardSection title={t('in-sap:dashboards.threadMetrics')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              formatter: number.compact,
              metrics: [
                'customMetrics.thread.threadCount',
                'customMetrics.thread.totalStartedThreadCount',
                'customMetrics.thread.peakThreadCount',
                'customMetrics.thread.daemonThreadCount'
              ],
              labels: [
                t('in-sap:dashboards.threadCount'),
                t('in-sap:dashboards.totalStartedThreadCount'),
                t('in-sap:dashboards.peakThreadCount'),
                t('in-sap:dashboards.daemonThreadCount')
              ],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-sap:dashboards.threadTime')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              metrics: ['customMetrics.thread.current.threadCpuTime', 'customMetrics.thread.current.threadUserTime'],
              labels: [t('in-sap:dashboards.threadCpuTime'), t('in-sap:dashboards.threadUserTime')],
              type: 'line',
              formatter: nanos.compact
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>
      <Columize>
        <DashboardSection title={t('in-sap:dashboards.transactionMetrics')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              formatter: number.compact,
              metrics: [
                'customMetrics.transaction.committedTransactions',
                'customMetrics.transaction.openTransactions',
                'customMetrics.transaction.rolledBackTransactions',
                'customMetrics.transaction.suspendedTransactions',
                'customMetrics.transaction.timeoutTransactions'
              ],
              labels: [
                t('in-sap:dashboards.commitedTransactions'),
                t('in-sap:dashboards.openTransactions'),
                t('in-sap:dashboards.rolledBackTransactions'),
                t('in-sap:dashboards.suspendedTransactions'),
                t('in-sap:dashboards.timeoutTransactions')
              ],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-sap:dashboards.usage')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              formatter: percentage.detailed,
              metrics: ['customMetrics.usage.threadPoolUsage', 'customMetrics.usage.waitingTaskUsage'],
              labels: [t('in-sap:dashboards.threadPoolUsage'), t('in-sap:dashboards.waitingTaskUsage')],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>
      <Columize>
        <DashboardSection title={t('in-sap:dashboards.httpCount')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              formatter: number.compact,
              metrics: ['customMetrics.http.getRequestCount', 'customMetrics.http.postRequestCount'],
              labels: [t('in-sap:dashboards.getRequestCount'), t('in-sap:dashboards.postRequestCount')],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-sap:dashboards.externalIO')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              formatter: bytes.detailed,
              metrics: ['customMetrics.external.averageRFCIO', 'customMetrics.external.averageWebserviceIO'],
              labels: [t('in-sap:dashboards.averageRFCIO'), t('in-sap:dashboards.averageWebserviceIO')],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>
      <Columize>
        <DashboardSection title={t('in-sap:dashboards.logMessage')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              formatter: number.compact,
              metrics: [
                'customMetrics.logMessage.all',
                'customMetrics.logMessage.debug',
                'customMetrics.logMessage.error',
                'customMetrics.logMessage.fatal',
                'customMetrics.logMessage.info',
                'customMetrics.logMessage.warning'
              ],
              labels: [
                t('in-sap:dashboards.all'),
                t('in-sap:dashboards.debug'),
                t('in-sap:dashboards.logMessageError'),
                t('in-sap:dashboards.fatal'),
                t('in-sap:dashboards.info'),
                t('in-sap:dashboards.warning')
              ],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-sap:dashboards.jms')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              formatter: number.compact,
              metrics: ['customMetrics.jms.connection', 'customMetrics.jms.consumer', 'customMetrics.jms.producer'],
              labels: [
                t('in-sap:dashboards.connection'),
                t('in-sap:dashboards.consumer'),
                t('in-sap:dashboards.producer')
              ],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>
      <Columize>
        <DashboardSection title={t('in-sap:dashboards.calls')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              formatter: number.compact,
              metrics: ['customMetrics.external.rfcCalls', 'customMetrics.external.webserviceCalls'],
              labels: [t('in-sap:dashboards.rfcCalls'), t('in-sap:dashboards.webserviceCalls')],
              type: 'area'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-sap:dashboards.httpRequest')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              formatter: number.compact,
              metrics: ['customMetrics.http.totalRequest'],
              labels: [t('in-sap:dashboards.total')],
              type: 'line'
            }}
            y2={{
              formatter: twoDecimalPlacesPerSecond,
              metrics: ['customMetrics.http.requestFrequency'],
              labels: [t('in-sap:dashboards.requestFrequency')],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>
      <Columize>
        <DashboardSection title={t('in-sap:dashboards.applicationThreadCount')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              formatter: number.compact,
              metrics: [
                'customMetrics.applicationThread.activeCount',
                'customMetrics.applicationThread.waitingTaskCount'
              ],
              labels: [t('in-sap:dashboards.activeCount'), t('in-sap:dashboards.waitingTaskCount')],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-sap:dashboards.applicationThreadUsage')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              formatter: percentage.detailed,
              metrics: [
                'customMetrics.applicationThread.threadUsage',
                'customMetrics.applicationThread.waitingtaskUsage'
              ],
              labels: [t('in-sap:dashboards.threadUsage'), t('in-sap:dashboards.waitingtaskUsage')],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>
    </Fragment>
  );
}
