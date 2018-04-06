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
      'agent.self.stats.raft.appliedIndex',
      'agent.self.stats.raft.commitIndex',
      'agent.self.stats.raft.fsmPending',
      'agent.self.stats.raft.lastContact',
      'agent.self.stats.raft.lastLogIndex',
      'agent.self.stats.raft.lastLogTerm',
      'agent.self.stats.raft.lastSnapshotIndex',
      'agent.self.stats.raft.lastSnapshotTerm',
      'agent.self.stats.raft.numPeers',
      'agent.self.stats.raft.term'
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
      'agent.self.stats.raft.appliedIndex',
      'agent.self.stats.raft.commitIndex',
      'agent.self.stats.raft.fsmPending',
      'agent.self.stats.raft.lastContact',
      'agent.self.stats.raft.lastLogIndex',
      'agent.self.stats.raft.lastLogTerm',
      'agent.self.stats.raft.lastSnapshotIndex',
      'agent.self.stats.raft.lastSnapshotTerm',
      'agent.self.stats.raft.numPeers',
      'agent.self.stats.raft.term'
    ],
    min: 0,
    category: ['Consul'],
    formatter: number
  }
];
