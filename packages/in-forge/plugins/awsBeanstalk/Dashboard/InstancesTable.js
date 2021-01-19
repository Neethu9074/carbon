/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import theme from 'in-themes';
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
    title: 'Instance ID',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.key;
      }
    }
  },
  {
    title: 'Type',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.type;
      }
    }
  },
  {
    title: 'Status',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.status;
      }
    }
  },
  {
    title: 'Launched at',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.launchedAt;
      }
    }
  },
  {
    title: 'CPU Load',
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
    title: 'Disk Usage',
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
    <Table withoutPadding cardTitle={`Instances (${rows.length})`} cols={cols} rows={rows} getRowDetails={getDetails} />
  );
}

function getDetails(row) {
  const instanceId = row.key;
  return (
    <div>
      <DashboardSection title="Health">
        <Chart
          snapshotId={row.snapshotId}
          timeConfig={row.timeConfig}
          y1={{
            metrics: ['instanceMetrics.' + instanceId + '.instance_health'],
            labels: ['Instance Health'],
            type: 'line',
            formatter: number.compact
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title="CPU States">
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
              'CPU irq',
              'CPU idle',
              'CPU user',
              'CPU system',
              'CPU softirq',
              'CPU iowait',
              'CPU nice',
              'CPU Load'
            ],
            type: 'line',
            min: 0,
            formatter: percentage.detailed
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title="Disk Usage">
        <Chart
          snapshotId={row.snapshotId}
          timeConfig={row.timeConfig}
          y1={{
            metrics: ['instanceMetrics.' + row.key + '.disk_space_usage'],
            labels: ['Disk Usage'],
            type: 'line',
            min: 0,
            formatter: percentage.detailed
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title="Application Latency">
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
            labels: ['10th', '50th', '75th', '85th', '90th', '95th', '99th', '99.9th'],
            type: 'line',
            formatter: millis.compact
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title="Application Requests">
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
            labels: ['2xx', '3xx', '4xx', '5xx', 'Total'],
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
