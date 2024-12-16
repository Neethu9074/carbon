/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { zeroDecimalPlaces } from 'in-services/formatters/number';
import { t } from 'in-i18n';
export default [
  {
    label: t('in-forge:plugins.awsAutoScaling.labelGroupInServiceInstancesKpi'),
    metric: 'group_in_service_instances',
    formatter: zeroDecimalPlaces
  },
  {
    label: t('in-forge:plugins.awsAutoScaling.labelGroupTotalInstancesKpi'),
    metric: 'group_total_instances',
    formatter: zeroDecimalPlaces
  }
];
