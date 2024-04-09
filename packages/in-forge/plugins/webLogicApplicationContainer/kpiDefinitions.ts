/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { zeroDecimalPlaces } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-forge:plugins.webLogicAppContainer.labelIdleThreads'),
    metric: 'threadPool.idleThreads',
    formatter: zeroDecimalPlaces
  },
  {
    label: t('in-forge:plugins.webLogicAppContainer.labelErrorLogMessages'),
    metric: 'serverLogMessages.errors',
    formatter: zeroDecimalPlaces
  }
];
