/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { muSecondsToMillis, number, bytes } from 'in-services/formatters/number';
import { getDynamicMetricMatch } from 'in-sdk/metrics/metricDefinitions';
import { t } from 'in-i18n';

export default [
  {
    metrics: ['clientrequests.read.count', 'clientrequests.write.count'],
    labels: [t('in-forge:plugins.cassandraCluster.labelRead'), t('in-forge:plugins.cassandraCluster.labelWrite')],
    min: 0,
    formatter: number
  },
  {
    metrics: [
      'clientrequests.read.mean',
      'clientrequests.read.50',
      'clientrequests.read.95',
      'clientrequests.read.99',
      'clientrequests.write.mean',
      'clientrequests.write.50',
      'clientrequests.write.95',
      'clientrequests.write.99'
    ],
    labels: [
      t('in-forge:plugins.cassandraCluster.labelMean'),
      t('in-forge:plugins.cassandraCluster.label50P'),
      t('in-forge:plugins.cassandraCluster.label95P'),
      t('in-forge:plugins.cassandraCluster.label99P'),
      t('in-forge:plugins.cassandraCluster.labelMean'),
      t('in-forge:plugins.cassandraCluster.label50P'),
      t('in-forge:plugins.cassandraCluster.label95P'),
      t('in-forge:plugins.cassandraCluster.label99P')
    ],
    min: 0,
    category: [t('in-forge:plugins.cassandraCluster.latency')],
    formatter: muSecondsToMillis
  },
  {
    metrics: ['overallDiskSize'],
    labels: [t('in-forge:plugins.cassandraCluster.labelOverallDiskSize')],
    min: 0,
    formatter: bytes
  },
  {
    metrics: ['keyspaceCount'],
    labels: [t('in-forge:plugins.cassandraCluster.labelKeyspaceCount')],
    category: [t('in-forge:plugins.cassandraCluster.keyspaces')],
    min: 0,
    formatter: number
  },
  {
    metrics: ['nodeCount'],
    labels: [t('in-forge:plugins.cassandraCluster.labelClusterNodes')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('keyspace', 'diskSize', 'Keyspace'),
    label: t('in-forge:plugins.cassandraCluster.labelDiskSize'),
    category: [t('in-forge:plugins.cassandraCluster.keyspaces')],
    min: 0,
    formatter: bytes
  },
  {
    metric: 'unreachableNodes',
    label: t('in-forge:plugins.cassandraCluster.labelUnreachable'),
    min: 0,
    formatter: number
  }
];
