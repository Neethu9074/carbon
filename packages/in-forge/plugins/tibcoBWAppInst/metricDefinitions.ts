/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { zeroDecimalPlaces } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metrics: ['created', 'running', 'faulted', 'cancelled', 'scheduled', 'pagedout'],
    labels: [
      t('in-forge:plugins.tibcoBWAppInst.created'),
      t('in-forge:plugins.tibcoBWAppInst.running'),
      t('in-forge:plugins.tibcoBWAppInst.faulted'),
      t('in-forge:plugins.tibcoBWAppInst.cancelled'),
      t('in-forge:plugins.tibcoBWAppInst.scheduled'),
      t('in-forge:plugins.tibcoBWAppInst.pagedout')
    ],
    min: 0,
    category: [t('in-forge:plugins.tibcoBWAppInst.appinst')],
    formatter: zeroDecimalPlaces,
  }
];
