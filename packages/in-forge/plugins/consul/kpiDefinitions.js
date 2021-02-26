/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';

import { number } from 'in-services/formatters/number';

export default [
  {
    label: t('in-forge:plugins.consul.labelConsulAutopilot'),
    metric: 'consul.autopilot.healthy',
    formatter: number.compact
  }
];
