import React from 'react';

import DBmarlinNotification from 'in-forge/plugins/awsRds/Dashboard/DBmarlinNotification';
import DashboardNotification from 'in-sdk/components/dashboard/DashboardNotification';
import DatabasesTable from 'in-forge/plugins/mySqlDatabase/Dashboard/DatabasesTable';
import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import { isPerformanceDataAvailable } from 'in-forge/plugins/mySqlDatabase/util';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { number, millis, seconds } from 'in-services/formatters/number';
import { emptyList } from 'in-services/fixedImmutables';
import MetricValue from 'in-components/MetricValue';

const msFormatter = d => (d < 0 ? 'No activity' : millis.detailed(d));

export default function MySqlDashboard({ snapshot, timeConfig }) {
  const data = snapshot.get('data');
  const sensorConnectionStatus = data.get('sensorConnectionStatus', 'OK');
  const waitEventMetrics = [
    'wait/io/file',
    'wait/io/socket',
    'wait/io/table',
    'wait/lock/table',
    'wait/synch/cond',
    'wait/synch/mutex',
    'wait/synch/rwlock'
  ];
  const waitEventLabels = [
    'io file',
    'io socket',
    'io table',
    'lock table',
    'synch cond',
    'synch mutex',
    'synch rwlock'
  ];
  if (sensorConnectionStatus !== 'OK') {
    return <DashboardNotification type="info">{sensorConnectionStatus}</DashboardNotification>;
  }

  const snapshotId = snapshot.get('id');
  const performanceDataAvailable = isPerformanceDataAvailable(snapshot);

  return (
    <div>
      {getPerformanceSchemaHint(snapshot)}
      <KpiSection>
        <KpiKeyValue label="Queries">
          <MetricValue snapshotId={snapshotId} metric="status.QUERIES" formatter={number.compact} />
        </KpiKeyValue>
        {performanceDataAvailable ? (
          <KpiKeyValue label="Average Query Latency">
            <MetricValue snapshotId={snapshotId} metric="status.DB_QUERY_LATENCY" formatter={millis.compact} />
          </KpiKeyValue>
        ) : null}
        <KpiKeyValue label="Client Connections">
          <MetricValue snapshotId={snapshotId} metric="status.THREADS_CONNECTED" formatter={number.compact} />
        </KpiKeyValue>
      </KpiSection>

      {snapshot.getIn(['data', 'role']) === 'slave' && (
        <DashboardSection title="Replication">
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['replica.seconds_behind_master'],
              labels: ['Seconds Behind Source'],
              type: 'line',
              formatter: seconds.fixedCompact
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      )}

      <DashboardSection title="Queries">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: [
              'status.COM_SELECT',
              'status.COM_UPDATE',
              'status.COM_INSERT',
              'status.COM_DELETE',
              'status.COM_OTHER'
            ],
            labels: ['SELECTS', 'UPDATES', 'INSERTS', 'DELETES', 'OTHER'],
            formatter: number.compact,
            type: 'stackedArea'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title="Slow Queries">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['status.SLOW_QUERIES', 'status.COM_SHOW_ERRORS'],
            labels: ['Slow Queries', 'Errors'],
            type: 'line',
            formatter: number.detailed
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      {performanceDataAvailable ? (
        <DashboardSection title="Latency">
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['status.DB_QUERY_LATENCY'],
              labels: ['Average Query Latency'],
              type: 'line',
              formatter: millis.detailed
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      ) : null}
      <DashboardSection title="Clients">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['status.THREADS_CONNECTED', 'status.MAX_USED_CONNECTIONS', 'status.ABORTED_CONNECTS'],
            labels: ['Connections', 'Max used connections', 'Aborted connects'],
            type: 'line',
            formatter: number.compact
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      {performanceDataAvailable ? (
        <DashboardSection title="Wait Events">
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: waitEventMetrics.map(wEv => 'wait_events.' + wEv),
              labels: waitEventLabels,
              type: 'line',
              formatter: msFormatter
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      ) : null}
      <DashboardSection title="Key Access">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['status.KEY_READ_REQUESTS', 'status.KEY_WRITE_REQUESTS'],
            labels: ['Read Requests', 'Write Requests'],
            type: 'line',
            formatter: number.detailed
          }}
          y2={{
            min: 0,
            metrics: ['status.KEY_READS', 'status.KEY_WRITES'],
            labels: ['Reads', 'Writes'],
            type: 'line',
            formatter: number.detailed
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      {performanceDataAvailable && data.get('dbs', emptyList).size > 0 ? (
        <DatabasesTable snapshot={snapshot} timeConfig={timeConfig} />
      ) : null}

      <DBmarlinNotification />
    </div>
  );
}

function getPerformanceSchemaHint(snapshot) {
  const sensorPerformanceSchemaStatus = snapshot.getIn(['data', 'sensorPerformanceSchemaStatus']);

  if (sensorPerformanceSchemaStatus !== 'OK') {
    return (
      <DashboardNotification type="info">
        {sensorPerformanceSchemaStatus} In order to enable Average Query Latency and Wait Events metrics, access to the{' '}
        <code>performance_schema</code> needs to be granted. Please contact us for installation support or refer to the{' '}
        <a href="https://instana.com/docs/ecosystem/mysql/#configuration" rel="noopener noreferrer" target="_blank">
          Instana MySql Sensor configuration
        </a>
        .
      </DashboardNotification>
    );
  }
  return null;
}
