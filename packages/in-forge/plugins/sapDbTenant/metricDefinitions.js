/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metrics: ['metrics.Availability.HDB_SERVICE_AVAILABILITY_INST_VIA_DA.value'],
    labels: [t('in-forge:plugins.sapDbTenant.serviceAvailability')],
    min: 0,
    formatter: number.compact
  }
];
