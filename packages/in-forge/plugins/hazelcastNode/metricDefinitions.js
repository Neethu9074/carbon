/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { number, withSiPrefixZeroDecimalPlaces } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metrics: [
      'nodeMetrics.clientEndpointCount',
      'nodeMetrics.eventQueueSize',
      'nodeMetrics.migrationQueueSize',
      'nodeMetrics.operationCount'
    ],
    labels: [
      t('in-forge:plugins.hazelcastNode.clientEndpointCount'),
      t('in-forge:plugins.hazelcastNode.eventQueueSize'),
      t('in-forge:plugins.hazelcastNode.migrationQueueSize'),
      t('in-forge:plugins.hazelcastNode.operationCount')
    ],
    min: 0,
    formatter: number
  },
  {
    metrics: ['isLiteMember', 'isLocalMemberSafe'],
    labels: [t('in-forge:plugins.hazelcastNode.isLiteMember'), t('in-forge:plugins.hazelcastNode.isLocalMemberSafe')],
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
      t('in-forge:plugins.hazelcastNode.iCache'),
      t('in-forge:plugins.hazelcastNode.iMap'),
      t('in-forge:plugins.hazelcastNode.replicatedMap'),
      t('in-forge:plugins.hazelcastNode.multiMap'),
      t('in-forge:plugins.hazelcastNode.iQueue'),
      t('in-forge:plugins.hazelcastNode.iList'),
      t('in-forge:plugins.hazelcastNode.iSet'),
      t('in-forge:plugins.hazelcastNode.iTopic'),
      t('in-forge:plugins.hazelcastNode.iExecutorService'),
      t('in-forge:plugins.hazelcastNode.other')
    ],
    min: 0,
    category: [t('in-forge:plugins.hazelcastNode.distributedObjects')],
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
    labels: [
      t('in-forge:plugins.hazelcastNode.aSyncExecutor'),
      t('in-forge:plugins.hazelcastNode.clientExecutor'),
      t('in-forge:plugins.hazelcastNode.queryExecutor'),
      t('in-forge:plugins.hazelcastNode.scheduledExecutor'),
      t('in-forge:plugins.hazelcastNode.systemExecutor'),
      t('in-forge:plugins.hazelcastNode.ioExecutor')
    ],
    min: 0,
    category: [t('in-forge:plugins.hazelcastNode.executionServiceQueueSize')],
    formatter: number
  }
];
