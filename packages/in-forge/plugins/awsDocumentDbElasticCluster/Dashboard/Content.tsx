/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { TimeConfig } from '@instana/types';

import { number, percentagePlainTwoDecimalPlaces, bytes } from 'in-services/formatters/number';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Columize from 'in-sdk/components/dashboard/Columize';
import { SnapshotData } from 'in-stores/snapshot/snapshot';
import MetricValue from 'in-components/MetricValue';
import { t } from 'in-i18n';

export default function awsDocumentDbElasticClusterDashboard({
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
        <KpiKeyValue label={t('in-forge:plugins.awsDocumentDbElasticCluster.dashboard.cpuUtilization')}>
          <MetricValue snapshotId={snapshotId} metric="cpu_utilization" formatter={percentagePlainTwoDecimalPlaces} />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.awsDocumentDbElasticCluster.dashboard.databaseConnections')}>
          <MetricValue snapshotId={snapshotId} metric="database_connections" formatter={number.compact} />
        </KpiKeyValue>
      </KpiSection>
      <Columize>
        <DashboardSection title={t('in-forge:plugins.awsDocumentDbElasticCluster.dashboard.cpuUtilization')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              metrics: ['cpu_utilization'],
              labels: [t('in-forge:plugins.awsDocumentDbElasticCluster.dashboard.utilization')],
              formatter: percentagePlainTwoDecimalPlaces,
              type: 'line'
            }}
          />
        </DashboardSection>
      </Columize>

      <Columize>
        <DashboardSection title={t('in-forge:plugins.awsDocumentDbElasticCluster.dashboard.databaseConnections')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              metrics: ['database_connections'],
              labels: [t('in-forge:plugins.awsDocumentDbElasticCluster.dashboard.count')],
              formatter: number.compact,
              type: 'line'
            }}
          />
        </DashboardSection>
      </Columize>
      <Columize>
        <DashboardSection title={t('in-forge:plugins.awsDocumentDbElasticCluster.dashboard.documents')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              metrics: ['documents_deleted', 'documents_updated'],
              labels: [
                t('in-forge:plugins.awsDocumentDbElasticCluster.dashboard.deleted'),
                t('in-forge:plugins.awsDocumentDbElasticCluster.dashboard.updated')
              ],
              formatter: number.compact,
              type: 'line'
            }}
            y2={{
              metrics: ['documents_inserted', 'documents_returned'],
              labels: [
                t('in-forge:plugins.awsDocumentDbElasticCluster.dashboard.inserted'),
                t('in-forge:plugins.awsDocumentDbElasticCluster.dashboard.returned')
              ],
              formatter: number.compact,
              type: 'line'
            }}
          />
        </DashboardSection>
      </Columize>

      <Columize>
        <DashboardSection title={t('in-forge:plugins.awsDocumentDbElasticCluster.dashboard.iops')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              metrics: ['volume_read_iops', 'volume_write_iops'],
              labels: [
                t('in-forge:plugins.awsDocumentDbElasticCluster.dashboard.readIops'),
                t('in-forge:plugins.awsDocumentDbElasticCluster.dashboard.writeIops')
              ],
              formatter: number.perSecond.compact,
              type: 'line'
            }}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.awsDocumentDbElasticCluster.dashboard.throughput')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              metrics: ['read_throughput', 'write_throughput'],
              labels: [
                t('in-forge:plugins.awsDocumentDbElasticCluster.dashboard.read'),
                t('in-forge:plugins.awsDocumentDbElasticCluster.dashboard.write')
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
