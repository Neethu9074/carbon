/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
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
      'Number of freed heap objects',
      'Number of objects allocated on the heap',
      'Number of the virtual address space reserved by the Go runtime',
      'Number of heap objects allocated',
      'Session time-to-live active',
      'Autopilot: healthy',
      'Number of total garbage collection runs',
      'Number of loaded go routines',
      'Number of bytes allocated by the Consul process',
      'Autopilot: failure tolerance',
      'Number of total garbage collection pauses in ns',
      'Raft: applied index',
      'Raft: commit index',
      'Raft: finite state machine pending',
      'Raft: last log index',
      'Raft: last log term',
      'Raft: last snapshot index',
      'Raft: last snapshot term',
      'Raft: number of peers',
      'Raft: term - new leader elections'
    ],
    min: 0,
    category: ['Consul'],
    formatter: number
  }
];
