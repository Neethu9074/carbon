/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { bytes, number, timeByMillisTwoDecimalPlaces } from 'in-services/formatters/number';
import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import Columize from 'in-sdk/components/dashboard/Columize';
import MetricValue from 'in-components/MetricValue';
import { t } from 'in-i18n';

export default function Db2ZDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');

  return (
    <div>
      <KpiSection>
        <KpiKeyValue label={t('in-forge:plugins.db2ZDatabase.dashboard.activeThreads')}>
          <MetricValue snapshotId={snapshotId} metric="DB2ZLocationStats.threadCount" formatter={number.compact} />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.db2ZDatabase.dashboard.availableMemory')}>
          <MetricValue snapshotId={snapshotId} metric="DB2ZLocationStats.availableMemory" formatter={bytes.compact} />
        </KpiKeyValue>
      </KpiSection>
      <DashboardSection title={t('in-forge:plugins.db2ZDatabase.dashboard.cpuUsage')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: [
              'DB2ZLocationStats.cpuUsageDist',
              'DB2ZLocationStats.cpuUsageMstr',
              'DB2ZLocationStats.cpuUsageDbt',
              'DB2ZLocationStats.cpuUsageIrlm'
            ],
            labels: [
              t('in-forge:plugins.db2ZDatabase.cpuUsageDist'),
              t('in-forge:plugins.db2ZDatabase.cpuUsageMstr'),
              t('in-forge:plugins.db2ZDatabase.cpuUsageDbt'),
              t('in-forge:plugins.db2ZDatabase.cpuUsageIrlm')
            ],
            formatter: timeByMillisTwoDecimalPlaces,
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.db2ZDatabase.dashboard.availableMemory')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['DB2ZLocationStats.availableMemory'],
            labels: [t('in-forge:plugins.db2ZDatabase.memory')],
            formatter: bytes.compact,
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <Columize>
        <DashboardSection title={t('in-forge:plugins.db2ZDatabase.dashboard.commits')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['DB2ZLocationStats.commits'],
              labels: [t('in-forge:plugins.db2ZDatabase.commits')],
              formatter: number.compact,
              colors: ['#34ab71'],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.db2ZDatabase.dashboard.queryCount')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              metrics: [
                'DB2ZLocationStats.selectCount',
                'DB2ZLocationStats.insertCount',
                'DB2ZLocationStats.updateCount',
                'DB2ZLocationStats.deleteCount'
              ],
              labels: [
                t('in-forge:plugins.db2ZDatabase.selectCount'),
                t('in-forge:plugins.db2ZDatabase.insertCount'),
                t('in-forge:plugins.db2ZDatabase.updateCount'),
                t('in-forge:plugins.db2ZDatabase.deleteCount')
              ],
              type: 'stackedBar',
              aggregation: 'sum',
              formatter: number.compact
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>
      <Columize>
        <DashboardSection title={t('in-forge:plugins.db2ZDatabase.dashboard.logWrites')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['DB2ZLocationStats.logWrite'],
              labels: [t('in-forge:plugins.db2ZDatabase.writes')],
              formatter: number.compact,
              type: 'line',
              colors: ['#8257d9']
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.db2ZDatabase.dashboard.lockSuspensions')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              metrics: ['DB2ZLocationStats.lockSuspension'],
              labels: [t('in-forge:plugins.db2ZDatabase.locks')],
              type: 'stackedBar',
              colors: ['#ee4c4c'],
              formatter: number.compact
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>
    </div>
  );
}
