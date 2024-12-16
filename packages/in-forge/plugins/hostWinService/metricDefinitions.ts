/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metrics: ['state'],
    labels: [t('in-forge:plugins.host.dashboard.state')],
    min: 0,
    category: [t('in-forge:plugins.host.dashboard.service')],
    formatter: number.compact
  }
];
