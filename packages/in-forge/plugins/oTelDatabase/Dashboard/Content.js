/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import CustomMetricsV2, { AVAILABLE_SPECS } from 'in-sdk/components/dashboard/CustomMetricsV2';
import SequentialScanTable from 'in-forge/plugins/oTelDatabase/Dashboard/SequentialScanTable';
import ElapsedTimeTable from 'in-forge/plugins/oTelDatabase/Dashboard/ElapsedTimeTable';
import { number, bytesTwoDecimalPlaces, seconds } from 'in-services/formatters/number';
import TableSpaceTable from 'in-forge/plugins/oTelDatabase/Dashboard/TableSpaceTable';
import LockCountTable from 'in-forge/plugins/oTelDatabase/Dashboard/LockCountTable';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import { WINDOW_FOR_LATEST_METRIC } from 'in-forge/plugins/oTelDatabase/constants';
import DatabaseTable from 'in-forge/plugins/oTelDatabase/Dashboard/DatabaseTable';
import CacheHitTable from 'in-forge/plugins/oTelDatabase/Dashboard/CacheHitTable';
import LockTimeTable from 'in-forge/plugins/oTelDatabase/Dashboard/LockTimeTable';
import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import OTelDatabaseList from 'in-forge/plugins/oTelDatabase/OTelDatabaseList';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import DiskTable from 'in-forge/plugins/oTelDatabase/Dashboard/DiskTable';
import Columize from 'in-sdk/components/dashboard/Columize';
import MetricValue from 'in-components/MetricValue';
import { t } from 'in-i18n';

export default function OTelDatabaseDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');
  const metricIds = snapshot.get('metricIds');

  return (
    <div>
      <KpiSection>
        {metricIds.includes('db.instance.active.count') && metricIds.includes('db.instance.count') === true && (
          <KpiKeyValue
            label={
              t('in-forge:plugins.oTelDatabase.dashboard.instanceActive') +
              ' / ' +
              t('in-forge:plugins.oTelDatabase.dashboard.instance')
            }
          >
            <MetricValue
              snapshotId={snapshotId}
              metric="db.instance.active.count"
              formatter={number.compact}
              windowForLatest={WINDOW_FOR_LATEST_METRIC}
            />
            &nbsp;/&nbsp;
            <MetricValue
              snapshotId={snapshotId}
              metric="db.instance.count"
              formatter={number.compact}
              windowForLatest={WINDOW_FOR_LATEST_METRIC}
            />
          </KpiKeyValue>
        )}
        {metricIds.includes('db.session.active.count') && metricIds.includes('db.session.count') === true && (
          <KpiKeyValue
            label={
              t('in-forge:plugins.oTelDatabase.dashboard.sessionActive') +
              ' / ' +
              t('in-forge:plugins.oTelDatabase.dashboard.session')
            }
          >
            <MetricValue
              snapshotId={snapshotId}
              metric="db.session.active.count"
              formatter={number.compact}
              windowForLatest={WINDOW_FOR_LATEST_METRIC}
            />
            &nbsp;/&nbsp;
            <MetricValue
              snapshotId={snapshotId}
              metric="db.session.count"
              formatter={number.compact}
              windowForLatest={WINDOW_FOR_LATEST_METRIC}
            />
          </KpiKeyValue>
        )}
      </KpiSection>
      <KpiSection>
        {metricIds.includes('db.transaction.count') === true && (
          <KpiKeyValue label={t('in-forge:plugins.oTelDatabase.dashboard.transaction')}>
            <MetricValue
              snapshotId={snapshotId}
              metric="db.transaction.count"
              formatter={number.compact}
              windowForLatest={WINDOW_FOR_LATEST_METRIC}
            />
          </KpiKeyValue>
        )}
        {metricIds.includes('db.transaction.rate') === true && (
          <KpiKeyValue label={t('in-forge:plugins.oTelDatabase.dashboard.tps')}>
            <MetricValue
              snapshotId={snapshotId}
              metric="db.transaction.rate"
              formatter={number.detailed}
              windowForLatest={WINDOW_FOR_LATEST_METRIC}
            />
          </KpiKeyValue>
        )}
        {metricIds.includes('db.sql.count') === true && (
          <KpiKeyValue label={t('in-forge:plugins.oTelDatabase.dashboard.sql')}>
            <MetricValue
              snapshotId={snapshotId}
              metric="db.sql.count"
              formatter={number.compact}
              windowForLatest={WINDOW_FOR_LATEST_METRIC}
            />
          </KpiKeyValue>
        )}
        {metricIds.includes('db.sql.rate') === true && (
          <KpiKeyValue label={t('in-forge:plugins.oTelDatabase.dashboard.sqlPerSecond')}>
            <MetricValue
              snapshotId={snapshotId}
              metric="db.sql.rate"
              formatter={number.detailed}
              windowForLatest={WINDOW_FOR_LATEST_METRIC}
            />
          </KpiKeyValue>
        )}
      </KpiSection>
      <KpiSection>
        {metricIds.includes('db.overflow.lock.count') === true && (
          <KpiKeyValue label={t('in-forge:plugins.oTelDatabase.dashboard.overflowLockCount')}>
            <MetricValue snapshotId={snapshotId} metric="db.overflow.lock.count" formatter={number.compact} />
          </KpiKeyValue>
        )}
        {metricIds.includes('db.overflow.transaction.count') === true && (
          <KpiKeyValue label={t('in-forge:plugins.oTelDatabase.dashboard.overflowTransactionCount')}>
            <MetricValue snapshotId={snapshotId} metric="db.overflow.transaction.count" formatter={number.compact} />
          </KpiKeyValue>
        )}
        {metricIds.includes('db.overflow.user.count') === true && (
          <KpiKeyValue label={t('in-forge:plugins.oTelDatabase.dashboard.overflowUserCount')}>
            <MetricValue snapshotId={snapshotId} metric="db.overflow.user.count" formatter={number.compact} />
          </KpiKeyValue>
        )}
      </KpiSection>
      <Columize>
        {metricIds.includes('db.session.count') && metricIds.includes('db.session.active.count') === true && (
          <DashboardSection title={t('in-forge:plugins.oTelDatabase.dashboard.sessions')}>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                formatter: number.compact,
                metrics: ['db.session.count', 'db.session.active.count'],
                labels: [
                  t('in-forge:plugins.oTelDatabase.dashboard.total'),
                  t('in-forge:plugins.oTelDatabase.dashboard.active')
                ],
                type: 'line'
              }}
              renderPostChartContent={PluginDashboardsMarkerLanes}
            />
          </DashboardSection>
        )}
      </Columize>
      <Columize>
        {metricIds.includes('db.transaction.count') && metricIds.includes('db.transaction.latency') === true && (
          <DashboardSection title={t('in-forge:plugins.oTelDatabase.dashboard.transaction')}>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                formatter: number.compact,
                metrics: ['db.transaction.count'],
                labels: [t('in-forge:plugins.oTelDatabase.dashboard.transactionCount')],
                type: 'line'
              }}
              y2={{
                min: 0,
                formatter: seconds.detailed,
                metrics: ['db.transaction.latency'],
                labels: [t('in-forge:plugins.oTelDatabase.dashboard.averageLatency')],
                type: 'line'
              }}
              renderPostChartContent={PluginDashboardsMarkerLanes}
            />
          </DashboardSection>
        )}
        {metricIds.includes('db.transaction.rate') === true && (
          <DashboardSection title={t('in-forge:plugins.oTelDatabase.dashboard.tps')}>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                formatter: number.detailed,
                metrics: ['db.transaction.rate'],
                labels: [t('in-forge:plugins.oTelDatabase.dashboard.tps')],
                type: 'line'
              }}
              renderPostChartContent={PluginDashboardsMarkerLanes}
            />
          </DashboardSection>
        )}
      </Columize>
      <Columize>
        {metricIds.includes('db.sql.count') === true && (
          <DashboardSection title={t('in-forge:plugins.oTelDatabase.dashboard.sql')}>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                formatter: number.compact,
                metrics: ['db.sql.count'],
                labels: [t('in-forge:plugins.oTelDatabase.dashboard.sqlCount')],
                type: 'line'
              }}
              renderPostChartContent={PluginDashboardsMarkerLanes}
            />
          </DashboardSection>
        )}
        {metricIds.includes('db.sql.rate') === true && (
          <DashboardSection title={t('in-forge:plugins.oTelDatabase.dashboard.sqlPerSecond')}>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                formatter: number.detailed,
                metrics: ['db.sql.rate'],
                labels: [t('in-forge:plugins.oTelDatabase.dashboard.sqlPerSecond')],
                type: 'line'
              }}
              renderPostChartContent={PluginDashboardsMarkerLanes}
            />
          </DashboardSection>
        )}
      </Columize>
      <Columize>
        {metricIds.includes('db.seq.scan.table.count') === true && (
          <DashboardSection title={t('in-forge:plugins.oTelDatabase.dashboard.seqScanTableCount')}>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                formatter: number.compact,
                metrics: ['db.seq.scan.table.count'],
                labels: [t('in-forge:plugins.oTelDatabase.dashboard.seqScanTableCount')],
                type: 'line'
              }}
              renderPostChartContent={PluginDashboardsMarkerLanes}
            />
          </DashboardSection>
        )}
        {metricIds.includes('db.overflow.user.count') === true && (
          <DashboardSection title={t('in-forge:plugins.oTelDatabase.dashboard.overflowUserCount')}>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                formatter: number.compact,
                metrics: ['db.overflow.user.count'],
                labels: [t('in-forge:plugins.oTelDatabase.dashboard.overflowUserCount')],
                type: 'line'
              }}
              renderPostChartContent={PluginDashboardsMarkerLanes}
            />
          </DashboardSection>
        )}
      </Columize>
      <Columize>
        {metricIds.includes('db.overflow.lock.count') === true && (
          <DashboardSection title={t('in-forge:plugins.oTelDatabase.dashboard.overflowLockCount')}>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                formatter: number.compact,
                metrics: ['db.overflow.lock.count'],
                labels: [t('in-forge:plugins.oTelDatabase.dashboard.overflowLockCount')],
                type: 'line'
              }}
              renderPostChartContent={PluginDashboardsMarkerLanes}
            />
          </DashboardSection>
        )}
        {metricIds.includes('db.overflow.transaction.count') === true && (
          <DashboardSection title={t('in-forge:plugins.oTelDatabase.dashboard.overflowTransactionCount')}>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                formatter: number.compact,
                metrics: ['db.overflow.transaction.count'],
                labels: [t('in-forge:plugins.oTelDatabase.dashboard.overflowTransactionCount')],
                type: 'line'
              }}
              renderPostChartContent={PluginDashboardsMarkerLanes}
            />
          </DashboardSection>
        )}
      </Columize>
      <Columize>
        {metricIds.includes('db.task.wait_count') && metricIds.includes('db.task.avg_wait_time') === true && (
          <DashboardSection title={t('in-forge:plugins.oTelDatabase.dashboard.task')}>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                formatter: number.compact,
                metrics: ['db.task.wait_count'],
                labels: [t('in-forge:plugins.oTelDatabase.dashboard.taskWait_count')],
                type: 'line'
              }}
              y2={{
                min: 0,
                formatter: number.compact,
                metrics: ['db.task.avg_wait_time'],
                labels: [t('in-forge:plugins.oTelDatabase.dashboard.avg_wait_time')],
                type: 'line'
              }}
              renderPostChartContent={PluginDashboardsMarkerLanes}
            />
          </DashboardSection>
        )}
      </Columize>
      <Columize>
        {metricIds.includes('db.io.read.rate') && metricIds.includes('db.io.write.rate') === true && (
          <DashboardSection title={t('in-forge:plugins.oTelDatabase.dashboard.ioPerSecond')}>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                formatter: bytesTwoDecimalPlaces,
                metrics: ['db.io.read.rate', 'db.io.write.rate'],
                labels: [
                  t('in-forge:plugins.oTelDatabase.dashboard.read'),
                  t('in-forge:plugins.oTelDatabase.dashboard.write')
                ],
                type: 'line'
              }}
              renderPostChartContent={PluginDashboardsMarkerLanes}
            />
          </DashboardSection>
        )}
      </Columize>
      <Columize>
        {metricIds.includes('db.cpu.utilization') === true && (
          <DashboardSection title={t('in-forge:plugins.oTelDatabase.dashboard.cpuUtilization')}>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                formatter: number.detailed,
                metrics: ['db.cpu.utilization'],
                labels: [t('in-forge:plugins.oTelDatabase.dashboard.cpuUtilization')],
                type: 'line'
              }}
              renderPostChartContent={PluginDashboardsMarkerLanes}
            />
          </DashboardSection>
        )}
        {metricIds.includes('db.mem.utilization') === true && (
          <DashboardSection title={t('in-forge:plugins.oTelDatabase.dashboard.memUtilization')}>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                formatter: number.detailed,
                metrics: ['db.mem.utilization'],
                labels: [t('in-forge:plugins.oTelDatabase.dashboard.memUtilization')],
                type: 'line'
              }}
              renderPostChartContent={PluginDashboardsMarkerLanes}
            />
          </DashboardSection>
        )}
      </Columize>

      <Columize>
        {metricIds.includes('db.disk.read.count') === true && (
          <DashboardSection title={t('in-forge:plugins.oTelDatabase.dashboard.diskReadCount')}>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                formatter: number.compact,
                metrics: ['db.disk.read.count'],
                labels: [t('in-forge:plugins.oTelDatabase.dashboard.diskReadCount')],
                type: 'line'
              }}
              renderPostChartContent={PluginDashboardsMarkerLanes}
            />
          </DashboardSection>
        )}
        {metricIds.includes('db.disk.write.count') === true && (
          <DashboardSection title={t('in-forge:plugins.oTelDatabase.dashboard.diskWriteCount')}>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                formatter: number.compact,
                metrics: ['db.disk.write.count'],
                labels: [t('in-forge:plugins.oTelDatabase.dashboard.diskWriteCount')],
                type: 'line'
              }}
              renderPostChartContent={PluginDashboardsMarkerLanes}
            />
          </DashboardSection>
        )}
      </Columize>

      <Columize>
        {(metricIds.includes('db.cache.read.ratio') === true ||
          metricIds.includes('db.cache.write.ratio') === true) && (
          <DashboardSection title={t('in-forge:plugins.oTelDatabase.dashboard.cacheRatio')}>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                formatter: number.compact,
                metrics: ['db.cache.read.ratio', 'db.cache.write.ratio'],
                labels: [
                  t('in-forge:plugins.oTelDatabase.dashboard.cacheReadRatio'),
                  t('in-forge:plugins.oTelDatabase.dashboard.cacheWriteRatio')
                ],
                type: 'line'
              }}
              renderPostChartContent={PluginDashboardsMarkerLanes}
            />
          </DashboardSection>
        )}
      </Columize>

      <Columize>
        {metricIds.includes('db.lru.writes') === true && (
          <DashboardSection title={t('in-forge:plugins.oTelDatabase.dashboard.lruWrites')}>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                formatter: number.detailed,
                metrics: ['db.lru.writes'],
                labels: [t('in-forge:plugins.oTelDatabase.dashboard.lruWrites')],
                type: 'line'
              }}
              renderPostChartContent={PluginDashboardsMarkerLanes}
            />
          </DashboardSection>
        )}
        {metricIds.includes('db.lock.waits') === true && (
          <DashboardSection title={t('in-forge:plugins.oTelDatabase.dashboard.dbLockwaits')}>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                formatter: number.compact,
                metrics: ['db.lock.waits'],
                labels: [t('in-forge:plugins.oTelDatabase.dashboard.dbLockwaits')],
                type: 'line'
              }}
              renderPostChartContent={PluginDashboardsMarkerLanes}
            />
          </DashboardSection>
        )}
      </Columize>

      <DiskTable snapshot={snapshot} timeConfig={timeConfig} />

      <ElapsedTimeTable snapshot={snapshot} timeConfig={timeConfig} />

      <LockTimeTable snapshot={snapshot} timeConfig={timeConfig} />

      <LockCountTable snapshot={snapshot} timeConfig={timeConfig} />

      <CacheHitTable snapshot={snapshot} timeConfig={timeConfig} />

      <TableSpaceTable snapshot={snapshot} timeConfig={timeConfig} />

      <DatabaseTable snapshot={snapshot} timeConfig={timeConfig} />
      <SequentialScanTable snapshot={snapshot} timeConfig={timeConfig} />

      <CustomMetricsV2
        snapshot={snapshot}
        timeConfig={timeConfig}
        titlePrefix={t('in-forge:plugins.oTelDatabase.oTelDatabase')}
        specs={SPECS}
      />
      <OTelDatabaseList snapshotId={snapshotId} />
    </div>
  );
}

export const SPECS = [AVAILABLE_SPECS.GAUGE, AVAILABLE_SPECS.HISTOGRAM, AVAILABLE_SPECS.SUM, AVAILABLE_SPECS.SUMMARY];
