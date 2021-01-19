/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
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
        <KpiKeyValue label="CPU">
          <MetricValue
            snapshotId={snapshotId}
            metric="metrics.cpu_percent"
            formatter={percentagePlainTwoDecimalPlaces}
          />
        </KpiKeyValue>
        <KpiKeyValue label="eDTU">
          <MetricValue
            snapshotId={snapshotId}
            metric="metrics.dtu_consumption_percent"
            formatter={percentagePlainTwoDecimalPlaces}
          />
        </KpiKeyValue>
        <KpiKeyValue label="Storage">
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
        <DashboardSection title="eDTU">
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              formatter: number.detailed,
              metrics: ['metrics.eDTU_limit', 'metrics.eDTU_used'],
              labels: ['eDTU Limit', 'eDTU Used'],
              type: 'line'
            }}
            y2={{
              formatter: percentagePlainTwoDecimalPlaces,
              metrics: ['metrics.dtu_consumption_percent'],
              labels: ['eDTU Percentage'],
              type: 'bar'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      )}

      <DashboardSection title="Storage">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            formatter: bytesTwoDecimalPlaces,
            metrics: ['metrics.storage_limit', 'metrics.storage_used'],
            labels: ['Storage Limit', 'Storage Used'],
            type: 'line'
          }}
          y2={{
            formatter: percentagePlainTwoDecimalPlaces,
            metrics: ['metrics.storage_percent'],
            labels: ['Storage percentage'],
            type: 'bar'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title="CPU">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            formatter: percentagePlainTwoDecimalPlaces,
            metrics: ['metrics.cpu_percent'],
            labels: ['CPU percentage'],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title="IO">
        <Columize>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              formatter: percentagePlainTwoDecimalPlaces,
              metrics: ['metrics.physical_data_read_percent'],
              labels: ['Data IO'],
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
              labels: ['Log IO'],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </Columize>
      </DashboardSection>

      <DashboardSection title="Workers/Sessions">
        <Columize>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              formatter: percentagePlainTwoDecimalPlaces,
              metrics: ['metrics.workers_percent'],
              labels: ['Workers'],
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
              labels: ['Sessions'],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </Columize>
      </DashboardSection>

      <DashboardSection title="In-Memory OLTP">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            formatter: percentagePlainTwoDecimalPlaces,
            metrics: ['metrics.xtp_storage_percent'],
            labels: ['In-Memory OLTP storage'],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      {snapshot
        .get('data')
        .get('kind')
        .includes('vcore') && (
        <DashboardSection title="vCore">
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              formatter: number.detailed,
              metrics: ['metrics.cpu_limit', 'metrics.cpu_used'],
              labels: ['CPU Limit', 'CPU Used'],
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
