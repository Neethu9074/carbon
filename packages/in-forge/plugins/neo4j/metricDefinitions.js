/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import {
  number,
  withSiPrefixZeroDecimalPlaces,
  bytesZeroDecimalPlaces,
  percentage
} from 'in-services/formatters/number';

export default [
  {
    metrics: [
      'primitiveCount.nodeIds',
      'primitiveCount.propertyIds',
      'primitiveCount.relationshipIds',
      'primitiveCount.relationShipTypeIds'
    ],
    labels: ['Node IDs', 'Property IDs', 'Relationship IDs', 'RelationShipType IDs'],
    min: 0,
    category: ['ID Allocation'],
    formatter: number
  },
  {
    metrics: [
      'storeFileSize.nodeStoreSize',
      'storeFileSize.propertyStoreSize',
      'storeFileSize.relationshipStoreSize',
      'storeFileSize.stringStoreSize',
      'storeFileSize.arrayStoreSize',
      'storeFileSize.logicalLogSize',
      'storeFileSize.totalStoreSize'
    ],
    labels: [
      'Nodes',
      'Properties',
      'Relationships',
      'String Properties',
      'Array Properties',
      'Logical Log',
      'Total Store'
    ],
    min: 0,
    category: ['Store File Sizes'],
    formatter: bytesZeroDecimalPlaces
  },
  {
    metrics: [
      'storeSize.nodeStoreSize',
      'storeSize.propertyStoreSize',
      'storeSize.relationshipStoreSize',
      'storeSize.labelStoreSize',
      'storeSize.stringStoreSize',
      'storeSize.arrayStoreSize',
      'storeSize.schemaStoreSize',
      'storeSize.countStoreSize',
      'storeSize.indexStoreSize',
      'storeSize.transactionLogsSize',
      'storeSize.totalStoreSize'
    ],
    labels: [
      'Nodes',
      'Properties',
      'Relationships',
      'Labels',
      'String Properties',
      'Array Properties',
      'Schemas',
      'Counters',
      'Indices',
      'Transaction Logs',
      'Total Store'
    ],
    min: 0,
    category: ['Store Sizes'],
    formatter: bytesZeroDecimalPlaces
  },
  {
    metrics: ['pageCache.bytesRead', 'pageCache.bytesWritten'],
    labels: ['Bytes Read', 'Bytes Written'],
    min: 0,
    category: ['Page Cache'],
    formatter: bytesZeroDecimalPlaces
  },
  {
    metrics: ['pageCache.hitRatio', 'pageCache.usageRatio'],
    labels: ['Hit Ratio', 'Usage Ratio'],
    min: 0,
    max: 100,
    category: ['Page Cache'],
    formatter: percentage.compact
  },
  {
    metrics: [
      'pageCache.pins',
      'pageCache.flushes',
      'pageCache.faults',
      'pageCache.evictions',
      'pageCache.evictionExceptions',
      'pageCache.fileMappings',
      'pageCache.fileUnmappings'
    ],
    labels: ['Pins', 'Flushes', 'Faults', 'Evictions', 'Eviction Exceptions', 'File Mappings', 'File Unmappings'],
    min: 0,
    category: ['Page Cache'],
    formatter: withSiPrefixZeroDecimalPlaces
  },
  {
    metrics: [
      'transactions.openTransactions',
      'transactions.openedTransactions',
      'transactions.committedTransactions',
      'transactions.rolledBackTransactions',
      'transactions.peakConcurrentTransactions',
      'transactions.lastCommittedTxId'
    ],
    labels: ['Open', 'Opened', 'Committed', 'Rolled Back', 'Peak Concurrent', 'Last Transaction ID'],
    min: 0,
    category: ['Transactions'],
    formatter: number.compact
  }
];
