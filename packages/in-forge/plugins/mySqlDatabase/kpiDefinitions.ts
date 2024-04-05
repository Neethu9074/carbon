/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-forge:plugins.mySqlDatabase.queries'),
    metric: 'status.QUERIES',
    formatter: number.compact
  },
  {
    label: t('in-forge:plugins.mySqlDatabase.threadsCconnected'),
    metric: 'status.THREADS_CONNECTED',
    formatter: number.compact
  }
];
