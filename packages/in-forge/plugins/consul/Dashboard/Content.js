/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import semver from 'semver';
import React from 'react';

import DashboardNotification from 'in-sdk/components/dashboard/DashboardNotification';
import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import GaugesTable from './GaugesTable';
import { t } from 'in-i18n';

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
            <KpiKeyValue label={t('in-forge:plugins.consul.dashboard.labelState')}>
              {snapshot.getIn(['data', 'raft.state'], null)}
            </KpiKeyValue>
          )}
        <KpiKeyValue label={t('in-forge:plugins.consul.dashboard.labelDomain')}>
          {snapshot.getIn(['data', 'domain'], null)}
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.consul.dashboard.labelAdvertiseAddress')}>
          {snapshot.getIn(['data', 'advertiseAddr'], null)}
        </KpiKeyValue>
        {snapshot.getIn(['data', 'knownServers'], null) > 0 && (
          <KpiKeyValue label={t('in-forge:plugins.consul.dashboard.labelKnownServers')}>
            {snapshot.getIn(['data', 'knownServers'], null)}
          </KpiKeyValue>
        )}
        {snapshot.getIn(['data', 'knownDatacenters'], null) > 0 && (
          <KpiKeyValue label={t('in-forge:plugins.consul.dashboard.labelKnownDatacenters')}>
            {snapshot.getIn(['data', 'knownDatacenters'], null)}
          </KpiKeyValue>
        )}
      </KpiSection>
      {errorCodeMetrics === 'NO_ERROR' && (
        <GaugesTable
          snapshot={snapshot}
          timeConfig={timeConfig}
          metrics={runtimeMetrics}
          title={t('in-forge:plugins.consul.dashboard.titleRuntimeMetrics')}
        />
      )}
      <GaugesTable
        snapshot={snapshot}
        timeConfig={timeConfig}
        metrics={serfLanMetrics}
        title={t('in-forge:plugins.consul.dashboard.titleSerfLan')}
      />
      {semver.valid(consulVersion) &&
        semver.satisfies(consulVersion, '>=1.0.0') &&
        snapshot.getIn(['data', 'raft.state']) && (
          <GaugesTable
            snapshot={snapshot}
            timeConfig={timeConfig}
            metrics={raftMetrics}
            title={t('in-forge:plugins.consul.dashboard.titleRaft')}
          />
        )}
      {semver.valid(consulVersion) &&
        semver.satisfies(consulVersion, '>=1.0.0') &&
        snapshot.getIn(['data', 'raft.state']) && (
          <GaugesTable
            snapshot={snapshot}
            timeConfig={timeConfig}
            metrics={autopilotMetrics}
            title={t('in-forge:plugins.consul.dashboard.titleAutopilot')}
          />
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
