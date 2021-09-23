/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { percentagePlainTwoDecimalPlaces, number, megaBytes, kiloBytes } from 'in-services/formatters/number';
import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import Columize from 'in-sdk/components/dashboard/Columize';
import MetricValue from 'in-components/MetricValue';
import { t } from 'in-i18n';

export default function aliCloudMysqlDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');
  return (
    <div>
      <KpiSection>
        <KpiKeyValue label={t('in-forge:plugins.aliCloudMysql.cpuUsage')}>
          <MetricValue snapshotId={snapshotId} metric="CpuUsage" formatter={percentagePlainTwoDecimalPlaces} />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.aliCloudMysql.memoryUsage')}>
          <MetricValue snapshotId={snapshotId} metric="MemoryUsage" formatter={percentagePlainTwoDecimalPlaces} />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.aliCloudMysql.diskUsage')}>
          <MetricValue snapshotId={snapshotId} metric="DiskUsage" formatter={percentagePlainTwoDecimalPlaces} />
        </KpiKeyValue>
      </KpiSection>
      <Columize>
        <DashboardSection title={t('in-forge:plugins.aliCloudMysql.mysqlDiskSizeTitle')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              metrics: ['MySQL_InstanceDiskSize', 'MySQL_DataDiskSize', 'MySQL_LogDiskSize'],
              labels: [
                t('in-forge:plugins.aliCloudMysql.mysqlInstanceDiskSize'),
                t('in-forge:plugins.aliCloudMysql.mysqlDataDiskSize'),
                t('in-forge:plugins.aliCloudMysql.mysqlLogDiskSize')
              ],
              type: 'line',
              formatter: megaBytes.detailed
            }}
            y2={{
              metrics: ['MySQL_OtherDiskSize', 'MySQL_TmpDiskSize'],
              labels: [
                t('in-forge:plugins.aliCloudMysql.mysqlOtherDiskSize'),
                t('in-forge:plugins.aliCloudMysql.mysqlTmpDiskSize')
              ],
              type: 'line',
              formatter: megaBytes.detailed
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.aliCloudMysql.mysqlNetworkTitle')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              metrics: ['MySQL_NetworkInNew', 'MySQL_NetworkOutNew'],
              labels: [
                t('in-forge:plugins.aliCloudMysql.mysqlNetworkInNew'),
                t('in-forge:plugins.aliCloudMysql.mysqlNetworkOutNew')
              ],
              type: 'line',
              formatter: number.perSecend
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>
      <Columize>
        <DashboardSection title={t('in-forge:plugins.aliCloudMysql.mysqlSessionstitle')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              metrics: ['MySQL_ActiveSessions', 'MySQL_Sessions'],
              labels: [
                t('in-forge:plugins.aliCloudMysql.mysqlActiveSessions'),
                t('in-forge:plugins.aliCloudMysql.mysqlTotalSessions')
              ],
              type: 'line',
              formatter: number.detailed
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.aliCloudMysql.mysqlTPSTitle')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              metrics: ['MySQL_QPS', 'MySQL_TPS'],
              labels: [t('in-forge:plugins.aliCloudMysql.mysqlQPS'), t('in-forge:plugins.aliCloudMysql.mysqlTPS')],
              type: 'line',
              formatter: number.perSecend
            }}
            y2={{
              metrics: ['MySQL_IOPS'],
              labels: [t('in-forge:plugins.aliCloudMysql.mysqlIOPS')],
              type: 'line',
              formatter: number.compact
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>
      <Columize>
        <DashboardSection title={t('in-forge:plugins.aliCloudMysql.mysqlThreadsTitle')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              metrics: ['MySQL_ThreadsConnected', 'MySQL_ThreadsRunning'],
              labels: [
                t('in-forge:plugins.aliCloudMysql.mysqlThreadsConnected'),
                t('in-forge:plugins.aliCloudMysql.mysqlThreadsRunning')
              ],
              type: 'line',
              formatter: number.detailed
            }}
            y2={{
              metrics: ['MySQL_SlaveIORunning', 'MySQL_SlaveSQLRunning'],
              labels: [
                t('in-forge:plugins.aliCloudMysql.mysqlSlaveIORunning'),
                t('in-forge:plugins.aliCloudMysql.mysqlSlaveSQLRunning')
              ],
              type: 'line',
              formatter: number.detailed
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.aliCloudMysql.mysqlOperationTitle')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              metrics: [
                'MySQL_ComSelect  ',
                'MySQL_ComInsert',
                'MySQL_ComUpdate',
                'MySQL_ComDelete',
                'MySQL_ComReplace'
              ],
              labels: [
                t('in-forge:plugins.aliCloudMysql.mysqlComSelect'),
                t('in-forge:plugins.aliCloudMysql.mysqlComInsert'),
                t('in-forge:plugins.aliCloudMysql.mysqlComUpdate'),
                t('in-forge:plugins.aliCloudMysql.mysqlComDelete'),
                t('in-forge:plugins.aliCloudMysql.mysqlComReplace')
              ],
              type: 'line',
              formatter: number.perSecend
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>
      <Columize>
        <DashboardSection title={t('in-forge:plugins.aliCloudMysql.mysqlInnoDBTitle')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              metrics: ['MySQL_InnoDBDataRead', 'MySQL_InnoDBDataWritten'],
              labels: [
                t('in-forge:plugins.aliCloudMysql.mysqlInnoDBDataRead'),
                t('in-forge:plugins.aliCloudMysql.mysqlInnoDBDataWritten')
              ],
              type: 'line',
              formatter: kiloBytes.perSecend
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.aliCloudMysql.mysqlInnoDBLogTitle')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              metrics: ['MySQL_InnoDBLogWrites', 'MySQL_InnoDBLogWriteRequests', 'MySQL_InnoDBLogFsync'],
              labels: [
                t('in-forge:plugins.aliCloudMysql.mysqlInnoDBLogWrites'),
                t('in-forge:plugins.aliCloudMysql.mysqlInnoDBLogWriteRequests'),
                t('in-forge:plugins.aliCloudMysql.mysqlInnoDBLogFsync')
              ],
              type: 'line',
              formatter: number.perSecend
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>

        <DashboardSection title={t('in-forge:plugins.aliCloudMysql.mysqlInnoDBRowTitle')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              metrics: [
                'MySQL_InnoDBRowRead',
                'MySQL_InnoDBRowInsert',
                'MySQL_InnoDBRowUpdate',
                'MySQL_InnoDBRowDelete'
              ],
              labels: [
                t('in-forge:plugins.aliCloudMysql.mysqlInnoDBRowRead'),
                t('in-forge:plugins.aliCloudMysql.mysqlInnoDBRowInsert'),
                t('in-forge:plugins.aliCloudMysql.mysqlInnoDBRowUpdate'),
                t('in-forge:plugins.aliCloudMysql.mysqlInnoDBRowDelete')
              ],
              type: 'line',
              formatter: number.perSecend
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>
      <Columize>
        <DashboardSection title={t('in-forge:plugins.aliCloudMysql.mysqlBufferPoolTitle')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              metrics: ['MySQL_IbufUseRatio', 'MySQL_IbufDirtyRatio', 'MySQL_IbufReadHit'],
              labels: [
                t('in-forge:plugins.aliCloudMysql.mysqlIbufUseRatio'),
                t('in-forge:plugins.aliCloudMysql.mysqlIbufDirtyRatio'),
                t('in-forge:plugins.aliCloudMysql.mysqlIbufReadHit')
              ],
              type: 'line',
              formatter: number.compact
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.aliCloudMysql.mysqlBufferPoolOptTitle')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              metrics: ['MySQL_IbufRequestR', 'MySQL_IbufRequestW', 'MySQL_IbufPoolReads'],
              labels: [
                t('in-forge:plugins.aliCloudMysql.mysqIbufRequestR'),
                t('in-forge:plugins.aliCloudMysql.mysqIbufRequestW'),
                t('in-forge:plugins.aliCloudMysql.mysqIbufPoolReads')
              ],
              type: 'line',
              formatter: number.perSecend
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>
    </div>
  );
}
