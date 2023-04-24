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
      'metrics.Availability.DATABASE_AVAILABILITY.status',
      'metrics.Availability.DATABASE_AVAILABILITY.minValue',
      'metrics.Availability.DATABASE_AVAILABILITY.maxValue',
      'metrics.Availability.JAVA_SYSTEM_HTTP_AVAILABILITY_Java_System_Http_Availability.value',
      'metrics.Exceptions.J2EE_Messages_Issue.J2EE_SYS_J2EEMESSAGES_ERROR.value',
      'metrics.Performance.J2EE_Messages_Performance.J2EE_SYS_J2EEMESSAGES_CANCELED.value',
      'metrics.Performance.J2EE_Messages_Performance.J2EE_SYS_J2EEMESSAGES_DELIVERED.value'
    ],
    labels: [
      t('in-forge:plugins.sapJavaSystem.status'),
      t('in-forge:plugins.sapJavaSystem.minValue'),
      t('in-forge:plugins.sapJavaSystem.maxValue'),
      t('in-forge:plugins.sapJavaSystem.systemHttpAvailability'),
      t('in-forge:plugins.sapJavaSystem.j2EEMessagesError'),
      t('in-forge:plugins.sapJavaSystem.j2EEMessagesCancelled'),
      t('in-forge:plugins.sapJavaSystem.j2EEMessagesDelivered')
    ],
    min: 0,
    formatter: number.compact
  }
];
