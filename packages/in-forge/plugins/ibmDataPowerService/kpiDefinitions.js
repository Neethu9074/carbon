/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { percentage } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-forge:plugins.ibmDataPowerService.currentMemUsage'),
    metric: 'currentMemUsage',
    formatter: percentage.compact
  }
];
