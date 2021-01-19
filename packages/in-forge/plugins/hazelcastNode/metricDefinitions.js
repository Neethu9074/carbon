/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { number, withSiPrefixZeroDecimalPlaces } from 'in-services/formatters/number';

export default [
  {
    metrics: [
      'nodeMetrics.clientEndpointCount',
      'nodeMetrics.eventQueueSize',
      'nodeMetrics.migrationQueueSize',
      'nodeMetrics.migrationQueueSize'
    ],
    labels: ['Client Endpoint Count', 'Migration Queue Size', 'EventQueue Size', 'Operation Count'],
    min: 0,
    formatter: number
  },
  {
    metrics: ['isLiteMember', 'isLocalMemberSafe'],
    labels: ['Is Lite Member', 'Is Local Member Safe'],
    min: 0,
    formatter: number
  },
  {
    metrics: [
      'distributedObjects.cacheCount',
      'distributedObjects.mapCount',
      'distributedObjects.replicatedMapCount',
      'distributedObjects.multiMapCount',
      'distributedObjects.queueCount',
      'distributedObjects.listCount',
      'distributedObjects.setCount',
      'distributedObjects.topicCount',
      'distributedObjects.executorCount',
      'distributedObjects.otherCount'
    ],
    labels: [
      'ICache',
      'IMap',
      'ReplicatedMap',
      'MultiMap',
      'IQueue',
      'IList',
      'ISet',
      'ITopic',
      'IExecutorService',
      'Other'
    ],
    min: 0,
    category: ['Distributed Objects'],
    formatter: withSiPrefixZeroDecimalPlaces
  },
  {
    metrics: [
      'executorServiceQueueSize.asyncExecutor',
      'executorServiceQueueSize.clientExecutor',
      'executorServiceQueueSize.queryExecutor',
      'executorServiceQueueSize.scheduledExecutor',
      'executorServiceQueueSize.systemExecutor',
      'executorServiceQueueSize.ioExecutor'
    ],
    labels: ['ASyncExecutor', 'ClientExecutor', 'QueryExecutor', 'ScheduledExecutor', 'SystemExecutor', 'IOExecutor'],
    min: 0,
    category: ['ExecutionService Queue Size'],
    formatter: number
  }
];
