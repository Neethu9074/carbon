/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-forge:plugins.ibmInfosphereCdc.targetApplyInserts'),
    metric: 'targetApplyInserts',
    formatter: number.compact
  },
  {
    label: t('in-forge:plugins.ibmInfosphereCdc.targetApplyUpdates'),
    metric: 'targetApplyUpdates',
    formatter: number.compact
  },
  {
    label: t('in-forge:plugins.ibmInfosphereCdc.targetApplyDeletes'),
    metric: 'targetApplyDeletes',
    formatter: number.compact
  }
];
