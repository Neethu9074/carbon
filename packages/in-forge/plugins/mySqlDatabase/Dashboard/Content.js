/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import DBmarlinNotificationMessage from 'in-forge/plugins/awsRds/Dashboard/DBmarlinNotificationMessage';
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
import { t, Trans } from 'in-i18n';

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
    t('in-forge:plugins.mySqlDatabase.ioFile'),
    t('in-forge:plugins.mySqlDatabase.ioSocket'),
    t('in-forge:plugins.mySqlDatabase.ioTable'),
    t('in-forge:plugins.mySqlDatabase.lockTable'),
    t('in-forge:plugins.mySqlDatabase.synchCond'),
    t('in-forge:plugins.mySqlDatabase.synchMutex'),
    t('in-forge:plugins.mySqlDatabase.synchRwlock')
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
        <KpiKeyValue label={t('in-forge:plugins.mySqlDatabase.queries')}>
          <MetricValue snapshotId={snapshotId} metric="status.QUERIES" formatter={number.compact} />
        </KpiKeyValue>
        {performanceDataAvailable ? (
          <KpiKeyValue label={t('in-forge:plugins.mySqlDatabase.averageQueryLatency')}>
            <MetricValue snapshotId={snapshotId} metric="status.DB_QUERY_LATENCY" formatter={millis.compact} />
          </KpiKeyValue>
        ) : null}
        <KpiKeyValue label={t('in-forge:plugins.mySqlDatabase.threadsConnected')}>
          <MetricValue snapshotId={snapshotId} metric="status.THREADS_CONNECTED" formatter={number.compact} />
        </KpiKeyValue>
      </KpiSection>

      {snapshot.getIn(['data', 'role']) === 'slave' && (
        <DashboardSection title={t('in-forge:plugins.mySqlDatabase.replication')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['replica.seconds_behind_master'],
              labels: [t('in-forge:plugins.mySqlDatabase.secondsBehindSource')],
              type: 'line',
              formatter: seconds.fixedCompact
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      )}

      <DashboardSection title={t('in-forge:plugins.mySqlDatabase.queries')}>
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
            labels: [
              t('in-forge:plugins.mySqlDatabase.selects'),
              t('in-forge:plugins.mySqlDatabase.updates'),
              t('in-forge:plugins.mySqlDatabase.inserts'),
              t('in-forge:plugins.mySqlDatabase.deletes'),
              t('in-forge:plugins.mySqlDatabase.other')
            ],
            formatter: number.compact,
            type: 'stackedArea'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title={t('in-forge:plugins.mySqlDatabase.slowQueries')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['status.SLOW_QUERIES', 'status.COM_SHOW_ERRORS'],
            labels: [t('in-forge:plugins.mySqlDatabase.slowQueries'), t('in-forge:plugins.mySqlDatabase.errors')],
            type: 'line',
            formatter: number.detailed
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      {performanceDataAvailable ? (
        <DashboardSection title={t('in-forge:plugins.mySqlDatabase.latency')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['status.DB_QUERY_LATENCY'],
              labels: [t('in-forge:plugins.mySqlDatabase.averageQueryLatency')],
              type: 'line',
              formatter: millis.detailed
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      ) : null}
      <DashboardSection title={t('in-forge:plugins.mySqlDatabase.clients')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['status.THREADS_CONNECTED', 'status.MAX_USED_CONNECTIONS', 'status.ABORTED_CONNECTS'],
            labels: [
              t('in-forge:plugins.mySqlDatabase.threadsCconnected'),
              t('in-forge:plugins.mySqlDatabase.maxUsedConnections'),
              t('in-forge:plugins.mySqlDatabase.abortedConnects')
            ],
            type: 'line',
            formatter: number.compact
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      {performanceDataAvailable ? (
        <DashboardSection title={t('in-forge:plugins.mySqlDatabase.waitEvents')}>
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
      <DashboardSection title={t('in-forge:plugins.mySqlDatabase.keyAccess')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['status.KEY_READ_REQUESTS', 'status.KEY_WRITE_REQUESTS'],
            labels: [
              t('in-forge:plugins.mySqlDatabase.readRequests'),
              t('in-forge:plugins.mySqlDatabase.writeRequests')
            ],
            type: 'line',
            formatter: number.detailed
          }}
          y2={{
            min: 0,
            metrics: ['status.KEY_READS', 'status.KEY_WRITES'],
            labels: [t('in-forge:plugins.mySqlDatabase.reads'), t('in-forge:plugins.mySqlDatabase.writes')],
            type: 'line',
            formatter: number.detailed
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      {performanceDataAvailable && data.get('dbs', emptyList).size > 0 ? (
        <DatabasesTable snapshot={snapshot} timeConfig={timeConfig} />
      ) : null}

      <DBmarlinNotificationMessage />
    </div>
  );
}

function getPerformanceSchemaHint(snapshot) {
  const sensorPerformanceSchemaStatus = snapshot.getIn(['data', 'sensorPerformanceSchemaStatus']);

  if (sensorPerformanceSchemaStatus !== 'OK') {
    return (
      <DashboardNotification type="info">
        <Trans
          i18nKey="in-forge:plugins.mySqlDatabase.instanaMySqlSensorConfigurationHelp"
          values={{ sensorPerformanceSchemaStatus }}
          components={{
            mysqlConfig: (
              <a
                href="https://instana.com/docs/ecosystem/mysql/#configuration"
                rel="noopener noreferrer"
                target="_blank"
              />
            )
          }}
        />
      </DashboardNotification>
    );
  }
  return null;
}
