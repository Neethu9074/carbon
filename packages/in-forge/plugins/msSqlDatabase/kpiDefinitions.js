/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { msZeroDecimalPlaces, zeroDecimalPlaces } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-forge:plugins.msSqlDatabase.userConnections'),
    metric: 'generalstats._total.user_connections',
    formatter: zeroDecimalPlaces
  },
  {
    label: t('in-forge:plugins.msSqlDatabase.pageIoLatchExWaitTimesMs'),
    metric: 'waitstats.PAGEIOLATCH_EX.wait_time_ms',
    formatter: msZeroDecimalPlaces
  }
];
