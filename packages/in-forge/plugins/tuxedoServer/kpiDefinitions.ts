/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-forge:plugins.tuxedoServer.queued'),
    metric: 'numQueued',
    formatter: number.compact
  },
  {
    label: t('in-forge:plugins.tuxedoServer.completed'),
    metric: 'numCompleted',
    formatter: number.compact
  }
];
