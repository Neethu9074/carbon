/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { number, bytes } from 'in-services/formatters/number';

export default [
  // system.metrics
  {
    metric: 'Merge',
    formatter: number
  },
  {
    metric: 'ReplicatedFetch',
    formatter: number
  },
  {
    metric: 'ReplicatedSend',
    formatter: number
  },
  {
    metric: 'ReplicatedChecks',
    formatter: number
  },
  {
    metric: 'BackgroundPoolTask',
    formatter: number
  },
  {
    metric: 'DiskSpaceReservedForMerge',
    formatter: number
  },
  {
    metric: 'DistributedSend',
    formatter: number
  },
  {
    metric: 'DistributedFilesToInsert',
    formatter: number
  },
  {
    metric: 'QueryPreempted',
    formatter: number
  },
  {
    metric: 'TCPConnection',
    formatter: number
  },
  {
    metric: 'HTTPConnection',
    formatter: number
  },
  {
    metric: 'InterserverConnection',
    formatter: number
  },
  {
    metric: 'OpenFileForRead',
    formatter: number
  },
  {
    metric: 'OpenFileForWrite',
    formatter: number
  },
  {
    metric: 'Read',
    formatter: number
  },
  {
    metric: 'Write',
    formatter: number
  },
  {
    metric: 'SendExternalTables',
    formatter: number
  },
  {
    metric: 'QueryThread',
    formatter: number
  },
  {
    metric: 'ReadonlyReplica',
    formatter: number
  },
  {
    metric: 'LeaderReplica',
    formatter: number
  },
  {
    metric: 'MemoryTracking',
    formatter: bytes
  },
  {
    metric: 'MemoryTrackingInBackgroundProcessingPool',
    formatter: bytes
  },
  {
    metric: 'MemoryTrackingForMerges',
    formatter: bytes
  },
  {
    metric: 'LeaderElection',
    formatter: number
  },
  {
    metric: 'EphemeralNode',
    formatter: number
  },
  {
    metric: 'ZooKeeperWatch',
    formatter: number
  },
  {
    metric: 'DelayedInserts',
    formatter: number
  },
  {
    metric: 'ContextLockWait',
    formatter: number
  },
  {
    metric: 'StorageBufferRows',
    formatter: number
  },
  {
    metric: 'StorageBufferBytes',
    formatter: bytes
  },
  {
    metric: 'DictCacheRequests',
    formatter: number
  },
  {
    metric: 'Revision',
    formatter: number
  },
  {
    metric: 'RWLockWaitingReaders',
    formatter: number
  },
  {
    metric: 'RWLockWaitingWriters',
    formatter: number
  },
  {
    metric: 'RWLockActiveReaders',
    formatter: number
  },
  {
    metric: 'RWLockActiveWriters',
    formatter: number
  },

  // system.events
  {
    metric: 'Query',
    formatter: number
  },
  {
    metric: 'SelectQuery',
    formatter: number
  },
  {
    metric: 'InsertQuery',
    formatter: number
  },
  {
    metric: 'FileOpen',
    formatter: number
  },
  {
    metric: 'Seek',
    formatter: number
  },
  {
    metric: 'ReadBufferFromFileDescriptorRead',
    formatter: number
  },
  {
    metric: 'ReadBufferFromFileDescriptorReadBytes',
    formatter: bytes
  },
  {
    metric: 'WriteBufferFromFileDescriptorWrite',
    formatter: number
  },
  {
    metric: 'WriteBufferFromFileDescriptorWriteBytes',
    formatter: bytes
  },
  {
    metric: 'ReadCompressedBytes',
    formatter: bytes
  },
  {
    metric: 'CompressedReadBufferBlocks',
    formatter: number
  },
  {
    metric: 'CompressedReadBufferBytes',
    formatter: bytes
  },
  {
    metric: 'IOBufferAllocs',
    formatter: number
  },
  {
    metric: 'IOBufferAllocBytes',
    formatter: bytes
  },
  {
    metric: 'ArenaAllocChunks',
    formatter: number
  },
  {
    metric: 'ArenaAllocBytes',
    formatter: bytes
  },
  {
    metric: 'FunctionExecute',
    formatter: number
  },
  {
    metric: 'TableFunctionExecute',
    formatter: number
  },
  {
    metric: 'MarkCacheHits',
    formatter: number
  },
  {
    metric: 'MarkCacheMisses',
    formatter: number
  },
  {
    metric: 'CreatedReadBufferOrdinary',
    formatter: number
  },
  {
    metric: 'CreatedWriteBufferOrdinary',
    formatter: number
  },
  {
    metric: 'ReplicatedPartMerges',
    formatter: number
  },
  {
    metric: 'InsertedRows',
    formatter: number
  },
  {
    metric: 'InsertedBytes',
    formatter: bytes
  },
  {
    metric: 'DuplicatedInsertedBlocks',
    formatter: number
  },
  {
    metric: 'ZooKeeperInit',
    formatter: number
  },
  {
    metric: 'ZooKeeperTransactions',
    formatter: number
  },
  {
    metric: 'ZooKeeperList',
    formatter: number
  },
  {
    metric: 'ZooKeeperCreate',
    formatter: number
  },
  {
    metric: 'ZooKeeperRemove',
    formatter: number
  },
  {
    metric: 'ZooKeeperExists',
    formatter: number
  },
  {
    metric: 'ZooKeeperGet',
    formatter: number
  },
  {
    metric: 'ZooKeeperSet',
    formatter: number
  },
  {
    metric: 'ZooKeeperMulti',
    formatter: number
  },
  {
    metric: 'ZooKeeperClose',
    formatter: number
  },
  {
    metric: 'ZooKeeperWatchResponse',
    formatter: number
  },
  {
    metric: 'ZooKeeperExceptions',
    formatter: number
  },
  {
    metric: 'ZooKeeperWaitMicroseconds',
    formatter: number
  },
  {
    metric: 'ZooKeeperBytesSent',
    formatter: bytes
  },
  {
    metric: 'ZooKeeperBytesReceived',
    formatter: bytes
  },
  {
    metric: 'DistributedConnectionStaleReplica',
    formatter: number
  },
  {
    metric: 'SlowRead',
    formatter: number
  },
  {
    metric: 'ReplicaPartialShutdown',
    formatter: number
  },
  {
    metric: 'SelectedParts',
    formatter: number
  },
  {
    metric: 'SelectedRanges',
    formatter: number
  },
  {
    metric: 'SelectedMarks',
    formatter: number
  },
  {
    metric: 'MergedRows',
    formatter: number
  },
  {
    metric: 'MergedUncompressedBytes',
    formatter: bytes
  },
  {
    metric: 'MergesTimeMilliseconds',
    formatter: number
  },
  {
    metric: 'MergeTreeDataWriterRows',
    formatter: number
  },
  {
    metric: 'MergeTreeDataWriterUncompressedBytes',
    formatter: bytes
  },
  {
    metric: 'MergeTreeDataWriterCompressedBytes',
    formatter: bytes
  },
  {
    metric: 'MergeTreeDataWriterBlocks',
    formatter: number
  },
  {
    metric: 'MergeTreeDataWriterBlocksAlreadySorted',
    formatter: number
  },
  {
    metric: 'CannotRemoveEphemeralNode',
    formatter: number
  },
  {
    metric: 'LeaderElectionAcquiredLeadership',
    formatter: number
  },
  {
    metric: 'RegexpCreated',
    formatter: number
  },
  {
    metric: 'ContextLock',
    formatter: number
  },
  {
    metric: 'RWLockAcquiredReadLocks',
    formatter: number
  },
  {
    metric: 'RWLockAcquiredWriteLocks',
    formatter: number
  },
  {
    metric: 'RWLockReadersWaitMilliseconds',
    formatter: number
  },
  {
    metric: 'RWLockWritersWaitMilliseconds',
    formatter: number
  }
];
