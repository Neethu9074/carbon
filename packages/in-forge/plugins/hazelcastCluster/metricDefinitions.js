/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { siPrefix } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metrics: ['isClusterSafe', 'nodeCount'],
    labels: [t('in-forge:plugins.hazelcastCluster.isClusterSafe'), t('in-forge:plugins.hazelcastCluster.nodeCount')],
    min: 0,
    formatter: siPrefix
  }
];
