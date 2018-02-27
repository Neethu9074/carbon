import React from 'react';

import { getLabel } from 'in-sdk/snapshot';
import Columize from 'in-sdk/components/dashboard/Columize';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { KpiSection, KpiHeading, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import Chart from 'in-components/Chart';
import MetricValue from 'in-components/MetricValue';
import DashboardNotification from 'in-components/DashboardNotification';
import { number } from 'in-services/formatters/number';
import { bytesZeroDecimalPlaces } from 'in-services/formatters/number';

export default function NomadDashboard({ snapshot, timeframe }) {
  const snapshotId = snapshot.get('id');
  const errorCode = snapshot.getIn(['data', 'error_code']);
  const nomadVersion = snapshot.getIn(['data', 'nomad_version']);

  if (errorCode !== 'NO_ERROR') {
    return (
      <DashboardNotification type="warning">
        <strong>Nomad version too old</strong>
        <p>
          The Nomad version you are using is too old and does not provide metrics. Please upgrade to version 0.7 or
          higher to receive metrics in this dashboard.
        </p>
        <p>
          Current Nomad Version: <code>{nomadVersion}</code>.
        </p>
      </DashboardNotification>
    );
  } else {
    return (
      <div>
        <KpiSection>
          <KpiHeading>{getLabel(snapshot)}</KpiHeading>
          <KpiKeyValue label="Uptime">
            <MetricValue snapshotId={snapshotId} metric="nomad.uptime" />
          </KpiKeyValue>
          <KpiKeyValue label="Heartbeat active">
            <MetricValue snapshotId={snapshotId} metric="nomad.nomad.heartbeat.active" />
          </KpiKeyValue>
          <KpiKeyValue label="Running">
            <MetricValue snapshotId={snapshotId} metric="nomad.client.allocations.running" formatter={number.compact} />
          </KpiKeyValue>
          <KpiKeyValue label="Migrating">
            <MetricValue
              snapshotId={snapshotId}
              metric="nomad.client.allocations.migrating"
              formatter={number.compact}
            />
          </KpiKeyValue>
          <KpiKeyValue label="Pending">
            <MetricValue snapshotId={snapshotId} metric="nomad.client.allocations.pending" formatter={number.compact} />
          </KpiKeyValue>
          <KpiKeyValue label="Terminal">
            <MetricValue
              snapshotId={snapshotId}
              metric="nomad.client.allocations.terminal"
              formatter={number.compact}
            />
          </KpiKeyValue>
          <KpiKeyValue label="Blocked">
            <MetricValue snapshotId={snapshotId} metric="nomad.client.allocations.blocked" formatter={number.compact} />
          </KpiKeyValue>
        </KpiSection>
        <Columize>
          <DashboardSection title="Allocated/Unallocated CPU">
            <Chart
              snapshotId={snapshotId}
              timeframe={timeframe}
              y1={{
                min: 0,
                metrics: ['nomad.client.allocated.cpu', 'nomad.client.unallocated.cpu'],
                labels: ['Allocated CPU', 'Unallocated CPU'],
                type: 'stackedArea'
              }}
            />
          </DashboardSection>
          <DashboardSection title="Number Go routines">
            <Chart
              snapshotId={snapshotId}
              timeframe={timeframe}
              y1={{
                min: 0,
                metrics: ['nomad.runtime.num_goroutines'],
                labels: ['Number Go routines'],
                type: 'line'
              }}
            />
          </DashboardSection>
        </Columize>
        <Columize>
          <DashboardSection title="Allocations">
            <Chart
              snapshotId={snapshotId}
              timeframe={timeframe}
              y1={{
                min: 0,
                metrics: [
                  'nomad.client.allocations.running',
                  'nomad.client.allocations.migrating',
                  'nomad.client.allocations.pending',
                  'nomad.client.allocations.terminal',
                  'nomad.client.allocations.blocked'
                ],
                labels: ['Running', 'Migrating', 'Pending', 'Terminal', 'Blocked'],
                type: 'line'
              }}
            />
          </DashboardSection>
        </Columize>
        <Columize>
          <DashboardSection title="Broker Core">
            <Chart
              snapshotId={snapshotId}
              timeframe={timeframe}
              y1={{
                min: 0,
                metrics: ['nomad.nomad.broker._core.unacked', 'nomad.nomad.broker._core.ready'],
                labels: ['Unacknowledged', 'Ready'],
                type: 'line'
              }}
            />
          </DashboardSection>
          <DashboardSection title="Broker">
            <Chart
              snapshotId={snapshotId}
              timeframe={timeframe}
              y1={{
                min: 0,
                metrics: [
                  'nomad.nomad.broker.total_unacked',
                  'nomad.nomad.broker.total_waiting',
                  'nomad.nomad.broker.total_ready',
                  'nomad.nomad.broker.total_blocked'
                ],
                labels: ['Unacknowledged', 'Waiting', 'Ready', 'Blocked'],
                type: 'line'
              }}
            />
          </DashboardSection>
        </Columize>
        <Columize>
          <DashboardSection title="Total Blocked Evaluations">
            <Chart
              snapshotId={snapshotId}
              timeframe={timeframe}
              y1={{
                min: 0,
                metrics: [
                  'nomad.nomad.blocked_evals.total_quota_limit',
                  'nomad.nomad.blocked_evals.total_blocked',
                  'nomad.nomad.blocked_evals.total_escaped'
                ],
                labels: ['Quota limit', 'Blocked', 'Escaped'],
                type: 'line'
              }}
            />
          </DashboardSection>
        </Columize>
        <Columize>
          <DashboardSection title="Runtime">
            <Chart
              snapshotId={snapshotId}
              timeframe={timeframe}
              y1={{
                min: 0,
                metrics: [
                  'nomad.runtime.total_gc_pause_ns',
                  'nomad.runtime.total_gc_runs',
                  'nomad.runtime.free_count',
                  'nomad.runtime.malloc_count'
                ],
                labels: ['Total gc pause (ns)', 'Total gc runs', 'Free count', 'Malloc count'],
                type: 'line'
              }}
            />
            <Chart
              snapshotId={snapshotId}
              timeframe={timeframe}
              y1={{
                min: 0,
                metrics: ['nomad.runtime.alloc_bytes', 'nomad.runtime.sys_bytes'],
                formatter: bytesZeroDecimalPlaces,
                labels: ['Alloc bytes', 'System bytes'],
                type: 'line'
              }}
            />
            <Chart
              snapshotId={snapshotId}
              timeframe={timeframe}
              y1={{
                min: 0,
                metrics: ['nomad.runtime.heap_objects'],
                labels: ['Heap objects'],
                type: 'line'
              }}
            />
          </DashboardSection>
        </Columize>
        {
          // Further available metrics:
          // nomad.client.allocated.iops
          // nomad.nomad.plan.queue_depth
          // nomad.client.host.disk.used
          // nomad.client.allocated.disk
          // nomad.client.host.disk.size
          // nomad.client.host.disk.available
          // nomad.client.host.cpu.user
          // nomad.client.host.cpu.idle
          // nomad.client.host.disk.used_percent
          // nomad.client.host.disk.inodes_percent
          // nomad.client.host.memory.free
          // nomad.client.allocated.memory
          // nomad.client.unallocated.iops
          // nomad.nomad.heartbeat.active
          // nomad.client.host.memory.used
          // nomad.client.host.cpu.total
          // nomad.client.unallocated.disk
          // nomad.client.unallocated.memory
          // nomad.client.host.memory.available
          // nomad.nomad.vault.distributed_tokens_revoking
          // nomad.client.host.cpu.system
          // nomad.client.host.memory.total
        }
      </div>
    );
  }
}
