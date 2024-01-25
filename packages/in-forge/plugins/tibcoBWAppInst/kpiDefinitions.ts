/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-forge:plugins.tibcoBWAppInst.created'),
    metric: 'created',
    formatter: number.compact
  },
  {
    label: t('in-forge:plugins.tibcoBWAppInst.running'),
    metric: 'running',
    formatter: number.compact
  },
  {
    label: t('in-forge:plugins.tibcoBWAppInst.faulted'),
    metric: 'faulted',
    formatter: number.compact
  },
  {
    label: t('in-forge:plugins.tibcoBWAppInst.cancelled'),
    metric: 'cancelled',
    formatter: number.compact
  },
  {
    label: t('in-forge:plugins.tibcoBWAppInst.scheduled'),
    metric: 'scheduled',
    formatter: number.compact
  },
  {
    label: t('in-forge:plugins.tibcoBWAppInst.pagedout'),
    metric: 'pagedout',
    formatter: number.compact
  }
] as const;
