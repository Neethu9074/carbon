/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { percentagePlain, bytes, number } from 'in-services/formatters/number';
import { getDynamicMetricMatch } from 'in-sdk/metrics/metricDefinitions';
import { t } from 'in-i18n';

export default [
  {
    metric: getDynamicMetricMatch('memFree', null, 'Device'),
    label: t('in-forge:plugins.f5.freeMemory'),
    min: 0,
    formatter: bytes,
    hideInMetricSelector: true
  },
  {
    metric: getDynamicMetricMatch('cpuUsed', null, 'Device'),
    label: t('in-forge:plugins.f5.cpuUsage'),
    min: 0,
    formatter: percentagePlain,
    hideInMetricSelector: true
  },
  {
    metric: getDynamicMetricMatch('httpRequests', null, 'Device'),
    label: t('in-forge:plugins.f5.httpRequests'),
    min: 0,
    formatter: number,
    hideInMetricSelector: true
  }
];
