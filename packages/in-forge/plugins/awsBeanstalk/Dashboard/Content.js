/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import theme from 'in-themes';
import { t } from 'in-i18n';
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
        <KpiKeyValue label={t('in-forge:plugins.awsBeanstalk.labelOKInstances')}>
          <MetricValue snapshotId={snapshotId} metric="environment_instances_ok" formatter={number.compact} />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.awsBeanstalk.labelDegradedInstances')}>
          <MetricValue snapshotId={snapshotId} metric="environment_instances_degraded" formatter={number.compact} />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.awsBeanstalk.labelSevereInstances')}>
          <MetricValue snapshotId={snapshotId} metric="environment_instances_severe" formatter={number.compact} />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.awsBeanstalk.labelTotalRequests')}>
          <MetricValue snapshotId={snapshotId} metric="application_requests_total" formatter={number.compact} />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.awsBeanstalk.label5xxRequests')}>
          <MetricValue snapshotId={snapshotId} metric="application_requests_5xx" formatter={number.compact} />
        </KpiKeyValue>
      </KpiSection>
      <DashboardSection title={t('in-forge:plugins.titleStatus')}>
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
              t('in-forge:plugins.awsBeanstalk.labelEnvironmentHealth'),
              t('in-forge:plugins.awsBeanstalk.labelOKInstances'),
              t('in-forge:plugins.awsBeanstalk.labelInfoInstances'),
              t('in-forge:plugins.awsBeanstalk.labelUnknownInstances'),
              t('in-forge:plugins.awsBeanstalk.labelNoDataInstances'),
              t('in-forge:plugins.awsBeanstalk.labelWarningInstances'),
              t('in-forge:plugins.awsBeanstalk.labelDegradedInstances'),
              t('in-forge:plugins.awsBeanstalk.labelSevereInstances')
            ],
            type: 'line',
            formatter: number.compact
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.titleLatency')}>
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
            labels: [
              t('in-forge:plugins.labelLatencyMetric.10th'),
              t('in-forge:plugins.labelLatencyMetric.50th'),
              t('in-forge:plugins.labelLatencyMetric.75th'),
              t('in-forge:plugins.labelLatencyMetric.85th'),
              t('in-forge:plugins.labelLatencyMetric.90th'),
              t('in-forge:plugins.labelLatencyMetric.95th'),
              t('in-forge:plugins.labelLatencyMetric.99th'),
              t('in-forge:plugins.labelLatencyMetric.999th')
            ],
            min: 0,
            type: 'line',
            formatter: millis.compact
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.titleRequests')}>
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
            labels: [
              t('in-forge:plugins.labelRequests.2xx'),
              t('in-forge:plugins.labelRequests.3xx'),
              t('in-forge:plugins.labelRequests.4xx'),
              t('in-forge:plugins.labelRequests.5xx'),
              t('in-forge:plugins.labelRequests.total')
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
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <InstancesTable snapshot={snapshot} timeConfig={timeConfig} />
    </div>
  );
}
