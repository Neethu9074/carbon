/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';

import { zeroDecimalPlaces } from 'in-services/formatters/number';

export default [
  {
    label: t('in-forge:plugins.sybase.labelUserConnections'),
    metric: 'stats.connCount',
    formatter: zeroDecimalPlaces
  },
  {
    label: t('in-forge:plugins.sybase.labelDiskReads'),
    metric: 'stats.diskRead',
    formatter: zeroDecimalPlaces
  }
];
