/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metrics: ['threads', 'totMem', 'freeMem', 'usedMem', 'percMem', 'percCPU'],
    labels: [
      t('in-forge:plugins.tibcoBWAppNode.threads'),
      t('in-forge:plugins.tibcoBWAppNode.totMem'),
      t('in-forge:plugins.tibcoBWAppNode.freeMem'),
      t('in-forge:plugins.tibcoBWAppNode.usedMem'),
      t('in-forge:plugins.tibcoBWAppNode.percentMem'),
      t('in-forge:plugins.tibcoBWAppNode.percentCPU')
    ],
    min: 0,
    category: [t('in-forge:plugins.tibcoBWAppNode.appnode')],
    formatter: number
  }
];
