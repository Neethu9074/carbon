import React from 'react';

import {
  number,
  percentagePlainTwoDecimalPlaces,
  zeroDecimalPlaces,
  bytesTwoDecimalPlaces
} from 'in-services/formatters/number';
import DBmarlinNotificationMessage from 'in-integrations/database/dbmarlin/DBmarlinNotificationMessage';
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
        <DashboardSection title="DTU">
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              formatter: number.detailed,
              metrics: ['metrics.dtu_limit', 'metrics.dtu_used'],
              labels: ['DTU Limit', 'DTU Used'],
              type: 'line'
            }}
            y2={{
              formatter: percentagePlainTwoDecimalPlaces,
              metrics: ['metrics.dtu_consumption_percent'],
              labels: ['DTU Percentage'],
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
            metrics: ['metrics.storage'],
            labels: ['Total database size'],
            type: 'line'
          }}
          y2={{
            formatter: percentagePlainTwoDecimalPlaces,
            metrics: ['metrics.storage_percent'],
            labels: ['Database size'],
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

      <DashboardSection title="Connections">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            formatter: zeroDecimalPlaces,
            metrics: ['metrics.connection_successful', 'metrics.connection_failed'],
            labels: ['Successful Connections', 'Failed Connections'],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title="Firewall">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            formatter: zeroDecimalPlaces,
            metrics: ['metrics.blocked_by_firewall'],
            labels: ['Blocked by Firewall'],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title="Deadlocks">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            formatter: zeroDecimalPlaces,
            metrics: ['metrics.deadlock'],
            labels: ['Deadlocks'],
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
        <DashboardSection title="CPU">
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
      <DBmarlinNotificationMessage />
    </div>
  );
}
