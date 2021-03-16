/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { zeroDecimalPlaces } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-forge:plugins.openLDAP.operationsComplete'),
    metric: 'ops_completed',
    formatter: zeroDecimalPlaces
  },
  {
    label: t('in-forge:plugins.openLDAP.currentConnections'),
    metric: 'conn_current',
    formatter: zeroDecimalPlaces
  }
];
