/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import theme from 'in-themes';
import { t } from 'in-i18n';
import React from 'react';

import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { number, percentage, millis } from 'in-services/formatters/number';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { formatDateTime } from 'in-services/formatters/date';
import { emptyList } from 'in-services/fixedImmutables';
import Table from 'in-sdk/components/dashboard/Table';

const cols = [
  {
    title: t('in-forge:plugins.awsBeanstalk.titleInstanceID'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.key;
      }
    }
  },
  {
    title: t('in-forge:plugins.titleType'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.type;
      }
    }
  },
  {
    title: t('in-forge:plugins.titleStatus'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.status;
      }
    }
  },
  {
    title: t('in-forge:plugins.awsBeanstalk.titleLaunchedAt'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.launchedAt;
      }
    }
  },
  {
    title: t('in-forge:plugins.awsBeanstalk.titleCPULoad'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `instanceMetrics.${row.key}.cpu_load_average_1min`;
      },
      getContent: percentage.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.awsBeanstalk.titleDiskUsage'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `instanceMetrics.${row.key}.disk_space_usage`;
      },
      getContent: percentage.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function InstancesTable({ snapshot, timeConfig }) {
  const data = snapshot.get('data');
  const instances = data.get('instances.ids', emptyList);
  if (instances.size === 0) {
    return null;
  }

  const rows = instances.toArray().map(instance => {
    return {
      key: instance,
      snapshotId: snapshot.get('id'),
      status: data.get('instances.data.' + instance + '.status'),
      type: data.get('instances.data.' + instance + '.type'),
      launchedAt: formatDateTime(data.get('instances.data.' + instance + '.launched_at')),
      timeConfig
    };
  });
  return (
    <Table
      withoutPadding
      cardTitle={t('in-forge:plugins.awsBeanstalk.titleInstances', { len: rows.length })}
      cols={cols}
      rows={rows}
      getRowDetails={getDetails}
    />
  );
}

function getDetails(row) {
  const instanceId = row.key;
  return (
    <div>
      <DashboardSection title={t('in-forge:plugins.titleHealth')}>
        <Chart
          snapshotId={row.snapshotId}
          timeConfig={row.timeConfig}
          y1={{
            metrics: ['instanceMetrics.' + instanceId + '.instance_health'],
            labels: [t('in-forge:plugins.awsBeanstalk.labelInstanceHealth')],
            type: 'line',
            formatter: number.compact
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.awsBeanstalk.titleCPUStates')}>
        <Chart
          snapshotId={row.snapshotId}
          timeConfig={row.timeConfig}
          y1={{
            metrics: [
              'instanceMetrics.' + instanceId + '.cpu_irq',
              'instanceMetrics.' + instanceId + '.cpu_idle',
              'instanceMetrics.' + instanceId + '.cpu_user',
              'instanceMetrics.' + instanceId + '.cpu_system',
              'instanceMetrics.' + instanceId + '.cpu_softirq',
              'instanceMetrics.' + instanceId + '.cpu_iowait',
              'instanceMetrics.' + instanceId + '.cpu_nice',
              'instanceMetrics.' + instanceId + '.cpu_load_average_1min'
            ],
            labels: [
              t('in-forge:plugins.labelCPUStatesMetric.irq'),
              t('in-forge:plugins.labelCPUStatesMetric.idle'),
              t('in-forge:plugins.labelCPUStatesMetric.user'),
              t('in-forge:plugins.labelCPUStatesMetric.system'),
              t('in-forge:plugins.labelCPUStatesMetric.softirq'),
              t('in-forge:plugins.labelCPUStatesMetric.iowait'),
              t('in-forge:plugins.labelCPUStatesMetric.nice'),
              t('in-forge:plugins.labelCPUStatesMetric.load')
            ],
            type: 'line',
            min: 0,
            formatter: percentage.detailed
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.awsBeanstalk.titleDiskUsage')}>
        <Chart
          snapshotId={row.snapshotId}
          timeConfig={row.timeConfig}
          y1={{
            metrics: ['instanceMetrics.' + row.key + '.disk_space_usage'],
            labels: [t('in-forge:plugins.awsBeanstalk.titleDiskUsage')],
            type: 'line',
            min: 0,
            formatter: percentage.detailed
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.awsBeanstalk.titleApplicationLatency')}>
        <Chart
          snapshotId={row.snapshotId}
          timeConfig={row.timeConfig}
          y1={{
            metrics: [
              'instanceMetrics.' + instanceId + '.application_latency_p10',
              'instanceMetrics.' + instanceId + '.application_latency_p50',
              'instanceMetrics.' + instanceId + '.application_latency_p75',
              'instanceMetrics.' + instanceId + '.application_latency_p85',
              'instanceMetrics.' + instanceId + '.application_latency_p90',
              'instanceMetrics.' + instanceId + '.application_latency_p95',
              'instanceMetrics.' + instanceId + '.application_latency_p99',
              'instanceMetrics.' + instanceId + '.application_latency_p99.9'
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
            type: 'line',
            formatter: millis.compact
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.awsBeanstalk.titleApplicationRequests')}>
        <Chart
          snapshotId={row.snapshotId}
          timeConfig={row.timeConfig}
          y1={{
            metrics: [
              'instanceMetrics.' + instanceId + '.application_requests_2xx',
              'instanceMetrics.' + instanceId + '.application_requests_3xx',
              'instanceMetrics.' + instanceId + '.application_requests_4xx',
              'instanceMetrics.' + instanceId + '.application_requests_5xx',
              'instanceMetrics.' + instanceId + '.application_requests_total'
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
            type: 'line',
            formatter: number.detailed
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
    </div>
  );
}
