/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metric: 'consul.autopilot.healthy',
    label: t('in-forge:plugins.consulCluster.labelConsulAutopilot'),
    formatter: number
  }
];
