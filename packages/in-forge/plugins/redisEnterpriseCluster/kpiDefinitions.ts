/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-forge:plugins.redisEnterpriseCluster.throughputOpsSecond'),
    metric: 'throughput',
    formatter: number.compact
  },
  {
    label: t('in-forge:plugins.redisEnterpriseCluster.keyspaceHits'),
    metric: 'keyspace_hits',
    formatter: number.compact
  }
];
