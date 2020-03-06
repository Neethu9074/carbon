import React from 'react';

import ContainersTable from 'in-forge/plugins/db2Database/Dashboard/ContainersTable';
// import DatabasesTable from 'in-forge/plugins/db2Database/Dashboard/DatabasesTable'
import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import DashboardNotification from 'in-components/DashboardNotification';
import { number, millis, bytes } from 'in-services/formatters/number';
import Columize from 'in-sdk/components/dashboard/Columize';
import { emptyList } from 'in-services/fixedImmutables';
import MetricValue from 'in-components/MetricValue';

export default function Db2Dashboard({ snapshot, timeConfig }) {
  const data = snapshot.get('data');
  const sensorConnectionStatus = data.get('sensorConnectionStatus', 'OK');
  if (sensorConnectionStatus !== 'OK') {
    return <DashboardNotification type="info">{sensorConnectionStatus}</DashboardNotification>;
  }
  const snapshotId = snapshot.get('id');

  return (
    <div>
      <KpiSection>
        {/*<KpiKeyValue label="Queries">*/}
        {/*  <MetricValue snapshotId={snapshotId} metric="queries" formatter={number.compact} />*/}
        {/*</KpiKeyValue>*/}
        {/*<KpiKeyValue label="Status">*/}
        {/*  <MetricValue snapshotId={snapshotId} metric="status" formatter={number.compact} />*/}
        {/*</KpiKeyValue>*/}
        <KpiKeyValue label="Client Connections">
          <MetricValue snapshotId={snapshotId} metric="databaseStats.connectionsCount" formatter={number.compact} />
        </KpiKeyValue>
      </KpiSection>

      <DashboardSection title="Connections">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['databaseStats.connectionsCount'],
            labels: ['Count'],
            formatter: number.compact,
            type: 'line'
          }}
        />
      </DashboardSection>
      <Columize>
        <DashboardSection title="Rows">
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['databaseStats.rowsRead', 'databaseStats.rowsReturned'],
              labels: ['Read', 'Rows'],
              type: 'line',
              formatter: number.detailed
            }}
          />
        </DashboardSection>
        <DashboardSection title="Commits/Rollbacks">
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['databaseStats.commits', 'databaseStats.rollbacks'],
              labels: ['Commits', 'Rollbacks'],
              type: 'line',
              formatter: number.detailed
            }}
          />
        </DashboardSection>
      </Columize>
      <DashboardSection title="Statements">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['databaseStats.selectQueries', 'databaseStats.mergeQueries'],
            labels: ['SELECTS', 'MERGES'],
            type: 'line',
            formatter: number.compact
          }}
          y2={{
            min: 0,
            metrics: ['databaseStats.ddlQueries', 'databaseStats.uidQueries', 'databaseStats.xQueries'],
            labels: ['DDLS', 'UIDS', 'XQUERIES'],
            type: 'line',
            formatter: number.compact
          }}
          y3={{
            min: 0,
            metrics: ['databaseStats.dynamicQueries', 'databaseStats.staticQueries', 'databaseStats.failedQueries'],
            labels: ['Dynamic', 'Static', 'Failed'],
            type: 'line',
            formatter: number.compact
          }}
        />
      </DashboardSection>
      <DashboardSection title="Queries">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['databaseStats.staticQueries', 'databaseStats.dynamicQueries', 'databaseStats.failedQueries'],
            labels: ['Static', 'Dynamic', 'Failed'],
            type: 'line',
            formatter: number.detailed
          }}
        />
      </DashboardSection>
      <DashboardSection title="Buffer Pool Data Pages">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: [
              'bufferPoolStats.poolDataWrites',
              'bufferPoolStats.poolDataPhysicalReads',
              'bufferPoolStats.poolDataLogicalReads',
              'bufferPoolStats.poolTemporaryDataPhysicalReads',
              'bufferPoolStats.poolTemporaryDataLogicalReads'
            ],
            labels: ['Physical Writes', 'Physical Reads', 'Logical Reads', 'Temp Physical Reads', 'Temp Logical Reads'],
            type: 'line',
            formatter: number.detailed
          }}
        />
      </DashboardSection>
      <DashboardSection title="Buffer Pool Index Pages">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: [
              'bufferPoolStats.poolIndexWrites',
              'bufferPoolStats.reads.physical',
              'bufferPoolStats.poolIndexLogicalReads',
              'bufferPoolStats.reads.tempPhysical',
              'bufferPoolStats.poolTemporaryDataLogicalReads'
            ],
            labels: ['Physical Writes', 'Physical Reads', 'Logical Reads', 'Temp Physical Reads', 'Temp Logical Reads'],
            type: 'line',
            formatter: number.detailed
          }}
        />
      </DashboardSection>
      <DashboardSection title="Buffer Pool XDA">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: [
              'bufferPoolStats.poolXdaDataWrites',
              'bufferPoolStats.poolXdaDataPhysicalReads',
              'bufferPoolStats.poolXdaDataLogicalReads',
              'bufferPoolStats.reads.poolTemporaryXdaDataPhysicalReads',
              'bufferPoolStats.poolTemporaryXdaDataLogicalReads'
            ],
            labels: ['Physical Writes', 'Physical Reads', 'Logical Reads', 'Temp Physical Reads', 'Temp Logical Reads'],
            type: 'line',
            formatter: number.detailed
          }}
        />
      </DashboardSection>

      <DashboardSection title="Buffer Pool Time">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['bufferPoolStats.poolPhysicalReadTime', 'bufferPoolStats.poolPhysicalWriteTime'],
            labels: ['Read', 'Write'],
            type: 'line',
            formatter: millis.detailed
          }}
        />
      </DashboardSection>

      <Columize>
        <DashboardSection title="Log Space">
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['logStats.totalLogAvailable', 'logStats.totalLogsUsed'],
              labels: ['Available', 'Used'],
              type: 'line',
              formatter: bytes.detailed
            }}
          />
        </DashboardSection>
        <DashboardSection title="Log IO">
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['logStats.logReadsIO', 'logStats.logWritesIO'],
              labels: ['Reads', 'Writes'],
              type: 'line',
              formatter: number.detailed
            }}
          />
        </DashboardSection>
      </Columize>

      <DashboardSection title="Log">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['logStats.logReads', 'logStats.logWrites'],
            labels: ['Reads', 'Writes'],
            type: 'line',
            formatter: number.detailed
          }}
          y2={{
            min: 0,
            metrics: ['logStats.logReadTime', 'logStats.logWriteTime'],
            labels: ['Read Time', 'Write Time'],
            type: 'line',
            formatter: millis.detailed
          }}
        />
      </DashboardSection>

      {/*{data.get('containerNames', emptyList).size > 0 && <DatabasesTable snapshot={snapshot} timeConfig={timeConfig} />}*/}
      {data.get('containerNames', emptyList).size > 0 && (
        <ContainersTable snapshot={snapshot} timeConfig={timeConfig} />
      )}
    </div>
  );
}
