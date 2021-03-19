/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { zeroDecimalPlaces } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-forge:plugins.iBMCloudFunctions.labelConcurrentInvocations'),
    metric: 'ibm_functions_concurrent-invocations',
    formatter: zeroDecimalPlaces
  }
];
