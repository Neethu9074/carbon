import React from 'react';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import DashboardNotification from 'in-components/DashboardNotification';
import Chart from 'in-components/Chart';
import Columize from '../../../../in-sdk/components/dashboard/Columize';

export default function NomadDashboard({ snapshot, timeframe }) {
  const snapshotId = snapshot.get('id');
  const sensorConnectionStatus = snapshot.getIn(['data', 'sensorConnectionStatus'], 'OK');

  if (sensorConnectionStatus !== 'OK') {
    return <DashboardNotification type="info">{sensorConnectionStatus}</DashboardNotification>;
  }

  return (
    <div>
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
      {
        // nomad.runtime.heap_objects',
        // nomad.runtime.total_gc_pause_ns',
        // nomad.runtime.free_count',
        // nomad.client.allocated.iops',
        // nomad.nomad.plan.queue_depth',
        // nomad.uptime',
        // nomad.client.host.disk.used',
        // nomad.client.allocated.disk',
        // nomad.client.host.disk.size',
        // nomad.runtime.malloc_count',
        // nomad.client.host.disk.available',
        // nomad.client.host.cpu.user',
        // nomad.client.host.cpu.idle',
        // nomad.client.host.disk.used_percent',
        // nomad.client.host.disk.inodes_percent',
        // nomad.runtime.sys_bytes',
        // nomad.client.host.memory.free',
        // nomad.client.allocated.memory',
        // nomad.client.unallocated.iops',
        // nomad.nomad.heartbeat.active',
        // nomad.client.host.memory.used',
        // nomad.client.host.cpu.total',
        // nomad.client.unallocated.disk',
        // nomad.client.unallocated.memory',
        // nomad.runtime.alloc_bytes',
        // nomad.client.host.memory.available',
        // nomad.nomad.vault.distributed_tokens_revoking',
        // nomad.client.host.cpu.system',
        // nomad.runtime.total_gc_runs',
        // nomad.client.host.memory.total'
      }
    </div>
  );
}
