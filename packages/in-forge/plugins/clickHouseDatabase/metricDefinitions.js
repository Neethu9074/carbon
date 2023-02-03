/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { getDynamicMetricMatch } from 'in-sdk/metrics/metricDefinitions';
import { number, bytes } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  // dynamic metrics
  {
    metrics: [
      getDynamicMetricMatch('table_metric', 'columns', t('in-forge:plugins.clickhouseDatabase.dashboard.titleTable')),
      getDynamicMetricMatch('table_metric', 'rows', t('in-forge:plugins.clickhouseDatabase.dashboard.titleTable')),
      getDynamicMetricMatch(
        'table_metric',
        'bytes_on_disk',
        t('in-forge:plugins.clickhouseDatabase.dashboard.titleTable')
      ),
      getDynamicMetricMatch(
        'table_metric',
        'partitions',
        t('in-forge:plugins.clickhouseDatabase.dashboard.titleTable')
      ),
      getDynamicMetricMatch('table_metric', 'parts', t('in-forge:plugins.clickhouseDatabase.dashboard.titleTable'))
    ],
    labels: [
      t('in-forge:plugins.clickhouseDatabase.dashboard.titleColumns'),
      t('in-forge:plugins.clickhouseDatabase.dashboard.titleRows'),
      t('in-forge:plugins.clickhouseDatabase.dashboard.titleBytesOnDisk'),
      t('in-forge:plugins.clickhouseDatabase.dashboard.titleTablesCount'),
      t('in-forge:plugins.clickhouseDatabase.dashboard.titleActiveParts')
    ],
    category: [t('in-forge:plugins.clickhouseDatabase.dashboard.titleTable')],
    min: 0,
    formatter: number
  },
  // system.metrics
  {
    metric: 'BackgroundBufferFlushSchedulePoolTask',
    formatter: number
  },
  {
    metric: 'BackgroundDistributedSchedulePoolTask',
    formatter: number
  },
  {
    metric: 'BackgroundFetchesPoolTask',
    formatter: number
  },
  {
    metric: 'BackgroundMessageBrokerSchedulePoolTask',
    formatter: number
  },
  {
    metric: 'BackgroundMovePoolTask',
    formatter: number
  },
  {
    metric: 'BackgroundPoolTask',
    formatter: number
  },
  {
    metric: 'BackgroundSchedulePoolTask',
    formatter: number
  },
  {
    metric: 'CacheDictionaryUpdateQueueBatches',
    formatter: number
  },
  {
    metric: 'CacheDictionaryUpdateQueueKeys',
    formatter: number
  },
  {
    metric: 'ContextLockWait',
    formatter: number
  },
  {
    metric: 'DelayedInserts',
    formatter: number
  },
  {
    metric: 'DictCacheRequests',
    formatter: number
  },
  {
    metric: 'DiskSpaceReservedForMerge',
    formatter: bytes
  },
  {
    metric: 'DistributedFilesToInsert',
    formatter: number
  },
  {
    metric: 'DistributedSend',
    formatter: number
  },
  {
    metric: 'EphemeralNode',
    formatter: number
  },
  {
    metric: 'GlobalThread',
    formatter: number
  },
  {
    metric: 'GlobalThreadActive',
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
    metric: 'LocalThread',
    formatter: number
  },
  {
    metric: 'LocalThreadActive',
    formatter: number
  },
  {
    metric: 'MaxDDLEntryID',
    formatter: number
  },
  {
    metric: 'MemoryTracking',
    formatter: bytes
  },
  {
    metric: 'Merge',
    formatter: number
  },
  {
    metric: 'MySQLConnection',
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
    metric: 'PartMutation',
    formatter: number
  },
  {
    metric: 'PartsCommitted',
    formatter: number
  },
  {
    metric: 'PartsCompact',
    formatter: number
  },
  {
    metric: 'PartsDeleteOnDestroy',
    formatter: number
  },
  {
    metric: 'PartsDeleting',
    formatter: number
  },
  {
    metric: 'PartsInMemory',
    formatter: number
  },
  {
    metric: 'PartsOutdated',
    formatter: number
  },
  {
    metric: 'PartsPreCommitted',
    formatter: number
  },
  {
    metric: 'PartsTemporary',
    formatter: number
  },
  {
    metric: 'PartsTemporary',
    formatter: number
  },
  {
    metric: 'PartsWide',
    formatter: number
  },
  {
    metric: 'PostgreSQLConnection',
    formatter: number
  },
  {
    metric: 'Query',
    formatter: number
  },
  {
    metric: 'QueryPreempted',
    formatter: number
  },
  {
    metric: 'QueryThread',
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
  {
    metric: 'RWLockWaitingReaders',
    formatter: number
  },
  {
    metric: 'RWLockWaitingWriters',
    formatter: number
  },
  {
    metric: 'Read',
    formatter: number
  },
  {
    metric: 'ReadonlyReplica',
    formatter: number
  },
  {
    metric: 'ReplicatedChecks',
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
    metric: 'Revision',
    formatter: number
  },
  {
    metric: 'SendExternalTables',
    formatter: number
  },
  {
    metric: 'SendScalars',
    formatter: number
  },
  {
    metric: 'StorageBufferBytes',
    formatter: bytes
  },
  {
    metric: 'StorageBufferRows',
    formatter: number
  },
  {
    metric: 'TCPConnection',
    formatter: number
  },
  {
    metric: 'TablesToDropQueueSize',
    formatter: number
  },
  {
    metric: 'VersionInteger',
    formatter: number
  },
  {
    metric: 'Write',
    formatter: number
  },
  {
    metric: 'ZooKeeperRequest',
    formatter: number
  },
  {
    metric: 'ZooKeeperSession',
    formatter: number
  },
  {
    metric: 'ZooKeeperWatch',
    formatter: number
  },

  // system.events
  {
    metric: 'ArenaAllocBytes',
    formatter: bytes
  },
  {
    metric: 'ArenaAllocChunks',
    formatter: number
  },
  {
    metric: 'CannotRemoveEphemeralNode',
    formatter: number
  },
  {
    metric: 'CompressedReadBufferBlocks',
    formatter: number
  },
  {
    metric: 'CompressedReadBufferBytes',
    formatter: number
  },
  {
    metric: 'ContextLock',
    formatter: number
  },
  {
    metric: 'CreatedHTTPConnections',
    formatter: number
  },
  {
    metric: 'CreatedLogEntryForMerge',
    formatter: number
  },
  {
    metric: 'CreatedReadBufferAIO',
    formatter: number
  },
  {
    metric: 'CreatedReadBufferOrdinary',
    formatter: number
  },
  {
    metric: 'DiskReadElapsedMicroseconds',
    formatter: number
  },
  {
    metric: 'DiskWriteElapsedMicroseconds',
    formatter: number
  },
  {
    metric: 'DistributedConnectionFailAtAll',
    formatter: number
  },
  {
    metric: 'DistributedConnectionFailTry',
    formatter: number
  },
  {
    metric: 'DistributedConnectionStaleReplica',
    formatter: number
  },
  {
    metric: 'DuplicatedInsertedBlocks',
    formatter: number
  },
  {
    metric: 'FailedInsertQuery',
    formatter: number
  },
  {
    metric: 'FailedQuery',
    formatter: number
  },
  {
    metric: 'FailedSelectQuery',
    formatter: number
  },
  {
    metric: 'FileOpen',
    formatter: number
  },
  {
    metric: 'FunctionExecute',
    formatter: number
  },
  {
    metric: 'HardPageFaults',
    formatter: number
  },
  {
    metric: 'IOBufferAllocBytes',
    formatter: bytes
  },
  {
    metric: 'IOBufferAllocs',
    formatter: number
  },
  {
    metric: 'InsertQuery',
    formatter: number
  },
  {
    metric: 'InsertQueryTimeMicroseconds',
    formatter: number
  },
  {
    metric: 'InsertedBytes',
    formatter: number
  },
  {
    metric: 'InsertedRows',
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
    metric: 'Merge',
    formatter: number
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
    metric: 'MergeTreeDataWriterCompressedBytes',
    formatter: bytes
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
    metric: 'NetworkReceiveElapsedMicroseconds',
    formatter: number
  },
  {
    metric: 'NetworkSendElapsedMicroseconds',
    formatter: number
  },
  {
    metric: 'NotCreatedLogEntryForMerge',
    formatter: number
  },
  {
    metric: 'OSCPUVirtualTimeMicroseconds',
    formatter: number
  },
  {
    metric: 'OSCPUWaitMicroseconds',
    formatter: number
  },
  {
    metric: 'OSIOWaitMicroseconds',
    formatter: number
  },
  {
    metric: 'ObsoleteReplicatedParts',
    formatter: number
  },
  {
    metric: 'Query',
    formatter: number
  },
  {
    metric: 'QueryMemoryLimitExceeded',
    formatter: number
  },
  {
    metric: 'QueryTimeMicroseconds',
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
  },
  {
    metric: 'ReadBackoff',
    formatter: number
  },
  {
    metric: 'ReadBufferAIORead',
    formatter: number
  },
  {
    metric: 'ReadBufferAIOReadBytes',
    formatter: bytes
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
    metric: 'ReadCompressedBytes',
    formatter: bytes
  },
  {
    metric: 'RealTimeMicroseconds',
    formatter: number
  },
  {
    metric: 'RegexpCreated',
    formatter: number
  },
  {
    metric: 'RejectedInserts',
    formatter: number
  },
  {
    metric: 'ReplicaPartialShutdown',
    formatter: number
  },
  {
    metric: 'ReplicatedDataLoss',
    formatter: number
  },
  {
    metric: 'ReplicatedPartChecks',
    formatter: number
  },
  {
    metric: 'ReplicatedPartChecksFailed',
    formatter: number
  },
  {
    metric: 'ReplicatedPartFailedFetches',
    formatter: number
  },
  {
    metric: 'ReplicatedPartFetches',
    formatter: number
  },
  {
    metric: 'ReplicatedPartFetchesOfMerged',
    formatter: number
  },
  {
    metric: 'ReplicatedPartMerges',
    formatter: number
  },
  {
    metric: 'Seek',
    formatter: number
  },
  {
    metric: '',
    formatter: number
  },
  {
    metric: 'SelectQuery',
    formatter: number
  },
  {
    metric: 'SelectQueryTimeMicroseconds',
    formatter: number
  },
  {
    metric: 'SelectedBytes',
    formatter: bytes
  },
  {
    metric: 'SelectedMarks',
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
    metric: 'SelectedRows',
    formatter: number
  },
  {
    metric: 'SlowRead',
    formatter: number
  },
  {
    metric: 'SoftPageFaults',
    formatter: number
  },
  {
    metric: 'SystemTimeMicroseconds',
    formatter: number
  },
  {
    metric: 'UserTimeMicroseconds',
    formatter: number
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
    metric: 'ZooKeeperBytesReceived',
    formatter: bytes
  },
  {
    metric: 'ZooKeeperBytesSent',
    formatter: bytes
  },
  {
    metric: 'ZooKeeperClose',
    formatter: number
  },
  {
    metric: 'ZooKeeperCreate',
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
    metric: 'ZooKeeperHardwareExceptions',
    formatter: number
  },
  {
    metric: 'ZooKeeperInit',
    formatter: number
  },
  {
    metric: 'ZooKeeperList',
    formatter: number
  },
  {
    metric: 'ZooKeeperMulti',
    formatter: number
  },
  {
    metric: 'ZooKeeperRemove',
    formatter: number
  },

  // system.asynchronous_metrics
  {
    metric: 'CompiledExpressionCacheCount',
    formatter: number
  },
  {
    metric: 'HTTPThreads',
    formatter: number
  },
  {
    metric: 'InterserverThreads',
    formatter: number
  },
  {
    metric: 'MarkCacheBytes',
    formatter: number
  },
  {
    metric: 'MarkCacheFiles',
    formatter: number
  },
  {
    metric: 'MaxPartCountForPartition',
    formatter: number
  },
  {
    metric: 'MemoryCode',
    formatter: number
  },
  {
    metric: 'MemoryDataAndStack',
    formatter: number
  },
  {
    metric: 'MemoryResident',
    formatter: number
  },
  {
    metric: 'MemoryShared',
    formatter: number
  },
  {
    metric: 'MemoryVirtual',
    formatter: number
  },
  {
    metric: 'NumberOfDatabases',
    formatter: number
  },
  {
    metric: 'NumberOfTables',
    formatter: number
  },
  {
    metric: 'ReplicasMaxAbsoluteDelay',
    formatter: number
  },
  {
    metric: 'ReplicasMaxInsertsInQueue',
    formatter: number
  },
  {
    metric: 'ReplicasMaxMergesInQueue',
    formatter: number
  },
  {
    metric: 'ReplicasMaxQueueSize',
    formatter: number
  },
  {
    metric: 'ReplicasMaxRelativeDelay',
    formatter: number
  },
  {
    metric: 'ReplicasSumInsertsInQueue',
    formatter: number
  },
  {
    metric: 'ReplicasSumMergesInQueue',
    formatter: number
  },
  {
    metric: 'ReplicasSumQueueSize',
    formatter: number
  },
  {
    metric: 'TCPThreads',
    formatter: number
  },
  {
    metric: 'TotalBytesOfMergeTreeTables',
    formatter: bytes
  },
  {
    metric: 'TotalPartsOfMergeTreeTables',
    formatter: number
  },
  {
    metric: 'TotalRowsOfMergeTreeTables',
    formatter: number
  },
  {
    metric: 'UncompressedCacheBytes',
    formatter: bytes
  },
  {
    metric: 'Uptime',
    formatter: number
  }
];
