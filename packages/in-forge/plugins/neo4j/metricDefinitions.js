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
import { t } from 'in-i18n';

export default [
  {
    metrics: [
      'primitiveCount.nodeIds',
      'primitiveCount.propertyIds',
      'primitiveCount.relationshipIds',
      'primitiveCount.relationShipTypeIds'
    ],
    labels: [
      t('in-forge:plugins.neo4j.nodeIDs'),
      t('in-forge:plugins.neo4j.propertyIDs'),
      t('in-forge:plugins.neo4j.relationshipIDs'),
      t('in-forge:plugins.neo4j.relationShipTypeIDs')
    ],
    min: 0,
    category: [t('in-forge:plugins.neo4j.idAllocation')],
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
      t('in-forge:plugins.neo4j.nodes'),
      t('in-forge:plugins.neo4j.properties'),
      t('in-forge:plugins.neo4j.relationships'),
      t('in-forge:plugins.neo4j.stringProperties'),
      t('in-forge:plugins.neo4j.arrayProperties'),
      t('in-forge:plugins.neo4j.logicalLog'),
      t('in-forge:plugins.neo4j.totalStore')
    ],
    min: 0,
    category: [t('in-forge:plugins.neo4j.storeFileSizes')],
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
      t('in-forge:plugins.neo4j.nodes'),
      t('in-forge:plugins.neo4j.properties'),
      t('in-forge:plugins.neo4j.relationships'),
      t('in-forge:plugins.neo4j.labels'),
      t('in-forge:plugins.neo4j.stringProperties'),
      t('in-forge:plugins.neo4j.arrayProperties'),
      t('in-forge:plugins.neo4j.schemas'),
      t('in-forge:plugins.neo4j.counters'),
      t('in-forge:plugins.neo4j.indices'),
      t('in-forge:plugins.neo4j.transactionLogs'),
      t('in-forge:plugins.neo4j.totalStore')
    ],
    min: 0,
    category: [t('in-forge:plugins.neo4j.storeSizes')],
    formatter: bytesZeroDecimalPlaces
  },
  {
    metrics: ['pageCache.bytesRead', 'pageCache.bytesWritten'],
    labels: [t('in-forge:plugins.neo4j.bytesRead'), t('in-forge:plugins.neo4j.bytesWritten')],
    min: 0,
    category: [t('in-forge:plugins.neo4j.pageCache')],
    formatter: bytesZeroDecimalPlaces
  },
  {
    metrics: ['pageCache.hitRatio', 'pageCache.usageRatio'],
    labels: [t('in-forge:plugins.neo4j.hitRatio'), t('in-forge:plugins.neo4j.usageRatio')],
    min: 0,
    max: 100,
    category: [t('in-forge:plugins.neo4j.pageCache')],
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
    labels: [
      t('in-forge:plugins.neo4j.pins'),
      t('in-forge:plugins.neo4j.flushes'),
      t('in-forge:plugins.neo4j.faults'),
      t('in-forge:plugins.neo4j.evictions'),
      t('in-forge:plugins.neo4j.evictionExceptions'),
      t('in-forge:plugins.neo4j.fileMappings'),
      t('in-forge:plugins.neo4j.fileUnmappings')
    ],
    min: 0,
    category: [t('in-forge:plugins.neo4j.pageCache')],
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
    labels: [
      t('in-forge:plugins.neo4j.open'),
      t('in-forge:plugins.neo4j.opened'),
      t('in-forge:plugins.neo4j.committed'),
      t('in-forge:plugins.neo4j.rolledBack'),
      t('in-forge:plugins.neo4j.peakConcurrent'),
      t('in-forge:plugins.neo4j.lastTransactionId')
    ],
    min: 0,
    category: [t('in-forge:plugins.neo4j.transactions')],
    formatter: number.compact
  }
];
