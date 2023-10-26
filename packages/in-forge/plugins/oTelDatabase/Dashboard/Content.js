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
              metrics: ['db.lock.count_OBJECT', 'db.lock.count_TID'],
              labels: [
                t('in-forge:plugins.oTelDatabase.dashboard.lockCountObject'),
                t('in-forge:plugins.oTelDatabase.dashboard.lockCountTid')
              ],
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
        <DashboardSection title={t('in-forge:plugins.oTelDatabase.dashboard.tableSpaceSize')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              formatter: bytesTwoDecimalPlaces,
              metrics: [
                'db.tableSpace.size_SAMPLE',
                'db.tablespace.size_SYSTEM',
                'db.tablespace.size_TEMP',
                'db.tablespace.size_MAIN',
                'db.tablespace.size_ROLL',
                'db.tablespace.size_BOOKSHOP'
              ],
              labels: [
                t('in-forge:plugins.oTelDatabase.dashboard.tableSpaceSample'),
                t('in-forge:plugins.oTelDatabase.dashboard.tableSpaceSystem'),
                t('in-forge:plugins.oTelDatabase.dashboard.tableSpaceTemp'),
                t('in-forge:plugins.oTelDatabase.dashboard.tableSpaceMain'),
                t('in-forge:plugins.oTelDatabase.dashboard.tableSpaceRoll'),
                t('in-forge:plugins.oTelDatabase.dashboard.tableSpaceBookShop')
              ],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.oTelDatabase.dashboard.tableSpaceUsed')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              formatter: bytesTwoDecimalPlaces,
              metrics: [
                'db.tablespace.used_SAMPLE',
                'db.tablespace.used_SYSTEM',
                'db.tablespace.used_TEMP',
                'db.tablespace.used_MAIN',
                'db.tablespace.used_ROLL',
                'db.tablespace.used_BOOKSHOP'
              ],
              labels: [
                t('in-forge:plugins.oTelDatabase.dashboard.tableSpaceSample'),
                t('in-forge:plugins.oTelDatabase.dashboard.tableSpaceSystem'),
                t('in-forge:plugins.oTelDatabase.dashboard.tableSpaceTemp'),
                t('in-forge:plugins.oTelDatabase.dashboard.tableSpaceMain'),
                t('in-forge:plugins.oTelDatabase.dashboard.tableSpaceRoll'),
                t('in-forge:plugins.oTelDatabase.dashboard.tableSpaceBookShop')
              ],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>
      <Columize>
        <DashboardSection title={t('in-forge:plugins.oTelDatabase.dashboard.tableSpaceUtilization')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              formatter: bytesTwoDecimalPlaces,
              metrics: [
                'db.tablespace.utilization_SAMPLE',
                'db.tablespace.utilization_SYSTEM',
                'db.tablespace.utilization_TEMP',
                'db.tablespace.utilization_MAIN',
                'db.tablespace.utilization_ROLL',
                'db.tablespace.utilization_BOOKSHOP'
              ],
              labels: [
                t('in-forge:plugins.oTelDatabase.dashboard.tableSpaceSample'),
                t('in-forge:plugins.oTelDatabase.dashboard.tableSpaceSystem'),
                t('in-forge:plugins.oTelDatabase.dashboard.tableSpaceTemp'),
                t('in-forge:plugins.oTelDatabase.dashboard.tableSpaceMain'),
                t('in-forge:plugins.oTelDatabase.dashboard.tableSpaceRoll'),
                t('in-forge:plugins.oTelDatabase.dashboard.tableSpaceBookShop')
              ],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.oTelDatabase.dashboard.tableSpaceMax')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              formatter: bytesTwoDecimalPlaces,
              metrics: [
                'db.tablespace.max_SAMPLE',
                'db.tablespace.max_SYSTEM',
                'db.tablespace.max_TEMP',
                'db.tablespace.max_MAIN',
                'db.tablespace.max_ROLL',
                'db.tablespace.max_BOOKSHOP'
              ],
              labels: [
                t('in-forge:plugins.oTelDatabase.dashboard.tableSpaceSample'),
                t('in-forge:plugins.oTelDatabase.dashboard.tableSpaceSystem'),
                t('in-forge:plugins.oTelDatabase.dashboard.tableSpaceTemp'),
                t('in-forge:plugins.oTelDatabase.dashboard.tableSpaceMain'),
                t('in-forge:plugins.oTelDatabase.dashboard.tableSpaceRoll'),
                t('in-forge:plugins.oTelDatabase.dashboard.tableSpaceBookShop')
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
