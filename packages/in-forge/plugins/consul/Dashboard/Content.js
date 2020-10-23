import React from 'react';
import semver from 'semver';

import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import DashboardNotification from 'in-sdk/components/dashboard/DashboardNotification';
import GaugesTable from './GaugesTable';

const runtimeMetrics = [
  'consul.runtime.heap_objects',
  'consul.runtime.total_gc_runs',
  'consul.runtime.num_goroutines',
  'consul.runtime.total_gc_pause_ns',
  'consul.runtime.alloc_bytes',
  'consul.runtime.sys_bytes',
  'consul.runtime.malloc_count',
  'consul.runtime.free_count'
];

const autopilotMetrics = ['consul.autopilot.healthy', 'consul.autopilot.failure_tolerance'];

const serfLanMetrics = ['serfLan.eventQueue', 'serfLan.healthScore', 'serfLan.members'];

const raftMetrics = [
  'raft.fsmPending',
  'raft.appliedIndex',
  'raft.commitIndex',
  'raft.lastLogIndex',
  'raft.lastLogTerm',
  'raft.lastSnapshotIndex',
  'raft.lastSnapshotTerm',
  'raft.term',
  'raft.numPeers'
];

export default function ConsulDashboard({ snapshot, timeConfig }) {
  const errorCodeMetrics = snapshot.getIn(['data', 'error_code_metrics']);
  const consulVersion = snapshot.getIn(['data', 'version']);

  return (
    <div>
      <KpiSection>
        {semver.valid(consulVersion) &&
          semver.satisfies(consulVersion, '>=1.0.0') &&
          snapshot.getIn(['data', 'raft.state']) && (
            <KpiKeyValue label="State">{snapshot.getIn(['data', 'raft.state'], null)}</KpiKeyValue>
          )}
        <KpiKeyValue label="Domain">{snapshot.getIn(['data', 'domain'], null)}</KpiKeyValue>
        <KpiKeyValue label="Advertise Address">{snapshot.getIn(['data', 'advertiseAddr'], null)}</KpiKeyValue>
        {snapshot.getIn(['data', 'knownServers'], null) > 0 && (
          <KpiKeyValue label="Known Servers">{snapshot.getIn(['data', 'knownServers'], null)}</KpiKeyValue>
        )}
        {snapshot.getIn(['data', 'knownDatacenters'], null) > 0 && (
          <KpiKeyValue label="Known Datacenters">{snapshot.getIn(['data', 'knownDatacenters'], null)}</KpiKeyValue>
        )}
      </KpiSection>
      {errorCodeMetrics === 'NO_ERROR' && (
        <GaugesTable snapshot={snapshot} timeConfig={timeConfig} metrics={runtimeMetrics} title="Runtime Metrics" />
      )}
      <GaugesTable snapshot={snapshot} timeConfig={timeConfig} metrics={serfLanMetrics} title="SerfLan" />
      {semver.valid(consulVersion) &&
        semver.satisfies(consulVersion, '>=1.0.0') &&
        snapshot.getIn(['data', 'raft.state']) && (
          <GaugesTable snapshot={snapshot} timeConfig={timeConfig} metrics={raftMetrics} title="Raft" />
        )}
      {semver.valid(consulVersion) &&
        semver.satisfies(consulVersion, '>=1.0.0') &&
        snapshot.getIn(['data', 'raft.state']) && (
          <GaugesTable snapshot={snapshot} timeConfig={timeConfig} metrics={autopilotMetrics} title="Autopilot" />
        )}
      {errorCodeMetrics === 'METRICS_NOT_ACCESSIBLE' && (
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
      )}
    </div>
  );
}
