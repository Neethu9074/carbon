/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-forge:plugins.nomadScheduler.runningAllocations'),
    metric: 'nomad.client.allocations.running',
    formatter: number.compact
  },
  {
    label: t('in-forge:plugins.nomadScheduler.migratingAllocations'),
    metric: 'nomad.client.allocations.migrating',
    formatter: number.compact
  }
];
