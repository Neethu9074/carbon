/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { siPrefix, number, bytes } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metric: 'replicaSetCount',
    label: t('in-forge:plugins.mongoDbCluster.replicaSets'),
    min: 0,
    formatter: siPrefix
  },
  {
    metrics: ['documents.deleted', 'documents.inserted', 'documents.returned', 'documents.updated'],
    labels: [
      t('in-forge:plugins.mongoDbCluster.deleted'),
      t('in-forge:plugins.mongoDbCluster.inserted'),
      t('in-forge:plugins.mongoDbCluster.returned'),
      t('in-forge:plugins.mongoDbCluster.updated')
    ],
    min: 0,
    category: [t('in-forge:plugins.mongoDbCluster.documents')],
    formatter: number
  },
  {
    metric: 'connections',
    label: t('in-forge:plugins.mongoDbCluster.connections'),
    min: 0,
    formatter: number
  },
  {
    metric: 'repl.network_ops',
    label: t('in-forge:plugins.mongoDbCluster.replicationNetworkOps'),
    category: [t('in-forge:plugins.mongoDbCluster.replicaSet')],
    formatter: number
  },
  {
    metric: 'repl.network_bytes',
    label: t('in-forge:plugins.mongoDbCluster.replicationNetworkTraffic'),
    category: [t('in-forge:plugins.mongoDbCluster.replicaSet')],
    formatter: bytes
  }
];
