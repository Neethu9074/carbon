/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { TimeConfig } from '@instana/types';

// @ts-expect-error Module needs to be translated to TS
import InstancesTable from 'in-forge/plugins/awsDocumentDbCluster/Dashboard/InstancesTable';
import { number, percentagePlainTwoDecimalPlaces, bytes, seconds } from 'in-services/formatters/number';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Columize from 'in-sdk/components/dashboard/Columize';
import { SnapshotData } from 'in-stores/snapshot/snapshot';
import MetricValue from 'in-components/MetricValue';
import { t } from 'in-i18n';

export default function awsDocumentDbClusterDashboard({
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
        <KpiKeyValue label={t('in-forge:plugins.awsDocumentDbCluster.dashboard.cpuUtilization')}>
          <MetricValue snapshotId={snapshotId} metric="cpu_utilization" formatter={percentagePlainTwoDecimalPlaces} />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.awsDocumentDbCluster.dashboard.databaseConnections')}>
          <MetricValue snapshotId={snapshotId} metric="database_connections" formatter={number.compact} />
        </KpiKeyValue>
      </KpiSection>
      <Columize>
        <DashboardSection title={t('in-forge:plugins.awsDocumentDbCluster.dashboard.cpuUtilization')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              metrics: ['cpu_utilization'],
              labels: [t('in-forge:plugins.awsDocumentDbCluster.dashboard.utilization')],
              formatter: percentagePlainTwoDecimalPlaces,
              type: 'line'
            }}
          />
        </DashboardSection>
      </Columize>

      <Columize>
        <DashboardSection title={t('in-forge:plugins.awsDocumentDbCluster.dashboard.databaseConnections')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              metrics: ['database_connections'],
              labels: [t('in-forge:plugins.awsDocumentDbCluster.dashboard.count')],
              formatter: number.compact,
              type: 'line'
            }}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.awsDocumentDbCluster.dashboard.transactionsOpen')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              metrics: ['transactions_open', 'transactions_open_max'],
              labels: [
                t('in-forge:plugins.awsDocumentDbCluster.dashboard.count'),
                t('in-forge:plugins.awsDocumentDbCluster.dashboard.max')
              ],
              formatter: number.compact,
              type: 'line'
            }}
            y2={{
              metrics: ['transactions_open_used'],
              labels: [t('in-forge:plugins.awsDocumentDbCluster.dashboard.used')],
              formatter: percentagePlainTwoDecimalPlaces,
              type: 'line'
            }}
          />
        </DashboardSection>
      </Columize>

      <Columize>
        <DashboardSection title={t('in-forge:plugins.awsDocumentDbCluster.dashboard.latency')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              metrics: ['read_latency', 'write_latency'],
              labels: [
                t('in-forge:plugins.awsDocumentDbCluster.dashboard.read'),
                t('in-forge:plugins.awsDocumentDbCluster.dashboard.write')
              ],
              formatter: seconds.fixedCompact,
              type: 'line'
            }}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.awsDocumentDbCluster.dashboard.dbClusterReplicaLag')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              metrics: ['db_cluster_replica_lag_maximum', 'db_cluster_replica_lag_minimum'],
              labels: [
                t('in-forge:plugins.awsDocumentDbCluster.dashboard.max'),
                t('in-forge:plugins.awsDocumentDbCluster.dashboard.min')
              ],
              formatter: seconds.fixedCompact,
              type: 'line'
            }}
          />
        </DashboardSection>
      </Columize>

      <Columize>
        <DashboardSection title={t('in-forge:plugins.awsDocumentDbCluster.dashboard.documents')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              metrics: ['documents_deleted', 'documents_updated'],
              labels: [
                t('in-forge:plugins.awsDocumentDbCluster.dashboard.deleted'),
                t('in-forge:plugins.awsDocumentDbCluster.dashboard.updated')
              ],
              formatter: number.compact,
              type: 'line'
            }}
            y2={{
              metrics: ['documents_inserted', 'documents_returned'],
              labels: [
                t('in-forge:plugins.awsDocumentDbCluster.dashboard.inserted'),
                t('in-forge:plugins.awsDocumentDbCluster.dashboard.returned')
              ],
              formatter: number.compact,
              type: 'line'
            }}
          />
        </DashboardSection>
      </Columize>
      <Columize>
        <DashboardSection title={t('in-forge:plugins.awsDocumentDbCluster.dashboard.transactions')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              metrics: ['transactions_started', 'transactions_committed', 'transactions_aborted'],
              labels: [
                t('in-forge:plugins.awsDocumentDbCluster.dashboard.started'),
                t('in-forge:plugins.awsDocumentDbCluster.dashboard.committed'),
                t('in-forge:plugins.awsDocumentDbCluster.dashboard.abort')
              ],
              formatter: number.compact,
              type: 'line'
            }}
          />
        </DashboardSection>
      </Columize>
      <Columize>
        <DashboardSection title={t('in-forge:plugins.awsDocumentDbCluster.dashboard.iops')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              metrics: ['volume_read_iops', 'volume_write_iops'],
              labels: [
                t('in-forge:plugins.awsDocumentDbCluster.dashboard.readIops'),
                t('in-forge:plugins.awsDocumentDbCluster.dashboard.writeIops')
              ],
              formatter: number.perSecond.compact,
              type: 'line'
            }}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.awsDocumentDbCluster.dashboard.throughput')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              metrics: ['read_throughput', 'write_throughput'],
              labels: [
                t('in-forge:plugins.awsDocumentDbCluster.dashboard.read'),
                t('in-forge:plugins.awsDocumentDbCluster.dashboard.write')
              ],
              formatter: bytes.perSecond.compact,
              type: 'line'
            }}
          />
        </DashboardSection>
      </Columize>
      <InstancesTable clusterSnapshotId={snapshot.get('id')} timeConfig={timeConfig} />
    </>
  );
}
