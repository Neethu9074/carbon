/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { number, bytes, percentagePlainTwoDecimalPlaces, seconds } from 'in-services/formatters/number';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import { KpiKeyValue, KpiSection } from 'in-sdk/components/dashboard/KpiSection';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import MetricValue from 'in-components/MetricValue';
import { t } from 'in-i18n';

export default function AwsRedshiftNodeDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');

  return (
    <div>
      <KpiSection>
        <KpiKeyValue label={t('in-forge:plugins.awsRedshiftNode.dashboard.cpuUtilization')}>
          <MetricValue snapshotId={snapshotId} metric="cpu_utilization" formatter={percentagePlainTwoDecimalPlaces} />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.awsRedshiftNode.dashboard.readLatency')}>
          <MetricValue snapshotId={snapshotId} metric="read_latency" formatter={seconds.fixedCompact} />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.awsRedshiftNode.dashboard.writeLatency')}>
          <MetricValue snapshotId={snapshotId} metric="write_latency" formatter={seconds.fixedCompact} />
        </KpiKeyValue>
      </KpiSection>
      <DashboardSection title={t('in-forge:plugins.awsRedshiftNode.dashboard.cpuUtilization')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['cpu_utilization'],
            labels: [t('in-forge:plugins.awsRedshiftNode.dashboard.used')],
            formatter: percentagePlainTwoDecimalPlaces,
            type: 'line'
          }}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.awsRedshiftNode.dashboard.latency')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['read_latency', 'write_latency'],
            labels: [
              t('in-forge:plugins.awsRedshiftNode.dashboard.read'),
              t('in-forge:plugins.awsRedshiftNode.dashboard.write')
            ],
            formatter: seconds.fixedCompact,
            type: 'line'
          }}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.awsRedshiftNode.dashboard.iops')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['read_iops', 'write_iops'],
            labels: [
              t('in-forge:plugins.awsRedshiftNode.dashboard.read'),
              t('in-forge:plugins.awsRedshiftNode.dashboard.write')
            ],
            formatter: number.perSecond.compact,
            type: 'line'
          }}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.awsRedshiftNode.dashboard.throughput')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['read_throughput', 'write_throughput'],
            labels: [
              t('in-forge:plugins.awsRedshiftNode.dashboard.read'),
              t('in-forge:plugins.awsRedshiftNode.dashboard.write')
            ],
            formatter: bytes.perSecond.compact,
            type: 'line'
          }}
        />
      </DashboardSection>
    </div>
  );
}
