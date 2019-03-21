import React from 'react';

import { KpiSection, KpiHeading, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart';
import MetricValue from 'in-components/MetricValue';
import GetMetricStatisticsInUse from 'in-forge/plugins/awsDynamoDb/GetMetricStatisticsInUse';
import { millis, number } from 'in-services/formatters/number';
import { getLabel } from 'in-sdk/snapshot';
import theme from 'in-themes';
import InstancesTable from './InstancesTable';

export default function AwsBeanstalkDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');
  return (
    <div>
      <GetMetricStatisticsInUse snapshot={snapshot} />
      <KpiSection>
        <KpiHeading>{getLabel(snapshot)}</KpiHeading>

        <KpiKeyValue label="OK Instances">
          <MetricValue snapshotId={snapshotId} metric="environment_instances_ok" formatter={number.compact} />
        </KpiKeyValue>
        <KpiKeyValue label="Degraded Instances">
          <MetricValue snapshotId={snapshotId} metric="environment_instances_degraded" formatter={number.compact} />
        </KpiKeyValue>
        <KpiKeyValue label="Severe Instances">
          <MetricValue snapshotId={snapshotId} metric="environment_instances_severe" formatter={number.compact} />
        </KpiKeyValue>
        <KpiKeyValue label="Total Requests">
          <MetricValue snapshotId={snapshotId} metric="application_requests_total" formatter={number.compact} />
        </KpiKeyValue>
        <KpiKeyValue label="5xx Requests">
          <MetricValue snapshotId={snapshotId} metric="application_requests_5xx" formatter={number.compact} />
        </KpiKeyValue>
      </KpiSection>
      <DashboardSection title="Statuses">
        <Chart
          snapshotId={snapshotId}
          timeframe={timeConfig}
          y1={{
            metrics: [
              'environment_health',
              'environment_instances_ok',
              'environment_instances_info',
              'environment_instances_unknown',
              'environment_instances_no_data',
              'environment_instances_warning',
              'environment_instances_degraded',
              'environment_instances_severe'
            ],
            labels: [
              'Environment Health',
              'OK Instances',
              'Info Instances',
              'Unknown Instances',
              'No Data Instances',
              'Warning Instances',
              'Degraded Instances',
              'Severe Instances'
            ],
            type: 'line',
            formatter: number.compact
          }}
        />
      </DashboardSection>
      <DashboardSection title="Latency">
        <Chart
          snapshotId={snapshotId}
          timeframe={timeConfig}
          y1={{
            metrics: [
              'application_latency_p10',
              'application_latency_p50',
              'application_latency_p75',
              'application_latency_p85',
              'application_latency_p90',
              'application_latency_p95',
              'application_latency_p99',
              'application_latency_p99.9'
            ],
            labels: [
              'Application Latency P10',
              'Application Latency P50',
              'Application Latency P75',
              'Application Latency P85',
              'Application Latency P90',
              'Application Latency P95',
              'Application Latency P99',
              'Application Latency P99.9'
            ],
            min: 0,
            type: 'line',
            formatter: millis.compact
          }}
        />
      </DashboardSection>
      <DashboardSection title="Requests">
        <Chart
          snapshotId={snapshotId}
          timeframe={timeConfig}
          y1={{
            metrics: [
              'application_requests_2xx',
              'application_requests_3xx',
              'application_requests_4xx',
              'application_requests_5xx',
              'application_requests_total'
            ],
            labels: [
              'Application Requests 2xx',
              'Application Requests 3xx',
              'Application Requests 4xx',
              'Application Requests 5xx',
              'Application Requests Total'
            ],
            colors: [
              theme.lib.colors.green800,
              theme.lib.colors.yellow800,
              theme.lib.colors.orange800,
              theme.lib.colors.red800,
              theme.lib.colors.indigo800
            ],
            min: 0,
            type: 'line',
            formatter: number.detailed
          }}
        />
      </DashboardSection>
      <InstancesTable snapshot={snapshot} timeConfig={timeConfig} />
    </div>
  );
}
