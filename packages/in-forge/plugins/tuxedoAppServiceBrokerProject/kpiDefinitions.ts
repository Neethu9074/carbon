/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { number, millis } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-forge:plugins.tuxedoAppServiceBrokerProject.avgResTime'),
    metric: 'avgResTime',
    formatter: millis.detailed
  },
  {
    label: t('in-forge:plugins.tuxedoAppServiceBrokerProject.throughput'),
    metric: 'throughput',
    formatter: number.detailed
  }
];
