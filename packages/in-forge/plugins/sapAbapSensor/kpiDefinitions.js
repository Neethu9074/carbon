/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { t } from 'in-i18n';

const statusFormatter = function (status) {
  switch (status) {
    case 1:
      return 'ACTIVE';
    case 0:
      return 'INACTIVE';
    default:
      return '-';
  }
};

export default [
  {
    label: t('in-sap:abapsensor.connectionStatus'),
    metric: 'sapMetricsStats.status',
    formatter: statusFormatter
  }
];
