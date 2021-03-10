/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';

import { percentage } from 'in-services/formatters/number';

export default [
  {
    label: t('in-forge:plugins.ibmDataPowerService.currentMemUsage'),
    metric: 'currentMemUsage',
    formatter: percentage.compact
  }
];
