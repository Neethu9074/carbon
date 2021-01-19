/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import theme from 'in-themes';
import React from 'react';

import GetMetricStatisticsInUse from 'in-forge/plugins/awsDynamoDb/GetMetricStatisticsInUse';
import InstancesTable from 'in-forge/plugins/awsBeanstalk/Dashboard/InstancesTable';
import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { millis, number } from 'in-services/formatters/number';
import MetricValue from 'in-components/MetricValue';

export default function AwsBeanstalkDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');
  return (
    <div>
      <GetMetricStatisticsInUse snapshot={snapshot} />
      <KpiSection>
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
      <DashboardSection title="Status">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
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
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title="Latency">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
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
            labels: ['10th', '50th', '75th', '85th', '90th', '95th', '99th', '99.9th'],
            min: 0,
            type: 'line',
            formatter: millis.compact
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title="Requests">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: [
              'application_requests_2xx',
              'application_requests_3xx',
              'application_requests_4xx',
              'application_requests_5xx',
              'application_requests_total'
            ],
            labels: ['2xx', '3xx', '4xx', '5xx', 'Total'],
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
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <InstancesTable snapshot={snapshot} timeConfig={timeConfig} />
    </div>
  );
}
