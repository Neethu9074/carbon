/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { getDynamicMetricMatch } from 'in-sdk/metrics/metricDefinitions';
import { millis, number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metrics: [
      'threadPools.webContainer.activeThreads',
      'threadPools.webContainer.poolSize',
      'threadPools.webContainer.concurrentlyHungThreads',
      'threadPools.webContainer.declaredThreadHung'
    ],
    labels: [
      t('in-forge:plugins.webSphereAppContainer.labelActiveThreads'),
      t('in-forge:plugins.webSphereAppContainer.labelPoolSize'),
      t('in-forge:plugins.webSphereAppContainer.labelConcurrentlyHungThreads'),
      t('in-forge:plugins.webSphereAppContainer.labelDeclaredThreadHung')
    ],
    min: 0,
    category: [t('in-forge:plugins.webSphereAppContainer.categoryThreadPool')],
    formatter: number
  },
  {
    metrics: [
      'transactions.activeCount',
      'transactions.committedCount',
      'transactions.rolledbackCount',
      'transactions.globalTimeoutCount'
    ],
    labels: [
      t('in-forge:plugins.webSphereAppContainer.titleTransactionActiveCount'),
      t('in-forge:plugins.webSphereAppContainer.titleTransactionCommittedCount'),
      t('in-forge:plugins.webSphereAppContainer.titleTransactionRolledbackCount'),
      t('in-forge:plugins.webSphereAppContainer.titleTransactionGlobalTimeoutCount')
    ],
    min: 0,
    category: [t('in-forge:plugins.webSphereAppContainer.titleTransactionsModule')],
    formatter: number
  },
  {
    metrics: [
      'transactions.globalTranTime'
    ],
    labels: [
      t('in-forge:plugins.webSphereAppContainer.titleTransactionGlobalTranTime')
    ],
    min: 0,
    category: [t('in-forge:plugins.webSphereAppContainer.titleTransactionsModule')],
    formatter: millis
  },  
  {
    metric: getDynamicMetricMatch(
      'sessionManagers',
      'activeCount',
      t('in-forge:plugins.webSphereAppContainer.labelWebModule')
    ),
    label: t('in-forge:plugins.webSphereApplicationContainer.sessions'),
    category: [t('in-forge:plugins.webSphereAppContainer.labelWebModule')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch(
      'sessionManagers',
      'createCount',
      t('in-forge:plugins.webSphereAppContainer.labelWebModule')
    ),
    label: t('in-forge:plugins.webSphereApplicationContainer.sessions'),
    category: [t('in-forge:plugins.webSphereAppContainer.labelWebModule')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch(
      'sessionManagers',
      'invalidateCount',
      t('in-forge:plugins.webSphereAppContainer.labelWebModule')
    ),
    label: t('in-forge:plugins.webSphereApplicationContainer.sessions'),
    category: [t('in-forge:plugins.webSphereAppContainer.labelWebModule')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch(
      'servlets',
      'avgResponseTime',
      t('in-forge:plugins.webSphereAppContainer.labelServlet')
    ),
    label: t('in-forge:plugins.webSphereAppContainer.labelAverageResponseTime'),
    category: [t('in-forge:plugins.webSphereAppContainer.labelServlets')],
    min: 0,
    formatter: millis
  },
  {
    metric: getDynamicMetricMatch('servlets', 'requests', t('in-forge:plugins.webSphereAppContainer.labelServlet')),
    label: t('in-forge:plugins.webSphereAppContainer.labelRequestCount'),
    category: [t('in-forge:plugins.webSphereAppContainer.labelServlets')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('servlets', 'errors', t('in-forge:plugins.webSphereAppContainer.labelServlet')),
    label: t('in-forge:plugins.webSphereAppContainer.labelErrors'),
    category: [t('in-forge:plugins.webSphereAppContainer.labelServlets')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch(
      'datasources',
      'poolSize',
      t('in-forge:plugins.webSphereAppContainer.labelDatasource')
    ),
    label: t('in-forge:plugins.webSphereAppContainer.labelPoolSize'),
    category: [t('in-forge:plugins.webSphereAppContainer.labelDatasources')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch(
      'datasources',
      'freePoolSize',
      t('in-forge:plugins.webSphereAppContainer.labelDatasource')
    ),
    label: t('in-forge:plugins.webSphereAppContainer.titleFreeConnectionsInPool'),
    category: [t('in-forge:plugins.webSphereAppContainer.labelDatasources')],
    min: 0,
    formatter: millis
  },
  {
    metric: getDynamicMetricMatch(
      'datasources',
      'waitingThreadCount',
      t('in-forge:plugins.webSphereAppContainer.labelDatasource')
    ),
    label: t('in-forge:plugins.webSphereAppContainer.titleThreadsWaitingForConnection'),
    category: [t('in-forge:plugins.webSphereAppContainer.labelDatasources')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch(
      'datasources',
      'averageWaitTime',
      t('in-forge:plugins.webSphereAppContainer.labelDatasource')
    ),
    label: t('in-forge:plugins.webSphereAppContainer.titleAverageWaitingTime'),
    category: [t('in-forge:plugins.webSphereAppContainer.labelDatasources')],
    min: 0,
    formatter: millis
  },
  {
    metric: getDynamicMetricMatch('ejbs', 'responseTime', t('in-forge:plugins.webSphereAppContainer.labelEJB')),
    label: t('in-forge:plugins.webSphereAppContainer.titleResponseTime'),
    category: [t('in-forge:plugins.webSphereAppContainer.labelEJBs')],
    min: 0,
    formatter: millis
  },
  {
    metric: getDynamicMetricMatch('ejbs', 'reponseCount', t('in-forge:plugins.webSphereAppContainer.labelEJB')),
    label: t('in-forge:plugins.webSphereAppContainer.titleResponseCount'),
    category: [t('in-forge:plugins.webSphereAppContainer.labelEJBs')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('objectPools', 'objectsCreatedCount', t('in-forge:plugins.webSphereAppContainer.labelObjectPool')),
    label: t('in-forge:plugins.webSphereAppContainer.titleObjectsCreatedCount'),
    category: [t('in-forge:plugins.webSphereAppContainer.labelObjectPools')],
    min: 0,
    formatter: number
  },  
  {
    metric: getDynamicMetricMatch('objectPools', 'objectsAllocatedCount', t('in-forge:plugins.webSphereAppContainer.labelObjectPool')),
    label: t('in-forge:plugins.webSphereAppContainer.titleObjectsAllocatedCount'),
    category: [t('in-forge:plugins.webSphereAppContainer.labelObjectPools')],
    min: 0,
    formatter: number
  },    
  {
    metric: getDynamicMetricMatch('objectPools', 'idleObjectsSize', t('in-forge:plugins.webSphereAppContainer.labelObjectPool')),
    label: t('in-forge:plugins.webSphereAppContainer.titleIdleObjectsSize'),
    category: [t('in-forge:plugins.webSphereAppContainer.labelObjectPools')],
    min: 0,
    formatter: number
  },     
  {
    metric: getDynamicMetricMatch('objectPools', 'objectsReturnedCount', t('in-forge:plugins.webSphereAppContainer.labelObjectPool')),
    label: t('in-forge:plugins.webSphereAppContainer.titleObjectsReturnedCount'),
    category: [t('in-forge:plugins.webSphereAppContainer.labelObjectPools')],
    min: 0,
    formatter: number
  },  
  {
    metric: getDynamicMetricMatch('jcas', 'poolSize', t('in-forge:plugins.webSphereAppContainer.labelJ2CModule')),
    label: t('in-forge:plugins.webSphereAppContainer.titleJ2CPoolSize'),
    category: [t('in-forge:plugins.webSphereAppContainer.labelJ2CModules')],
    min: 0,
    formatter: number
  },   
  {
    metric: getDynamicMetricMatch('jcas', 'freePoolSize', t('in-forge:plugins.webSphereAppContainer.labelJ2CModule')),
    label: t('in-forge:plugins.webSphereAppContainer.titleJ2CFreePoolSize'),
    category: [t('in-forge:plugins.webSphereAppContainer.labelJ2CModules')],
    min: 0,
    formatter: number
  },   
  {
    metric: getDynamicMetricMatch('jcas', 'faults', t('in-forge:plugins.webSphereAppContainer.labelJ2CModule')),
    label: t('in-forge:plugins.webSphereAppContainer.titleJ2CFaultCount'),
    category: [t('in-forge:plugins.webSphereAppContainer.labelJ2CModules')],
    min: 0,
    formatter: number
  },    
  {
    metric: getDynamicMetricMatch('jcas', 'percentUsed', t('in-forge:plugins.webSphereAppContainer.labelJ2CModule')),
    label: t('in-forge:plugins.webSphereAppContainer.titleJ2CPercentUsed'),
    category: [t('in-forge:plugins.webSphereAppContainer.labelJ2CModules')],
    min: 0,
    formatter: number
  },   
  {
    metric: getDynamicMetricMatch('jcas', 'useTime', t('in-forge:plugins.webSphereAppContainer.labelJ2CModule')),
    label: t('in-forge:plugins.webSphereAppContainer.titleJ2CUseTime'),
    category: [t('in-forge:plugins.webSphereAppContainer.labelJ2CModules')],
    min: 0,
    formatter: millis
  },  
  {
    metric: getDynamicMetricMatch('jcas', 'avgWait', t('in-forge:plugins.webSphereAppContainer.labelJ2CModule')),
    label: t('in-forge:plugins.webSphereAppContainer.titleJ2CWaitTime'),
    category: [t('in-forge:plugins.webSphereAppContainer.labelJ2CModules')],
    min: 0,
    formatter: millis
  }  
];
