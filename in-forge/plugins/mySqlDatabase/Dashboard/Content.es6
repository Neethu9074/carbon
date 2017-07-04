import React from 'react';

import { KpiSection, KpiHeading, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import { msZeroDecimalPlaces, msTwoDecimalPlaces, twoDecimalPlaces } from 'in-services/formatters/number';
import { isPerformanceDataAvailable } from 'in-forge/plugins/mySqlDatabase/util';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import DashboardNotification from 'in-components/DashboardNotification';
import ChartWithLegend from 'in-components/ChartWithLegend';
import MetricValue from 'in-components/MetricValue';
import { getLabel } from 'in-sdk/snapshot';

const msFormatter = d => (d < 0 ? 'No activity' : msTwoDecimalPlaces(d));

export default function MySqlDashboard({ snapshot, timeframe }) {
  const data = snapshot.get('data');
  const sensorConnectionStatus = data.get('sensorConnectionStatus', 'OK');
  const waitEvents = [
    'wait/io/file',
    'wait/io/socket',
    'wait/io/table',
    'wait/lock/table',
    'wait/synch/cond',
    'wait/synch/mutex',
    'wait/synch/rwlock'
  ];
  if (sensorConnectionStatus !== 'OK') {
    return (
      <DashboardNotification type="info">
        {sensorConnectionStatus}
      </DashboardNotification>
    );
  }

  const snapshotId = snapshot.get('id');
  const performanceDataAvailable = isPerformanceDataAvailable(snapshot);

  return (
    <div>
      <KpiSection>
        <KpiHeading>
          {getLabel(snapshot)}
        </KpiHeading>
        <KpiKeyValue label="Queries">
          <MetricValue snapshotId={snapshotId} metric="status.QUERIES" />
        </KpiKeyValue>
        <KpiKeyValue label="avg. Query Latency">
          <MetricValue snapshotId={snapshotId} metric="status.DB_QUERY_LATENCY" formatter={msZeroDecimalPlaces} />
        </KpiKeyValue>
        <KpiKeyValue label="Client Connections">
          <MetricValue snapshotId={snapshotId} metric="status.THREADS_CONNECTED" />
        </KpiKeyValue>
      </KpiSection>

      <DashboardSection title="Queries">
        <ChartWithLegend
          snapshotId={snapshotId}
          timeframe={timeframe}
          margins={{
            left: 60
          }}
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
            formatter: twoDecimalPlaces,
            type: 'stackedArea'
          }}
        />
      </DashboardSection>

      <DashboardSection title="Slow Queries">
        <ChartWithLegend
          snapshotId={snapshotId}
          timeframe={timeframe}
          margins={{
            left: 60
          }}
          y1={{
            min: 0,
            metrics: ['status.SLOW_QUERIES', 'status.COM_SHOW_ERRORS'],
            labels: ['Slow Queries', 'Errors'],
            type: 'line',
            formatter: twoDecimalPlaces
          }}
        />
      </DashboardSection>
      {performanceDataAvailable
        ? <DashboardSection title="Latency">
            <ChartWithLegend
              snapshotId={snapshotId}
              timeframe={timeframe}
              margins={{
                left: 60
              }}
              y1={{
                min: 0,
                metrics: ['status.DB_QUERY_LATENCY'],
                labels: ['avg. Query Latency'],
                type: 'line',
                formatter: msZeroDecimalPlaces
              }}
            />
          </DashboardSection>
        : null}
      <DashboardSection title="Clients">
        <ChartWithLegend
          snapshotId={snapshotId}
          timeframe={timeframe}
          margins={{
            left: 60
          }}
          y1={{
            min: 0,
            metrics: ['status.THREADS_CONNECTED', 'status.MAX_USED_CONNECTIONS', 'status.ABORTED_CONNECTS'],
            labels: ['Connections', 'Max used connections', 'Aborted connects'],
            type: 'line',
            formatter: twoDecimalPlaces
          }}
        />
      </DashboardSection>
      {performanceDataAvailable
        ? <DashboardSection title="Wait Events">
            <ChartWithLegend
              snapshotId={snapshotId}
              timeframe={timeframe}
              margins={{
                left: 60
              }}
              y1={{
                min: 0,
                metrics: waitEvents.map(wEv => 'wait_events.' + wEv),
                labels: waitEvents,
                type: 'line',
                formatter: msFormatter
              }}
            />
          </DashboardSection>
        : null}
      <DashboardSection title="Key Access">
        <ChartWithLegend
          snapshotId={snapshotId}
          timeframe={timeframe}
          margins={{
            left: 60,
            right: 60
          }}
          y1={{
            min: 0,
            metrics: ['status.KEY_READ_REQUESTS', 'status.KEY_WRITE_REQUESTS'],
            labels: ['Read Requests', 'Write Requests'],
            type: 'line',
            formatter: twoDecimalPlaces
          }}
          y2={{
            min: 0,
            metrics: ['status.KEY_READS', 'status.KEY_WRITES'],
            labels: ['Reads', 'Writes'],
            type: 'line',
            formatter: twoDecimalPlaces
          }}
        />
      </DashboardSection>
    </div>
  );
}
