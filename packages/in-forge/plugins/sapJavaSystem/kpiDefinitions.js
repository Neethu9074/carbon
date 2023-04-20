/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-forge:plugins.sapJavaSystem.messageDeliveredStatus'),
    metric: 'metrics.Performance.J2EE_Messages_Performance.J2EE_SYS_J2EEMESSAGES_DELIVERED.status',
    formatter: number.compact
  }
];
