/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metric: 'plugin.host',
    label: t('in-forge:plugins.processingStatistics.hostCount'),
    min: 0,
    formatter: number
  },
  {
    metric: 'plugin.instanaAgent',
    label: t('in-forge:plugins.processingStatistics.instanaAgentCount'),
    min: 0,
    formatter: number
  }
];
