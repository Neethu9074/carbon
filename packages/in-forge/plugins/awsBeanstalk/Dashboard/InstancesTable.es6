import React from 'react';

import Chart from 'in-components/Chart';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Table from 'in-sdk/components/dashboard/Table';

import { number, percentage, millis } from 'in-services/formatters/number';
import { formatDateTime } from 'in-services/formatters/date';
import { emptyList } from 'in-services/fixedImmutables';
import theme from 'in-themes';

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
    <DashboardSection title={`Instances (${rows.length})`}>
      <Table cols={cols} rows={rows} getRowDetails={getDetails} />
    </DashboardSection>
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
            type: 'line',
            formatter: millis.compact
          }}
        />
      </DashboardSection>
      <DashboardSection title="Application Latency">
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
            type: 'line',
            formatter: number.detailed
          }}
        />
      </DashboardSection>
    </div>
  );
}
