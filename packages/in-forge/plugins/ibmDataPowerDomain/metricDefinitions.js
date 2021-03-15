/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { percentage } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metrics: ['currentMemUsage'],
    labels: [t('in-forge:plugins.ibmDataPowerDomain.currentMemUsage')],
    min: 0,
    category: [t('in-forge:plugins.ibmDataPowerDomain.currentMemUsage')],
    formatter: percentage
  }
];
