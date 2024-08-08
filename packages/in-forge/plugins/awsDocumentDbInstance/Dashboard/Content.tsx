/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { TimeConfig } from '@instana/types';

import { number, percentagePlainTwoDecimalPlaces, bytes, seconds } from 'in-services/formatters/number';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Columize from 'in-sdk/components/dashboard/Columize';
import { SnapshotData } from 'in-stores/snapshot/snapshot';
import MetricValue from 'in-components/MetricValue';
import { t } from 'in-i18n';

export default function AwsDocumentdbInstanceDashboard({
  snapshot,
  timeConfig
}: {
  snapshot: SnapshotData;
  timeConfig: TimeConfig;
}) {
  const snapshotId = snapshot.get('id');

  return (
    <>
      <KpiSection>
        <KpiKeyValue label={t('in-forge:plugins.awsDocumentDbInstance.dashboard.cpuUtilization')}>
          <MetricValue snapshotId={snapshotId} metric="cpu_utilization" formatter={percentagePlainTwoDecimalPlaces} />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.awsDocumentDbInstance.dashboard.databaseConnections')}>
          <MetricValue snapshotId={snapshotId} metric="database_connections" formatter={number.compact} />
        </KpiKeyValue>
      </KpiSection>
      <Columize>
        <DashboardSection title={t('in-forge:plugins.awsDocumentDbInstance.dashboard.cpuUtilization')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              metrics: ['cpu_utilization'],
              labels: [t('in-forge:plugins.awsDocumentDbInstance.dashboard.utilization')],
              formatter: percentagePlainTwoDecimalPlaces,
              type: 'line'
            }}
          />
        </DashboardSection>
      </Columize>

      <Columize>
        <DashboardSection title={t('in-forge:plugins.awsDocumentDbInstance.dashboard.databaseConnections')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              metrics: ['database_connections', 'database_connections_max'],
              labels: [
                t('in-forge:plugins.awsDocumentDbInstance.dashboard.count'),
                t('in-forge:plugins.awsDocumentDbInstance.dashboard.max')
              ],
              formatter: number.compact,
              type: 'line'
            }}
            y2={{
              metrics: ['database_connections_used'],
              labels: [t('in-forge:plugins.awsDocumentDbInstance.dashboard.used')],
              formatter: percentagePlainTwoDecimalPlaces,
              type: 'line'
            }}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.awsDocumentDbInstance.dashboard.transactionsOpen')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              metrics: ['transactions_open', 'transactions_open_max'],
              labels: [
                t('in-forge:plugins.awsDocumentDbInstance.dashboard.count'),
                t('in-forge:plugins.awsDocumentDbInstance.dashboard.max')
              ],
              formatter: number.compact,
              type: 'line'
            }}
            y2={{
              metrics: ['transactions_open_used'],
              labels: [t('in-forge:plugins.awsDocumentDbInstance.dashboard.used')],
              formatter: percentagePlainTwoDecimalPlaces,
              type: 'line'
            }}
          />
        </DashboardSection>
      </Columize>

      <Columize>
        <DashboardSection title={t('in-forge:plugins.awsDocumentDbInstance.dashboard.latency')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              metrics: ['read_latency', 'write_latency'],
              labels: [
                t('in-forge:plugins.awsDocumentDbInstance.dashboard.read'),
                t('in-forge:plugins.awsDocumentDbInstance.dashboard.write')
              ],
              formatter: seconds.fixedCompact,
              type: 'line'
            }}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.awsDocumentDbInstance.dashboard.dbInstanceReplicaLag')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              metrics: ['db_instance_replica_lag'],
              labels: [t('in-forge:plugins.awsDocumentDbInstance.dashboard.lag')],
              formatter: seconds.fixedCompact,
              type: 'line'
            }}
          />
        </DashboardSection>
      </Columize>

      <Columize>
        <DashboardSection title={t('in-forge:plugins.awsDocumentDbInstance.dashboard.documents')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              metrics: ['documents_deleted', 'documents_updated'],
              labels: [
                t('in-forge:plugins.awsDocumentDbInstance.dashboard.deleted'),
                t('in-forge:plugins.awsDocumentDbInstance.dashboard.updated')
              ],
              formatter: number.compact,
              type: 'line'
            }}
            y2={{
              metrics: ['documents_inserted', 'documents_returned'],
              labels: [
                t('in-forge:plugins.awsDocumentDbInstance.dashboard.inserted'),
                t('in-forge:plugins.awsDocumentDbInstance.dashboard.returned')
              ],
              formatter: number.compact,
              type: 'line'
            }}
          />
        </DashboardSection>
      </Columize>
      <Columize>
        <DashboardSection title={t('in-forge:plugins.awsDocumentDbInstance.dashboard.transactions')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              metrics: ['transactions_started', 'transactions_committed', 'transactions_aborted'],
              labels: [
                t('in-forge:plugins.awsDocumentDbInstance.dashboard.started'),
                t('in-forge:plugins.awsDocumentDbInstance.dashboard.committed'),
                t('in-forge:plugins.awsDocumentDbInstance.dashboard.abort')
              ],
              formatter: number.compact,
              type: 'line'
            }}
          />
        </DashboardSection>
      </Columize>
      <Columize>
        <DashboardSection title={t('in-forge:plugins.awsDocumentDbInstance.dashboard.iops')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              metrics: ['read_iops', 'write_iops'],
              labels: [
                t('in-forge:plugins.awsDocumentDbInstance.dashboard.readIops'),
                t('in-forge:plugins.awsDocumentDbInstance.dashboard.writeIops')
              ],
              formatter: number.perSecond.compact,
              type: 'line'
            }}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.awsDocumentDbInstance.dashboard.throughput')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              metrics: ['read_throughput', 'write_throughput'],
              labels: [
                t('in-forge:plugins.awsDocumentDbInstance.dashboard.read'),
                t('in-forge:plugins.awsDocumentDbInstance.dashboard.write')
              ],
              formatter: bytes.perSecond.compact,
              type: 'line'
            }}
          />
        </DashboardSection>
      </Columize>
    </>
  );
}
