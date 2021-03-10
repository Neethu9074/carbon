/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';

import { percentage } from 'in-services/formatters/number';

export default [
  {
    metrics: ['currentMemUsage'],
    labels: [t('in-forge:plugins.ibmDataPowerDomain.currentMemUsage')],
    min: 0,
    category: [t('in-forge:plugins.ibmDataPowerDomain.currentMemUsage')],
    formatter: percentage
  }
];
