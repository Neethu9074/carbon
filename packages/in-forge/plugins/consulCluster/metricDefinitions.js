/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';

import { number } from 'in-services/formatters/number';

export default [
  {
    metric: 'consul.autopilot.healthy',
    label: t('in-forge:plugins.consulCluster.labelConsulAutopilot'),
    formatter: number
  }
];
