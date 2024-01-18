/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-forge:plugins.tibcoBWProcess.created'),
    metric: 'created',
    formatter: number.compact
  },
  {
    label: t('in-forge:plugins.tibcoBWProcess.completed'),
    metric: 'completed',
    formatter: number.compact
  },
  {
    label: t('in-forge:plugins.tibcoBWProcess.suspended'),
    metric: 'suspended',
    formatter: number.compact
  },
  {
    label: t('in-forge:plugins.tibcoBWProcess.failed'),
    metric: 'failed',
    formatter: number.compact
  }
] as const;
