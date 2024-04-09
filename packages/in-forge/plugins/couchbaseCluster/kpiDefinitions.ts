/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { bytes } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-forge:plugins.couchbaseCluster.labelUsedDisk'),
    metric: 'cluster.usedDisk',
    formatter: bytes.compact
  },
  {
    label: t('in-forge:plugins.couchbaseCluster.labelUsedMemory'),
    metric: 'cluster.usedMemory',
    formatter: bytes.compact
  }
];
