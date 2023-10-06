/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { number, bytes, percentagePlainTwoDecimalPlaces, seconds } from 'in-services/formatters/number';
import NodesTable from 'in-forge/plugins/awsRedshiftCluster/Dashboard/NodesTable.js';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import { KpiKeyValue, KpiSection } from 'in-sdk/components/dashboard/KpiSection';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import MetricValue from 'in-components/MetricValue';
import { t } from 'in-i18n';

export default function AwsRedshiftClusterDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');

  return (
    <div>
      <KpiSection>
        <KpiKeyValue label={t('in-forge:plugins.awsRedshiftCluster.dashboard.cpuUtilization')}>
          <MetricValue snapshotId={snapshotId} metric="cpu_utilization" formatter={percentagePlainTwoDecimalPlaces} />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.awsRedshiftCluster.dashboard.clusterHealth')}>
          <MetricValue snapshotId={snapshotId} metric="health_status" formatter={number.compact} />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.awsRedshiftCluster.dashboard.readLatency')}>
          <MetricValue snapshotId={snapshotId} metric="read_latency" formatter={seconds.fixedCompact} />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.awsRedshiftCluster.dashboard.writeLatency')}>
          <MetricValue snapshotId={snapshotId} metric="write_latency" formatter={seconds.fixedCompact} />
        </KpiKeyValue>
      </KpiSection>
      <DashboardSection title={t('in-forge:plugins.awsRedshiftCluster.dashboard.cpuUtilization')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['cpu_utilization'],
            labels: [t('in-forge:plugins.awsRedshiftCluster.dashboard.used')],
            formatter: percentagePlainTwoDecimalPlaces,
            type: 'line'
          }}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.awsRedshiftCluster.dashboard.clusterHealth')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['health_status'],
            labels: [t('in-forge:plugins.awsRedshiftCluster.dashboard.clusterHealth')],
            formatter: number.compact,
            type: 'line'
          }}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.awsRedshiftCluster.dashboard.latency')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['read_latency', 'write_latency'],
            labels: [
              t('in-forge:plugins.awsRedshiftCluster.dashboard.read'),
              t('in-forge:plugins.awsRedshiftCluster.dashboard.write')
            ],
            formatter: seconds.fixedCompact,
            type: 'line'
          }}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.awsRedshiftCluster.dashboard.throughput')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['read_throughput', 'write_throughput'],
            labels: [
              t('in-forge:plugins.awsRedshiftCluster.dashboard.read'),
              t('in-forge:plugins.awsRedshiftCluster.dashboard.write')
            ],
            formatter: bytes.perSecond.compact,
            type: 'line'
          }}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.awsRedshiftCluster.dashboard.iops')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['read_iops', 'write_iops'],
            labels: [
              t('in-forge:plugins.awsRedshiftCluster.dashboard.read'),
              t('in-forge:plugins.awsRedshiftCluster.dashboard.write')
            ],
            formatter: number.perSecond.compact,
            type: 'line'
          }}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.awsRedshiftCluster.dashboard.databaseConnection')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['database_connections'],
            labels: [t('in-forge:plugins.awsRedshiftCluster.dashboard.count')],
            formatter: number.compact,
            type: 'line'
          }}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.awsRedshiftCluster.dashboard.storageUsed')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['percentage_disk_space_used'],
            labels: [t('in-forge:plugins.awsRedshiftCluster.dashboard.diskUsed')],
            formatter: percentagePlainTwoDecimalPlaces,
            type: 'line'
          }}
        />
      </DashboardSection>
      <NodesTable clusterSnapshotId={snapshotId} timeConfig={timeConfig} />
    </div>
  );
}
