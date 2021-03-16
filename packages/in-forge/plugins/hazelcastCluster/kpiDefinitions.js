/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { number, siPrefix } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-forge:plugins.hazelcastCluster.nodeCount'),
    metric: 'nodeCount',
    formatter: number.compact
  },
  {
    label: t('in-forge:plugins.hazelcastCluster.isClusterSafe'),
    metric: 'isClusterSafe',
    formatters: siPrefix.compact
  }
];
