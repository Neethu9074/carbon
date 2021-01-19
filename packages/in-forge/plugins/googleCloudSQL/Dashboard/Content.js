/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { number, bytesZeroDecimalPlaces, percentageTwoDecimalPlaces } from 'in-services/formatters/number';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import Columize from 'in-sdk/components/dashboard/Columize';

export default function GoogleCLoudSQLDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');
  const version = snapshot.getIn(['data', 'databaseVersion'], '');
  const isPostgres = version.includes('POSTGRES');
  const isMysql = version.includes('MYSQL');
  const instanceType = snapshot.getIn(['data', 'instanceType'], '');
  const isReplica = instanceType.includes('REPLICA');

  return (
    <div>
      <Columize>
        <DashboardSection title="CPU">
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['database.cpu.reserved_cores', 'database.cpu.usage_time'],
              labels: ['Reserved cores', 'Usage time (s)'],
              type: 'line',
              formatter: number.detailed
            }}
            y2={{
              min: 0,
              metrics: ['cpu.used'],
              labels: ['Utilization'],
              type: 'line',
              formatter: percentageTwoDecimalPlaces
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title="Memory">
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['database.memory.quota', 'database.memory.usage'],
              labels: ['RAM size', 'Usage'],
              type: 'line',
              formatter: bytesZeroDecimalPlaces
            }}
            y2={{
              min: 0,
              metrics: ['memory.used'],
              labels: ['Utilization'],
              type: 'line',
              formatter: percentageTwoDecimalPlaces
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>
      <Columize>
        <DashboardSection title="Disk">
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['database.disk.bytes_used', 'database.disk.quota'],
              labels: ['Used', 'Quota'],
              type: 'line',
              formatter: bytesZeroDecimalPlaces
            }}
            y2={{
              min: 0,
              metrics: ['database.disk.utilization'],
              labels: ['Utilization'],
              type: 'line',
              formatter: percentageTwoDecimalPlaces
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title="Disk ops">
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['database.disk.read_ops_count', 'database.disk.write_ops_count'],
              labels: ['Read ops', 'Write ops'],
              type: 'line',
              formatter: number.compact
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>
      <Columize>
        <DashboardSection title="Network">
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['database.network.received_bytes_count', 'database.network.sent_bytes_count'],
              labels: ['Received', 'Sent'],
              type: 'line',
              formatter: bytesZeroDecimalPlaces
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title="Failover">
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['database.available_for_failover'],
              labels: ['Available for failover'],
              type: 'line',
              formatter: number.compact
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>
      {isMysql && (
        <Columize>
          <DashboardSection title="MySQL">
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                metrics: ['database.mysql.queries', 'database.mysql.questions', 'database.network.connections'],
                labels: ['Queries', 'Questions', 'Connections'],
                type: 'line',
                formatter: number.compact
              }}
              y2={{
                min: 0,
                metrics: ['database.mysql.sent_bytes_count', 'database.mysql.received_bytes_count'],
                labels: ['Sent data', 'Received data'],
                type: 'line',
                formatter: bytesZeroDecimalPlaces
              }}
              renderPostChartContent={PluginDashboardsMarkerLanes}
            />
          </DashboardSection>
          {isReplica && (
            <DashboardSection title="MySQL replication">
              <Chart
                snapshotId={snapshotId}
                timeConfig={timeConfig}
                y1={{
                  min: 0,
                  metrics: ['database.mysql.replication.seconds_behind_master'],
                  labels: ['Seconds behind master'],
                  type: 'line',
                  formatter: number.compact
                }}
                renderPostChartContent={PluginDashboardsMarkerLanes}
              />
            </DashboardSection>
          )}
        </Columize>
      )}
      {isMysql && (
        <Columize>
          <DashboardSection title="Innodb pool">
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                metrics: [
                  'database.mysql.innodb_buffer_pool_pages_dirty',
                  'database.mysql.innodb_buffer_pool_pages_free',
                  'database.mysql.innodb_buffer_pool_pages_total'
                ],
                labels: ['Unflushed pages', 'Unused pages', 'Total'],
                type: 'line',
                formatter: number.compact
              }}
              renderPostChartContent={PluginDashboardsMarkerLanes}
            />
          </DashboardSection>
          <DashboardSection title="InnoDB">
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                metrics: [
                  'database.mysql.innodb_data_fsyncs',
                  'database.mysql.innodb_os_log_fsyncs',
                  'database.mysql.innodb_pages_read',
                  'database.mysql.innodb_pages_written'
                ],
                labels: ['fsync() calls', 'fsync() calls to the log', 'Pages read', 'Pages written'],
                type: 'line',
                formatter: number.compact
              }}
              renderPostChartContent={PluginDashboardsMarkerLanes}
            />
          </DashboardSection>
        </Columize>
      )}
      <Columize>
        {isPostgres && (
          <DashboardSection title="PostgreSQL">
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                metrics: ['database.postgresql.num_backends', 'database.postgresql.transaction_count'],
                labels: ['Number of connections', 'Transaction count'],
                type: 'line',
                formatter: number.compact
              }}
              renderPostChartContent={PluginDashboardsMarkerLanes}
            />
          </DashboardSection>
        )}
      </Columize>
    </div>
  );
}
