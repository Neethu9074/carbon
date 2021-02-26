/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import React from 'react';

import { number, percentagePlainTwoDecimalPlaces, bytesTwoDecimalPlaces } from 'in-services/formatters/number';
import DatabaseTable from 'in-forge/plugins/azureSqlServer/Dashboard/DatabaseTable.js';
import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import Columize from 'in-sdk/components/dashboard/Columize';
import MetricValue from 'in-components/MetricValue';

export default function AzureSqlElasticPoolDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');

  return (
    <div>
      <KpiSection>
        <KpiKeyValue label={t('in-forge:plugins.azureSqlElasticPool.dashboard.labelCPU')}>
          <MetricValue
            snapshotId={snapshotId}
            metric="metrics.cpu_percent"
            formatter={percentagePlainTwoDecimalPlaces}
          />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.azureSqlElasticPool.dashboard.labelEDTU')}>
          <MetricValue
            snapshotId={snapshotId}
            metric="metrics.dtu_consumption_percent"
            formatter={percentagePlainTwoDecimalPlaces}
          />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.azureSqlElasticPool.dashboard.labelStorage')}>
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
        <DashboardSection title={t('in-forge:plugins.azureSqlElasticPool.dashboard.titleEDTU')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              formatter: number.detailed,
              metrics: ['metrics.eDTU_limit', 'metrics.eDTU_used'],
              labels: [
                t('in-forge:plugins.azureSqlElasticPool.dashboard.labelEDTULimit'),
                t('in-forge:plugins.azureSqlElasticPool.dashboard.labelEDTUUsed')
              ],
              type: 'line'
            }}
            y2={{
              formatter: percentagePlainTwoDecimalPlaces,
              metrics: ['metrics.dtu_consumption_percent'],
              labels: [t('in-forge:plugins.azureSqlElasticPool.dashboard.labelEDTUPercentage')],
              type: 'bar'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      )}

      <DashboardSection title={t('in-forge:plugins.azureSqlElasticPool.dashboard.titleStorage')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            formatter: bytesTwoDecimalPlaces,
            metrics: ['metrics.storage_limit', 'metrics.storage_used'],
            labels: [
              t('in-forge:plugins.azureSqlElasticPool.dashboard.labelStorageLimit'),
              t('in-forge:plugins.azureSqlElasticPool.dashboard.labelStorageUsed')
            ],
            type: 'line'
          }}
          y2={{
            formatter: percentagePlainTwoDecimalPlaces,
            metrics: ['metrics.storage_percent'],
            labels: [t('in-forge:plugins.azureSqlElasticPool.dashboard.labelStoragePercentage')],
            type: 'bar'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title={t('in-forge:plugins.azureSqlElasticPool.dashboard.titleCPU')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            formatter: percentagePlainTwoDecimalPlaces,
            metrics: ['metrics.cpu_percent'],
            labels: [t('in-forge:plugins.azureSqlElasticPool.dashboard.labelCPUPercentage')],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title={t('in-forge:plugins.azureSqlElasticPool.dashboard.titleIO')}>
        <Columize>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              formatter: percentagePlainTwoDecimalPlaces,
              metrics: ['metrics.physical_data_read_percent'],
              labels: [t('in-forge:plugins.azureSqlElasticPool.dashboard.labelDataIO')],
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
              labels: [t('in-forge:plugins.azureSqlElasticPool.dashboard.labelLogIO')],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </Columize>
      </DashboardSection>

      <DashboardSection title={t('in-forge:plugins.azureSqlElasticPool.dashboard.titleWorkers')}>
        <Columize>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              formatter: percentagePlainTwoDecimalPlaces,
              metrics: ['metrics.workers_percent'],
              labels: [t('in-forge:plugins.azureSqlElasticPool.dashboard.labelWorkers')],
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
              labels: [t('in-forge:plugins.azureSqlElasticPool.dashboard.labelSessions')],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </Columize>
      </DashboardSection>

      <DashboardSection title={t('in-forge:plugins.azureSqlElasticPool.dashboard.titleInMemoryOLTP')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            formatter: percentagePlainTwoDecimalPlaces,
            metrics: ['metrics.xtp_storage_percent'],
            labels: [t('in-forge:plugins.azureSqlElasticPool.dashboard.labelInMemoryOLTPStorage')],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      {snapshot
        .get('data')
        .get('kind')
        .includes('vcore') && (
        <DashboardSection title={t('in-forge:plugins.azureSqlElasticPool.dashboard.titleVCore')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              formatter: number.detailed,
              metrics: ['metrics.cpu_limit', 'metrics.cpu_used'],
              labels: [
                t('in-forge:plugins.azureSqlElasticPool.dashboard.labelCPULimit'),
                t('in-forge:plugins.azureSqlElasticPool.dashboard.labelCPUUsed')
              ],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      )}

      <DatabaseTable snapshot={snapshot} timeConfig={timeConfig} />
    </div>
  );
}
