/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-forge:plugins.awsMskBroker.partitions'),
    metric: 'partition_count',
    formatter: number.compact
  },
  {
    label: t('in-forge:plugins.awsMskBroker.underReplicatedPartitions'),
    metric: 'under_replicated_partitions',
    formatters: number.compact
  }
];
