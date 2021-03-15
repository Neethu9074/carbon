/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { percentage, number, millis, bytes } from 'in-services/formatters/number';
import { getDynamicMetricMatch } from 'in-sdk/metrics/metricDefinitions';
import { t } from 'in-i18n';

export default [
  {
    metric: getDynamicMetricMatch('frontendStats', 'reqRate', 'Frontend'),
    label: t('in-forge:plugins.hAProxy.requests'),
    category: [t('in-forge:plugins.hAProxy.frontendStats')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('frontendStats', 'reqErrors', 'Frontend'),
    label: t('in-forge:plugins.hAProxy.requestErrors'),
    category: [t('in-forge:plugins.hAProxy.frontendStats')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('frontendStats', 'deniedReq', 'Frontend'),
    label: t('in-forge:plugins.hAProxy.deniedRequests'),
    category: [t('in-forge:plugins.hAProxy.frontendStats')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('frontendStats', 'sessionRate', 'Frontend'),
    label: t('in-forge:plugins.hAProxy.sessions'),
    category: [t('in-forge:plugins.hAProxy.frontendStats')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('frontendStats', 'sessionUtilization', 'Frontend'),
    label: t('in-forge:plugins.hAProxy.sessionUsage'),
    category: [t('in-forge:plugins.hAProxy.frontendStats')],
    min: 0,
    formatter: percentage
  },
  {
    metric: getDynamicMetricMatch('frontendStats', 'clientErrors', 'Frontend'),
    label: t('in-forge:plugins.hAProxy.clientErrors'),
    category: [t('in-forge:plugins.hAProxy.frontendStats')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('frontendStats', 'serverErrors', 'Frontend'),
    label: t('in-forge:plugins.hAProxy.serverErrors'),
    category: [t('in-forge:plugins.hAProxy.frontendStats')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('frontendStats', 'bytesSent', 'Frontend'),
    label: t('in-forge:plugins.hAProxy.bytesSent'),
    category: [t('in-forge:plugins.hAProxy.frontendStats')],
    min: 0,
    formatter: bytes
  },
  {
    metric: getDynamicMetricMatch('frontendStats', 'bytesReceived', 'Frontend'),
    label: t('in-forge:plugins.hAProxy.bytesReceived'),
    category: [t('in-forge:plugins.hAProxy.frontendStats')],
    min: 0,
    formatter: bytes
  },
  {
    metric: getDynamicMetricMatch('backendStats', 'avgResponseTime', 'Backend'),
    label: t('in-forge:plugins.hAProxy.averageResponseTime'),
    category: [t('in-forge:plugins.hAProxy.backendStats')],
    min: 0,
    formatter: millis
  },
  {
    metric: getDynamicMetricMatch('backendStats', 'avgQueueTime', 'Backend'),
    label: t('in-forge:plugins.hAProxy.averageQueueTime'),
    category: [t('in-forge:plugins.hAProxy.backendStats')],
    min: 0,
    formatter: millis
  },
  {
    metric: getDynamicMetricMatch('backendStats', 'queueSize', 'Backend'),
    label: t('in-forge:plugins.hAProxy.queueSize'),
    category: [t('in-forge:plugins.hAProxy.backendStats')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('backendStats', 'reqConnErrors', 'Backend'),
    label: t('in-forge:plugins.hAProxy.connectionErrors'),
    category: [t('in-forge:plugins.hAProxy.backendStats')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('backendStats', 'errorRes', 'Backend'),
    label: t('in-forge:plugins.hAProxy.responseErrors'),
    category: [t('in-forge:plugins.hAProxy.backendStats')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('backendStats', 'connRetries', 'Backend'),
    label: t('in-forge:plugins.hAProxy.connectionRetries'),
    category: [t('in-forge:plugins.hAProxy.backendStats')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('backendStats', 'deniedRes', 'Backend'),
    label: t('in-forge:plugins.hAProxy.deniedResponses'),
    category: [t('in-forge:plugins.hAProxy.backendStats')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('backendStats', 'reDispatchedReq', 'Backend'),
    label: t('in-forge:plugins.hAProxy.reDispatchedRequests'),
    category: [t('in-forge:plugins.hAProxy.backendStats')],
    min: 0,
    formatter: number
  }
];
