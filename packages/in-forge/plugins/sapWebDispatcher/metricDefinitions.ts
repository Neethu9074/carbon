/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metrics: [
      'metrics.Availability.System_Availability.RECEIVING_STATUS_FROM_HOST.status',
      'metrics.Availability.WEBDISP_System_Availability.WEBDISP_AVAILABILITY_STATUS.value',
      'metrics.Exceptions.System_Availability.RECEIVING_STATUS_FROM_HOST.value'
    ],
    labels: [
      t('in-forge:plugins.sapWebDispatcher.systemAvailability'),
      t('in-forge:plugins.sapWebDispatcher.webDispatcherAvailability'),
      t('in-forge:plugins.sapWebDispatcher.recieveStatusFromHost')
    ],
    min: 0,
    formatter: number.compact
  }
];
