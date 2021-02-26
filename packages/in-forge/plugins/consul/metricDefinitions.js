/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';

import { number } from 'in-services/formatters/number';

export default [
  {
    metrics: [
      'consul.runtime.free_count',
      'consul.runtime.heap_objects',
      'consul.runtime.sys_bytes',
      'consul.runtime.malloc_count',
      'consul.session_ttl.active',
      'consul.autopilot.healthy',
      'consul.runtime.total_gc_runs',
      'consul.runtime.num_goroutines',
      'consul.runtime.alloc_bytes',
      'consul.autopilot.failure_tolerance',
      'consul.runtime.total_gc_pause_ns',
      'raft.appliedIndex',
      'raft.commitIndex',
      'raft.fsmPending',
      'raft.lastLogIndex',
      'raft.lastLogTerm',
      'raft.lastSnapshotIndex',
      'raft.lastSnapshotTerm',
      'raft.numPeers',
      'raft.term'
    ],
    labels: [
      t('in-forge:plugins.consul.labelConsulRuntimeFree_count'),
      t('in-forge:plugins.consul.labelConsulRuntimeHeap_objects'),
      t('in-forge:plugins.consul.labelConsulRuntimeSys_bytes'),
      t('in-forge:plugins.consul.labelConsulRuntimeMalloc_count'),
      t('in-forge:plugins.consul.labelConsulSession_ttlActive'),
      t('in-forge:plugins.consul.labelConsulAutopilotHealthy'),
      t('in-forge:plugins.consul.labelConsulRuntimeTotal_gc_runs'),
      t('in-forge:plugins.consul.labelConsulRuntimeNum_goroutines'),
      t('in-forge:plugins.consul.labelConsulRuntimeAlloc_bytes'),
      t('in-forge:plugins.consul.labelConsulAutopilotFailure_tolerance'),
      t('in-forge:plugins.consul.labelConsulRuntimeTotal_gc_pause_ns'),
      t('in-forge:plugins.consul.labelRaftAppliedIndex'),
      t('in-forge:plugins.consul.labelRaftCommitIndex'),
      t('in-forge:plugins.consul.labelRaftFsmPending'),
      t('in-forge:plugins.consul.labelRaftLastLogIndex'),
      t('in-forge:plugins.consul.labelRaftLastLogTerm'),
      t('in-forge:plugins.consul.labelRaftLastSnapshotIndex'),
      t('in-forge:plugins.consul.labelRaftLastSnapshotTerm'),
      t('in-forge:plugins.consul.labelRaftNumPeers'),
      t('in-forge:plugins.consul.labelRaftTerm')
    ],
    min: 0,
    category: ['Consul'],
    formatter: number
  }
];
