
/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { percentagePlain } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metrics: ['metrics.disk.utilization'],
    labels: [t('in-forge:plugins.maprNode.utilization')],
    min: 0,
    formatter: percentagePlain.compact
  }
];
