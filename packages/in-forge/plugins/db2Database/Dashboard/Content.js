import React from 'react';

import ContainersTable from 'in-forge/plugins/db2Database/Dashboard/ContainersTable';
import DatabasesTable from 'in-forge/plugins/db2Database/Dashboard/DatabasesTable';
import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import DashboardNotification from 'in-sdk/components/dashboard/DashboardNotification';
import { number, millis, bytes } from 'in-services/formatters/number';
import Columize from 'in-sdk/components/dashboard/Columize';
import { emptyList } from 'in-services/fixedImmutables';
import MetricValue from 'in-components/MetricValue';

export default function Db2Dashboard({ snapshot, timeConfig }) {
  const data = snapshot.get('data');
  const sensorConnectionStatus = data.get('sensorConnectionStatus', 'OK');
  const statusFormatter = status => {
    switch (status) {
      case 0:
        return 'ACTIVE';
      case 1:
        return 'QUIESCE PENDING';
      case 2:
        return 'QUIESCED';
      case 3:
        return 'ROLLFORWARD IN PROGRESS';
      case 4:
        return 'READ-ENABLED HADR STANDBY DB';
      case 5:
        return 'HADR STANDBY DB';
      default:
        return '-';
    }
  };
  if (sensorConnectionStatus !== 'OK') {
    return <DashboardNotification type="info">{sensorConnectionStatus}</DashboardNotification>;
  }
  const snapshotId = snapshot.get('id');

  return (
    <div>
      <KpiSection>
        <KpiKeyValue label="Queries">
          <MetricValue snapshotId={snapshotId} metric="databases.queries" formatter={number.compact} />
        </KpiKeyValue>
        <KpiKeyValue label="Status">
          <MetricValue snapshotId={snapshotId} metric="databases.status" formatter={statusFormatter} />
        </KpiKeyValue>
        <KpiKeyValue label="Client Connections">
          <MetricValue snapshotId={snapshotId} metric="databases.connectionsCount" formatter={number.compact} />
        </KpiKeyValue>
      </KpiSection>
      <DashboardSection title="Connections">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['databases.connectionsCount'],
            labels: ['Count'],
            formatter: number.compact,
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <Columize>
        <DashboardSection title="Rows">
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['databases.rowsRead', 'databases.rowsReturned'],
              labels: ['Read', 'Returned'],
              type: 'line',
              formatter: number.compact
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title="Commits/Rollbacks">
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['databases.commits', 'databases.rollbacks'],
              labels: ['Commits', 'Rollbacks'],
              type: 'line',
              formatter: number.compact
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>
      <DashboardSection title="Statements">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['databases.selectQueries', 'databases.mergeQueries'],
            labels: ['SELECTS', 'MERGES'],
            type: 'line',
            formatter: number.compact
          }}
          y2={{
            min: 0,
            metrics: ['databases.ddlQueries', 'databases.uidQueries', 'databases.xQueries'],
            labels: ['DDLS', 'UIDS', 'XQUERIES'],
            type: 'line',
            formatter: number.compact
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title="Queries">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['databases.staticQueries', 'databases.dynamicQueries', 'databases.failedQueries'],
            labels: ['Static', 'Dynamic', 'Failed'],
            type: 'line',
            formatter: number.compact
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title="Buffer Pool Data Pages">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: [
              'bufferpools.dataWrites',
              'bufferpools.dataPhysicalReads',
              'bufferpools.dataLogicalReads',
              'bufferpools.temporaryDataPhysicalReads',
              'bufferpools.temporaryDataLogicalReads'
            ],
            labels: ['Physical Writes', 'Physical Reads', 'Logical Reads', 'Temp Physical Reads', 'Temp Logical Reads'],
            type: 'line',
            formatter: number.compact
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title="Buffer Pool Index Pages">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: [
              'bufferpools.indexWrites',
              'bufferpools.indexPhysicalReads',
              'bufferpools.indexLogicalReads',
              'bufferpools.temporaryIndexPhysicalReads',
              'bufferpools.temporaryIndexLogicalReads'
            ],
            labels: ['Physical Writes', 'Physical Reads', 'Logical Reads', 'Temp Physical Reads', 'Temp Logical Reads'],
            type: 'line',
            formatter: number.compact
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title="Buffer Pool XDA">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: [
              'bufferpools.xdaDataWrites',
              'bufferpools.xdaDataPhysicalReads',
              'bufferpools.xdaDataLogicalReads',
              'bufferpools.temporaryXdaDataPhysicalReads',
              'bufferpools.temporaryXdaDataLogicalReads'
            ],
            labels: ['Physical Writes', 'Physical Reads', 'Logical Reads', 'Temp Physical Reads', 'Temp Logical Reads'],
            type: 'line',
            formatter: number.compact
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title="Buffer Pool Time">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['bufferpools.physicalReadTime', 'bufferpools.physicalWriteTime'],
            labels: ['Read', 'Write'],
            type: 'line',
            formatter: millis.detailed
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <Columize>
        <DashboardSection title="Log Space">
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['logs.available', 'logs.used'],
              labels: ['Available', 'Used'],
              type: 'line',
              formatter: bytes.detailed
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title="Log IO">
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['logs.readsIO', 'logs.writesIO'],
              labels: ['Reads', 'Writes'],
              type: 'line',
              formatter: number.compact
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>
      <DashboardSection title="Log">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['logs.reads', 'logs.writes'],
            labels: ['Reads', 'Writes'],
            type: 'line',
            formatter: number.compact
          }}
          y2={{
            min: 0,
            metrics: ['logs.readTime', 'logs.writeTime'],
            labels: ['Read Time', 'Write Time'],
            type: 'line',
            formatter: millis.detailed
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      {data.get('databaseNames', emptyList).size > 0 && <DatabasesTable snapshot={snapshot} timeConfig={timeConfig} />}

      {data.get('containerNames', emptyList).size > 0 && (
        <ContainersTable snapshot={snapshot} timeConfig={timeConfig} />
      )}
    </div>
  );
}
