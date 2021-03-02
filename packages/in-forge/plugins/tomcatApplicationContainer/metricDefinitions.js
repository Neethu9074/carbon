/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';

import { getDynamicMetricMatch } from 'in-sdk/metrics/metricDefinitions';
import { number } from 'in-services/formatters/number';

const placeholderConnector = t('in-forge:plugins.tomcatAppContainer.titleConnector');
const placeholderExecutor = t('in-forge:plugins.tomcatAppContainer.titleExecutor');

export default [
  {
    metrics: ['totalSessionCount'],
    labels: [t('in-forge:plugins.tomcatAppContainer.labelTotalSessionCount')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('datasources', 'active', t('in-forge:plugins.tomcatAppContainer.labelDatasource')),
    label: t('in-forge:plugins.tomcatAppContainer.labelActiveDatasources'),
    category: [t('in-forge:plugins.tomcatAppContainer.categoryDatasourceConnectionPools')],
    min: 0,
    formatter: number
  },
  {
    metrics: [
      getDynamicMetricMatch('connectors', 'connections', placeholderConnector),
      getDynamicMetricMatch('connectors', 'threads', placeholderConnector),
      getDynamicMetricMatch('connectors', 'threadsBusy', placeholderConnector)
    ],
    labels: [
      t('in-forge:plugins.tomcatAppContainer.labelNumberOfConnections'),
      t('in-forge:plugins.tomcatAppContainer.labelNumberOfThreads'),
      t('in-forge:plugins.tomcatAppContainer.labelNumberOfBusyThreads')
    ],
    category: [t('in-forge:plugins.tomcatAppContainer.titleConnectors')],
    min: 0,
    formatter: number
  },
  {
    metrics: [
      getDynamicMetricMatch('executors', 'active', placeholderExecutor),
      getDynamicMetricMatch('executors', 'queueSize', placeholderExecutor),
      getDynamicMetricMatch('executors', 'poolSize', placeholderExecutor)
    ],
    labels: [
      t('in-forge:plugins.tomcatAppContainer.labelNumberOfActiveThreads'),
      t('in-forge:plugins.tomcatAppContainer.titleQueueSize'),
      t('in-forge:plugins.tomcatAppContainer.labelPoolSize')
    ],
    category: [t('in-forge:plugins.tomcatAppContainer.categoryThreadPools')],
    min: 0,
    formatter: number
  }
];
