/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import CustomMetricsV2, { AVAILABLE_SPECS } from 'in-sdk/components/dashboard/CustomMetricsV2';
import { number, bytesTwoDecimalPlaces, seconds } from 'in-services/formatters/number';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Columize from 'in-sdk/components/dashboard/Columize';
import MetricValue from 'in-components/MetricValue';
import { t } from 'in-i18n';

export default function OTelDatabaseDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');
  return (
    <div>
      <KpiSection>
        <KpiKeyValue label={t('in-forge:plugins.oTelDatabase.dashboard.session')}>
          <MetricValue snapshotId={snapshot.get('id')} metric="db.session.count" formatter={number.compact} />
        </KpiKeyValue>

        <KpiKeyValue label={t('in-forge:plugins.oTelDatabase.dashboard.transaction')}>
          <MetricValue snapshotId={snapshot.get('id')} metric="db.transaction.count" formatter={number.compact} />
        </KpiKeyValue>

        <KpiKeyValue label={t('in-forge:plugins.oTelDatabase.dashboard.sql')}>
          <MetricValue snapshotId={snapshot.get('id')} metric="db.sql.count" formatter={number.compact} />
        </KpiKeyValue>
      </KpiSection>
      <Columize>
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
      </Columize>
      <Columize>
        <DashboardSection title={t('in-forge:plugins.oTelDatabase.dashboard.transaction')}>
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
      </Columize>
      <Columize>
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
            y2={{
              min: 0,
              formatter: seconds.detailed,
              metrics: ['db.sql.elapsed_time'],
              labels: [t('in-forge:plugins.oTelDatabase.dashboard.elapsed_time')],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>
      <Columize>
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
      </Columize>
      <Columize>
        <DashboardSection title={t('in-forge:plugins.oTelDatabase.dashboard.lockCount')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              formatter: number.compact,
              metrics: ['db.lock.count'],
              labels: [t('in-forge:plugins.oTelDatabase.dashboard.lockCount')],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>
      <Columize>
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
      </Columize>
      <Columize>
        <DashboardSection title={t('in-forge:plugins.oTelDatabase.dashboard.cacheHit')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              formatter: bytesTwoDecimalPlaces,
              metrics: [
                'db.cache.hit_RECYCLE',
                'db.cache.hit_KEEP',
                'db.cache.hit_ROLL',
                'db.cache.hit_FAST',
                'db.cache.hit_NORMAL'
              ],
              labels: [
                t('in-forge:plugins.oTelDatabase.dashboard.cacheHit_Recycle'),
                t('in-forge:plugins.oTelDatabase.dashboard.cacheHit_keep'),
                t('in-forge:plugins.oTelDatabase.dashboard.cacheHit_roll'),
                t('in-forge:plugins.oTelDatabase.dashboard.cacheHit_fast'),
                t('in-forge:plugins.oTelDatabase.dashboard.cacheHit_normal')
              ],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>
      <Columize>
        <DashboardSection title={t('in-forge:plugins.oTelDatabase.dashboard.tableSpace')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              formatter: bytesTwoDecimalPlaces,
              metrics: ['db.tablespace.size', 'db.tablespace.used', 'db.tablespace.utilization', 'db.tablespace.max'],
              labels: [
                t('in-forge:plugins.oTelDatabase.dashboard.tablespaceSize'),
                t('in-forge:plugins.oTelDatabase.dashboard.tablespaceUsed'),
                t('in-forge:plugins.oTelDatabase.dashboard.tablespaceUtilization'),
                t('in-forge:plugins.oTelDatabase.dashboard.tablespaceMax')
              ],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>
      <Columize>
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
      </Columize>
      <CustomMetricsV2
        snapshot={snapshot}
        timeConfig={timeConfig}
        titlePrefix={t('in-forge:plugins.oTelDatabase.oTelDatabase')}
        specs={SPECS}
      />
    </div>
  );
}

export const SPECS = [AVAILABLE_SPECS.GAUGE, AVAILABLE_SPECS.HISTOGRAM, AVAILABLE_SPECS.SUM, AVAILABLE_SPECS.SUMMARY];
