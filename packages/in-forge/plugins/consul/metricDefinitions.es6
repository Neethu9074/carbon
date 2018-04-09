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
      'raft.lastContact',
      'raft.lastLogIndex',
      'raft.lastLogTerm',
      'raft.lastSnapshotIndex',
      'raft.lastSnapshotTerm',
      'raft.numPeers',
      'raft.term'
    ],
    labels: [
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
      'raft.lastContact',
      'raft.lastLogIndex',
      'raft.lastLogTerm',
      'raft.lastSnapshotIndex',
      'raft.lastSnapshotTerm',
      'raft.numPeers',
      'raft.term'
    ],
    min: 0,
    category: ['Consul'],
    formatter: number
  }
];
