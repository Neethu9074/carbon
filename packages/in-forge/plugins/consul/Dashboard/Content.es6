import React from 'react';

import { KpiSection, KpiHeading, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import Columize from 'in-sdk/components/dashboard/Columize';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart';
import DashboardNotification from 'in-components/DashboardNotification';
import { withSiPrefixZeroDecimalPlaces } from 'in-services/formatters/number';
import { getLabel } from 'in-sdk/snapshot';
import GaugesTable from './GaugesTable';

const metrics = [
  'consul.runtime.heap_objects',
  'consul.session_ttl.active',
  'consul.autopilot.healthy',
  'consul.runtime.total_gc_runs',
  'consul.runtime.num_goroutines',
  'consul.autopilot.failure_tolerance',
  'consul.runtime.total_gc_pause_ns'
];

const serfLanMetrics = ['serfLan.eventQueue', 'serfLan.healthScore', 'serfLan.members'];

const raftMetrics = [
  'raft.fsmPending',
  'raft.appliedIndex',
  'raft.commitIndex',
  'raft.lastContact',
  'raft.lastLogIndex',
  'raft.lastLogTerm',
  'raft.lastSnapshotIndex',
  'raft.lastSnapshotTerm',
  'raft.term',
  'raft.numPeers'
];

export default function ConsulDashboard({ snapshot, timeframe }) {
  const snapshotId = snapshot.get('id');
  const errorCode = snapshot.getIn(['data', 'error_code']);
  const consulVersion = snapshot.getIn(['data', 'consul_version']);

  if (errorCode !== 'NO_ERROR') {
    return (
      <DashboardNotification type="warning">
        <strong>Consul version too old</strong>
        <p>
          The Consul version you are using is too old and does not provide metrics. Please upgrade to version 0.9.1 or
          higher to receive metrics in this dashboard.
        </p>
        <p>
          Current Consul Version: <code>{consulVersion}</code>
        </p>
      </DashboardNotification>
    );
  } else {
    return (
      <div>
        <KpiSection>
          <KpiHeading>{getLabel(snapshot)}</KpiHeading>
          <KpiKeyValue label="State">{snapshot.getIn(['data', 'raft.state'], null)}</KpiKeyValue>
          <KpiKeyValue label="Domain">{snapshot.getIn(['data', 'domain'], null)}</KpiKeyValue>
          <KpiKeyValue label="AdvertiseAddr">{snapshot.getIn(['data', 'advertiseAddr'], null)}</KpiKeyValue>
          {snapshot.getIn(['data', 'knownServers'], null) > 0 && (
            <KpiKeyValue label="Known Servers">{snapshot.getIn(['data', 'knownServers'], null)}</KpiKeyValue>
          )}
          {snapshot.getIn(['data', 'knownDatacenters'], null) > 0 && (
            <KpiKeyValue label="Known Datacenters">{snapshot.getIn(['data', 'knownDatacenters'], null)}</KpiKeyValue>
          )}
        </KpiSection>
        <Columize>
          <DashboardSection title="Allocation">
            <Chart
              snapshotId={snapshotId}
              timeframe={timeframe}
              y1={{
                min: 0,
                metrics: ['consul.runtime.alloc_bytes', 'consul.runtime.sys_bytes'],
                labels: ['Allocated Bytes', 'System Bytes'],
                formatter: withSiPrefixZeroDecimalPlaces,
                type: 'line'
              }}
            />
          </DashboardSection>
          <DashboardSection title="Runtime">
            <Chart
              snapshotId={snapshotId}
              timeframe={timeframe}
              y1={{
                min: 0,
                metrics: ['consul.runtime.malloc_count', 'consul.runtime.free_count'],
                labels: ['Malloc Count', 'Free Count'],
                formatter: withSiPrefixZeroDecimalPlaces,
                type: 'line'
              }}
            />
          </DashboardSection>
        </Columize>
        <Columize>
          <GaugesTable snapshot={snapshot} timeframe={timeframe} metrics={raftMetrics} title="Raft" />
        </Columize>
        <Columize>
          <GaugesTable snapshot={snapshot} timeframe={timeframe} metrics={serfLanMetrics} title="SerfLan" />
        </Columize>
        <Columize>
          <GaugesTable snapshot={snapshot} timeframe={timeframe} metrics={metrics} title="Runtime" />
        </Columize>
      </div>
    );
  }
}
