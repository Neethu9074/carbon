/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import React from 'react';

import {
  number,
  percentagePlainTwoDecimalPlaces,
  zeroDecimalPlaces,
  bytesTwoDecimalPlaces
} from 'in-services/formatters/number';
import DBmarlinNotification from 'in-forge/plugins/awsRds/Dashboard/DBmarlinNotification';
import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import Columize from 'in-sdk/components/dashboard/Columize';
import MetricValue from 'in-components/MetricValue';

export default function AzureSqlDbDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');

  return (
    <div>
      <KpiSection>
        <KpiKeyValue label={t('in-forge:plugins.azureSqlDb.dashboard.labelCPU')}>
          <MetricValue
            snapshotId={snapshotId}
            metric="metrics.cpu_percent"
            formatter={percentagePlainTwoDecimalPlaces}
          />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.azureSqlDb.dashboard.labelEDTU')}>
          <MetricValue
            snapshotId={snapshotId}
            metric="metrics.dtu_consumption_percent"
            formatter={percentagePlainTwoDecimalPlaces}
          />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.azureSqlDb.dashboard.labelStorage')}>
          <MetricValue
            snapshotId={snapshotId}
            metric="metrics.storage_percent"
            formatter={percentagePlainTwoDecimalPlaces}
          />
        </KpiKeyValue>
      </KpiSection>

      {!snapshot
        .get('data')
        .get('kind')
        .includes('vcore') && (
        <DashboardSection title={t('in-forge:plugins.azureSqlDb.dashboard.titleDTU')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              formatter: number.detailed,
              metrics: ['metrics.dtu_limit', 'metrics.dtu_used'],
              labels: [
                t('in-forge:plugins.azureSqlDb.dashboard.labelDTULimit'),
                t('in-forge:plugins.azureSqlDb.dashboard.labelDTUUsed')
              ],
              type: 'line'
            }}
            y2={{
              formatter: percentagePlainTwoDecimalPlaces,
              metrics: ['metrics.dtu_consumption_percent'],
              labels: [t('in-forge:plugins.azureSqlDb.dashboard.labelDTUPercentage')],
              type: 'bar'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      )}

      <DashboardSection title={t('in-forge:plugins.azureSqlDb.dashboard.titleStorage')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            formatter: bytesTwoDecimalPlaces,
            metrics: ['metrics.storage'],
            labels: [t('in-forge:plugins.azureSqlDb.dashboard.labelTotalDatabaseSize')],
            type: 'line'
          }}
          y2={{
            formatter: percentagePlainTwoDecimalPlaces,
            metrics: ['metrics.storage_percent'],
            labels: [t('in-forge:plugins.azureSqlDb.dashboard.labelDatabaseSize')],
            type: 'bar'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title={t('in-forge:plugins.azureSqlDb.dashboard.titleCPU')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            formatter: percentagePlainTwoDecimalPlaces,
            metrics: ['metrics.cpu_percent'],
            labels: [t('in-forge:plugins.azureSqlDb.dashboard.labelCPUPercentage')],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title={t('in-forge:plugins.azureSqlDb.dashboard.titleConnections')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            formatter: zeroDecimalPlaces,
            metrics: ['metrics.connection_successful', 'metrics.connection_failed'],
            labels: [
              t('in-forge:plugins.azureSqlDb.dashboard.labelSuccessful'),
              t('in-forge:plugins.azureSqlDb.dashboard.labelFailed')
            ],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title={t('in-forge:plugins.azureSqlDb.dashboard.titleFirewall')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            formatter: zeroDecimalPlaces,
            metrics: ['metrics.blocked_by_firewall'],
            labels: [t('in-forge:plugins.azureSqlDb.dashboard.labelBlockedByFirewall')],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title={t('in-forge:plugins.azureSqlDb.dashboard.titleDeadlocks')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            formatter: zeroDecimalPlaces,
            metrics: ['metrics.deadlock'],
            labels: [t('in-forge:plugins.azureSqlDb.dashboard.labelDeadlocks')],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title={t('in-forge:plugins.azureSqlDb.dashboard.titleIO')}>
        <Columize>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              formatter: percentagePlainTwoDecimalPlaces,
              metrics: ['metrics.physical_data_read_percent'],
              labels: [t('in-forge:plugins.azureSqlDb.dashboard.labelDataIO')],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />

          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              formatter: percentagePlainTwoDecimalPlaces,
              metrics: ['metrics.log_write_percent'],
              labels: [t('in-forge:plugins.azureSqlDb.dashboard.labelLogIO')],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </Columize>
      </DashboardSection>

      <DashboardSection title={t('in-forge:plugins.azureSqlDb.dashboard.titleWorkers')}>
        <Columize>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              formatter: percentagePlainTwoDecimalPlaces,
              metrics: ['metrics.workers_percent'],
              labels: [t('in-forge:plugins.azureSqlDb.dashboard.labelWorkers')],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />

          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              formatter: percentagePlainTwoDecimalPlaces,
              metrics: ['metrics.sessions_percent'],
              labels: [t('in-forge:plugins.azureSqlDb.dashboard.labelSessions')],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </Columize>
      </DashboardSection>

      <DashboardSection title={t('in-forge:plugins.azureSqlDb.dashboard.titleInMemoryOLTP')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            formatter: percentagePlainTwoDecimalPlaces,
            metrics: ['metrics.xtp_storage_percent'],
            labels: [t('in-forge:plugins.azureSqlDb.dashboard.labelInMemoryOLTPStorage')],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      {snapshot
        .get('data')
        .get('kind')
        .includes('vcore') && (
        <DashboardSection title={t('in-forge:plugins.azureSqlDb.dashboard.titleCPU')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              formatter: number.detailed,
              metrics: ['metrics.cpu_limit', 'metrics.cpu_used'],
              labels: [
                t('in-forge:plugins.azureSqlDb.dashboard.labelCPULimit'),
                t('in-forge:plugins.azureSqlDb.dashboard.labelCPUUsed')
              ],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      )}
      <DBmarlinNotification />
    </div>
  );
}
