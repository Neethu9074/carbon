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
import { t } from 'in-i18n';

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
        <DashboardSection title={t('in-forge:plugins.googleCloudSQL.dashboard.cpu')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['database.cpu.reserved_cores', 'database.cpu.usage_time'],
              labels: [
                t('in-forge:plugins.googleCloudSQL.dashboard.reservedCores'),
                t('in-forge:plugins.googleCloudSQL.dashboard.usageTimeS')
              ],
              type: 'line',
              formatter: number.detailed
            }}
            y2={{
              min: 0,
              metrics: ['cpu.used'],
              labels: [t('in-forge:plugins.googleCloudSQL.dashboard.utilization')],
              type: 'line',
              formatter: percentageTwoDecimalPlaces
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.googleCloudSQL.dashboard.memory')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['database.memory.quota', 'database.memory.usage'],
              labels: [
                t('in-forge:plugins.googleCloudSQL.dashboard.ramSize'),
                t('in-forge:plugins.googleCloudSQL.dashboard.usage')
              ],
              type: 'line',
              formatter: bytesZeroDecimalPlaces
            }}
            y2={{
              min: 0,
              metrics: ['memory.used'],
              labels: [t('in-forge:plugins.googleCloudSQL.dashboard.utilization')],
              type: 'line',
              formatter: percentageTwoDecimalPlaces
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>
      <Columize>
        <DashboardSection title={t('in-forge:plugins.googleCloudSQL.dashboard.disk')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['database.disk.bytes_used', 'database.disk.quota'],
              labels: [
                t('in-forge:plugins.googleCloudSQL.dashboard.used'),
                t('in-forge:plugins.googleCloudSQL.dashboard.quota')
              ],
              type: 'line',
              formatter: bytesZeroDecimalPlaces
            }}
            y2={{
              min: 0,
              metrics: ['database.disk.utilization'],
              labels: [t('in-forge:plugins.googleCloudSQL.dashboard.utilization')],
              type: 'line',
              formatter: percentageTwoDecimalPlaces
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.googleCloudSQL.dashboard.diskOps')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['database.disk.read_ops_count', 'database.disk.write_ops_count'],
              labels: [
                t('in-forge:plugins.googleCloudSQL.dashboard.readOps'),
                t('in-forge:plugins.googleCloudSQL.dashboard.writeOps')
              ],
              type: 'line',
              formatter: number.compact
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>
      <Columize>
        <DashboardSection title={t('in-forge:plugins.googleCloudSQL.dashboard.network')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['database.network.received_bytes_count', 'database.network.sent_bytes_count'],
              labels: [
                t('in-forge:plugins.googleCloudSQL.dashboard.received'),
                t('in-forge:plugins.googleCloudSQL.dashboard.sent')
              ],
              type: 'line',
              formatter: bytesZeroDecimalPlaces
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.googleCloudSQL.dashboard.failover')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['database.available_for_failover'],
              labels: [t('in-forge:plugins.googleCloudSQL.dashboard.availableForFailover')],
              type: 'line',
              formatter: number.compact
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>
      {isMysql && (
        <Columize>
          <DashboardSection title={t('in-forge:plugins.googleCloudSQL.dashboard.mySql')}>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                metrics: ['database.mysql.queries', 'database.mysql.questions', 'database.network.connections'],
                labels: [
                  t('in-forge:plugins.googleCloudSQL.dashboard.queries'),
                  t('in-forge:plugins.googleCloudSQL.dashboard.questions'),
                  t('in-forge:plugins.googleCloudSQL.dashboard.connections')
                ],
                type: 'line',
                formatter: number.compact
              }}
              y2={{
                min: 0,
                metrics: ['database.mysql.sent_bytes_count', 'database.mysql.received_bytes_count'],
                labels: [
                  t('in-forge:plugins.googleCloudSQL.dashboard.sentData'),
                  t('in-forge:plugins.googleCloudSQL.dashboard.receivedData')
                ],
                type: 'line',
                formatter: bytesZeroDecimalPlaces
              }}
              renderPostChartContent={PluginDashboardsMarkerLanes}
            />
          </DashboardSection>
          {isReplica && (
            <DashboardSection title={t('in-forge:plugins.googleCloudSQL.dashboard.mySqlReplication')}>
              <Chart
                snapshotId={snapshotId}
                timeConfig={timeConfig}
                y1={{
                  min: 0,
                  metrics: ['database.mysql.replication.seconds_behind_master'],
                  labels: [t('in-forge:plugins.googleCloudSQL.dashboard.secondsBehindMaster')],
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
          <DashboardSection title={t('in-forge:plugins.googleCloudSQL.dashboard.innodbPool')}>
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
                labels: [
                  t('in-forge:plugins.googleCloudSQL.dashboard.unflushedPages'),
                  t('in-forge:plugins.googleCloudSQL.dashboard.unusedPages'),
                  t('in-forge:plugins.googleCloudSQL.dashboard.total')
                ],
                type: 'line',
                formatter: number.compact
              }}
              renderPostChartContent={PluginDashboardsMarkerLanes}
            />
          </DashboardSection>
          <DashboardSection title={t('in-forge:plugins.googleCloudSQL.dashboard.innoDb')}>
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
                labels: [
                  t('in-forge:plugins.googleCloudSQL.dashboard.fsyncCalls'),
                  t('in-forge:plugins.googleCloudSQL.dashboard.fsyncCallsToTheLog'),
                  t('in-forge:plugins.googleCloudSQL.dashboard.pagesRead'),
                  t('in-forge:plugins.googleCloudSQL.dashboard.pagesWritten')
                ],
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
          <DashboardSection title={t('in-forge:plugins.googleCloudSQL.dashboard.postgreSql')}>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                metrics: ['database.postgresql.num_backends', 'database.postgresql.transaction_count'],
                labels: [
                  t('in-forge:plugins.googleCloudSQL.dashboard.numberOfConnections'),
                  t('in-forge:plugins.googleCloudSQL.dashboard.transactionCount')
                ],
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
