/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { percentagePlain } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-forge:plugins.tibcoBWAppNode.percMem'),
    metric: 'percMem',
    formatter: percentagePlain.detailed
  },
  {
    label: t('in-forge:plugins.tibcoBWAppNode.percCPU'),
    metric: 'percCPU',
    formatter: percentagePlain.detailed
  }
] as const;
