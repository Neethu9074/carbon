/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { bytesTwoDecimalPlaces, percentageZeroDecimalPlaces } from 'in-services/formatters/number';
import { getDynamicMetricMatch } from 'in-sdk/metrics/metricDefinitions';
import { t } from 'in-i18n';

export default [
  {
    metrics: [getDynamicMetricMatch('pid', 'cpu.sys', t('in-forge:plugins.processGroup.pid'))],
    labels: [t('in-forge:plugins.processGroup.system')],
    min: 0,
    formatter: percentageZeroDecimalPlaces
  },
  {
    metrics: [getDynamicMetricMatch('pid', 'mem.resident', t('in-forge:plugins.processGroup.pid'))],
    labels: [t('in-forge:plugins.processGroup.resident')],
    min: 0,
    formatter: bytesTwoDecimalPlaces
  }
];
