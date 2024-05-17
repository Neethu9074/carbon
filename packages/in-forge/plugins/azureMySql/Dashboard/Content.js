/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import {
  percentagePlainTwoDecimalPlaces,
  zeroDecimalPlaces,
  seconds,
  bytesTwoDecimalPlaces
} from 'in-services/formatters/number';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Columize from 'in-sdk/components/dashboard/Columize';
import MetricValue from 'in-components/MetricValue';
import { t } from 'in-i18n';

export default function AzureMySqlDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');

  return (
    <>
      <KpiSection>
        <KpiKeyValue label={t('in-forge:plugins.azureMySql.kpi.labelCpuPercent')}>
          <MetricValue snapshotId={snapshotId} metric="cpu_percent" formatter={percentagePlainTwoDecimalPlaces} />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.azureMySql.kpi.labelActiveConnections')}>
          <MetricValue snapshotId={snapshotId} metric="active_connections" formatter={zeroDecimalPlaces} />
        </KpiKeyValue>
      </KpiSection>

      <DashboardSection title={t('in-forge:plugins.azureMySql.dashboard.titleServerHost')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            formatter: percentagePlainTwoDecimalPlaces,
            metrics: ['cpu_percent', 'memory_percent'],
            labels: [
              t('in-forge:plugins.azureMySql.dashboard.labelCpuPercent'),
              t('in-forge:plugins.azureMySql.dashboard.labelMemoryPercent')
            ],
            type: 'line',
            min: 0
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title={t('in-forge:plugins.azureMySql.dashboard.titleStorage')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            formatter: bytesTwoDecimalPlaces,
            metrics: ['storage_used', 'storage_limit'],
            labels: [
              t('in-forge:plugins.azureMySql.dashboard.labelStorageUsed'),
              t('in-forge:plugins.azureMySql.dashboard.labelStorageLimit')
            ],
            type: 'line',
            min: 0
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title={t('in-forge:plugins.azureMySql.dashboard.titleStoragePercent')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            formatter: percentagePlainTwoDecimalPlaces,
            metrics: ['storage_percent', 'io_consumption_percent'],
            labels: [
              t('in-forge:plugins.azureMySql.dashboard.labelStoragePercent'),
              t('in-forge:plugins.azureMySql.dashboard.labelIoConsumptionPercent')
            ],
            type: 'line',
            min: 0
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title={t('in-forge:plugins.azureMySql.dashboard.titleNetwork')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            formatter: bytesTwoDecimalPlaces,
            metrics: ['network_bytes_egress', 'network_bytes_ingress'],
            labels: [
              t('in-forge:plugins.azureMySql.dashboard.labelNetworkBytesEgress'),
              t('in-forge:plugins.azureMySql.dashboard.labelNetworkBytesIngress')
            ],
            type: 'line',
            min: 0
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title={t('in-forge:plugins.azureMySql.dashboard.labelConnections')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            formatter: zeroDecimalPlaces,
            metrics: ['active_connections', 'aborted_connections', 'total_connections'],
            labels: [
              t('in-forge:plugins.azureMySql.dashboard.labelActiveConnections'),
              t('in-forge:plugins.azureMySql.dashboard.labelAbortedConnections'),
              t('in-forge:plugins.azureMySql.dashboard.labelTotalConnections')
            ],
            type: 'line',
            min: 0
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title={t('in-forge:plugins.azureMySql.dashboard.titleReplication')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            formatter: seconds.fixedDetailed,
            metrics: ['replication_lag'],
            labels: [t('in-forge:plugins.azureMySql.dashboard.labelReplicationLag')],
            type: 'line',
            min: 0
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <Columize>
        <DashboardSection title={t('in-forge:plugins.azureMySql.dashboard.titleQueries')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              formatter: zeroDecimalPlaces,
              metrics: ['queries'],
              labels: [t('in-forge:plugins.azureMySql.dashboard.labelCount')],
              type: 'line',
              min: 0
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.azureMySql.dashboard.titleSlowQueries')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              formatter: zeroDecimalPlaces,
              metrics: ['slow_queries'],
              labels: [t('in-forge:plugins.azureMySql.dashboard.labelCount')],
              type: 'line',
              min: 0
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>

      <Columize>
        <DashboardSection title={t('in-forge:plugins.azureMySql.dashboard.titleCreateStatements')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              formatter: zeroDecimalPlaces,
              metrics: ['com_create_db', 'com_create_table'],
              labels: [
                t('in-forge:plugins.azureMySql.dashboard.labelCreateDB'),
                t('in-forge:plugins.azureMySql.dashboard.labelCreateTable')
              ],
              type: 'line',
              min: 0
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.azureMySql.dashboard.titleDropStatements')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              formatter: zeroDecimalPlaces,
              metrics: ['com_drop_db', 'com_drop_table'],
              labels: [
                t('in-forge:plugins.azureMySql.dashboard.labelDropDB'),
                t('in-forge:plugins.azureMySql.dashboard.labelDropTable')
              ],
              type: 'line',
              min: 0
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>

      <Columize>
        <DashboardSection title={t('in-forge:plugins.azureMySql.dashboard.titleStatements')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              formatter: zeroDecimalPlaces,
              metrics: ['com_delete', 'com_insert', 'com_select'],
              labels: [
                t('in-forge:plugins.azureMySql.dashboard.labelDelete'),
                t('in-forge:plugins.azureMySql.dashboard.labelInsert'),
                t('in-forge:plugins.azureMySql.dashboard.labelSelect')
              ],
              type: 'line',
              min: 0
            }}
            y2={{
              formatter: zeroDecimalPlaces,
              metrics: ['com_alter_table', 'com_update'],
              labels: [
                t('in-forge:plugins.azureMySql.dashboard.labelAlter'),
                t('in-forge:plugins.azureMySql.dashboard.labelUpdate')
              ],
              type: 'line',
              min: 0
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>
    </>
  );
}
