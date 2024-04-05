/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { zeroDecimalPlaces } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-forge:plugins.kubernetesPod.containers'),
    metric: 'container_count',
    formatter: zeroDecimalPlaces
  },
  {
    label: t('in-forge:plugins.kubernetesPod.restarts'),
    metric: 'restartCount',
    formatter: zeroDecimalPlaces
  }
];
