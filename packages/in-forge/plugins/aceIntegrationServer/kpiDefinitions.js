/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';

import { number } from 'in-services/formatters/number';

export default [
  {
    label: t('in-forge:plugins.aceIntegrationServer.cumulativeNumberOfGcCollections'),
    metric: 'cumulativeNumberOfGcCollections',
    formatter: number.compact
  },
  {
    label: t('in-forge:plugins.aceIntegrationServer.cumulativeGCTimeInSeconds'),
    metric: 'cumulativeGCTimeInSeconds',
    formatter: number.compact
  }
];
