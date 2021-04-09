/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { percentage, number, millis, bytes } from 'in-services/formatters/number';
import { getDynamicMetricMatch } from 'in-sdk/metrics/metricDefinitions';
import { t } from 'in-i18n';

export default [
  {
    metric: getDynamicMetricMatch('frontendStats', 'reqRate', t('in-forge:plugins.hAProxy.frontend')),
    label: t('in-forge:plugins.hAProxy.requests'),
    category: [t('in-forge:plugins.hAProxy.frontendStats')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('frontendStats', 'reqErrors', t('in-forge:plugins.hAProxy.frontend')),
    label: t('in-forge:plugins.hAProxy.requestErrors'),
    category: [t('in-forge:plugins.hAProxy.frontendStats')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('frontendStats', 'deniedReq', t('in-forge:plugins.hAProxy.frontend')),
    label: t('in-forge:plugins.hAProxy.deniedRequests'),
    category: [t('in-forge:plugins.hAProxy.frontendStats')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('frontendStats', 'sessionRate', t('in-forge:plugins.hAProxy.frontend')),
    label: t('in-forge:plugins.hAProxy.sessions'),
    category: [t('in-forge:plugins.hAProxy.frontendStats')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('frontendStats', 'sessionUtilization', t('in-forge:plugins.hAProxy.frontend')),
    label: t('in-forge:plugins.hAProxy.sessionUsage'),
    category: [t('in-forge:plugins.hAProxy.frontendStats')],
    min: 0,
    formatter: percentage
  },
  {
    metric: getDynamicMetricMatch('frontendStats', 'clientErrors', t('in-forge:plugins.hAProxy.frontend')),
    label: t('in-forge:plugins.hAProxy.clientErrors'),
    category: [t('in-forge:plugins.hAProxy.frontendStats')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('frontendStats', 'serverErrors', t('in-forge:plugins.hAProxy.frontend')),
    label: t('in-forge:plugins.hAProxy.serverErrors'),
    category: [t('in-forge:plugins.hAProxy.frontendStats')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('frontendStats', 'bytesSent', t('in-forge:plugins.hAProxy.frontend')),
    label: t('in-forge:plugins.hAProxy.bytesSent'),
    category: [t('in-forge:plugins.hAProxy.frontendStats')],
    min: 0,
    formatter: bytes
  },
  {
    metric: getDynamicMetricMatch('frontendStats', 'bytesReceived', t('in-forge:plugins.hAProxy.frontend')),
    label: t('in-forge:plugins.hAProxy.bytesReceived'),
    category: [t('in-forge:plugins.hAProxy.frontendStats')],
    min: 0,
    formatter: bytes
  },
  {
    metric: getDynamicMetricMatch('backendStats', 'avgResponseTime', t('in-forge:plugins.hAProxy.backend')),
    label: t('in-forge:plugins.hAProxy.averageResponseTime'),
    category: [t('in-forge:plugins.hAProxy.backendStats')],
    min: 0,
    formatter: millis
  },
  {
    metric: getDynamicMetricMatch('backendStats', 'avgQueueTime', t('in-forge:plugins.hAProxy.backend')),
    label: t('in-forge:plugins.hAProxy.averageQueueTime'),
    category: [t('in-forge:plugins.hAProxy.backendStats')],
    min: 0,
    formatter: millis
  },
  {
    metric: getDynamicMetricMatch('backendStats', 'queueSize', t('in-forge:plugins.hAProxy.backend')),
    label: t('in-forge:plugins.hAProxy.queueSize'),
    category: [t('in-forge:plugins.hAProxy.backendStats')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('backendStats', 'reqConnErrors', t('in-forge:plugins.hAProxy.backend')),
    label: t('in-forge:plugins.hAProxy.connectionErrors'),
    category: [t('in-forge:plugins.hAProxy.backendStats')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('backendStats', 'errorRes', t('in-forge:plugins.hAProxy.backend')),
    label: t('in-forge:plugins.hAProxy.responseErrors'),
    category: [t('in-forge:plugins.hAProxy.backendStats')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('backendStats', 'connRetries', t('in-forge:plugins.hAProxy.backend')),
    label: t('in-forge:plugins.hAProxy.connectionRetries'),
    category: [t('in-forge:plugins.hAProxy.backendStats')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('backendStats', 'deniedRes', t('in-forge:plugins.hAProxy.backend')),
    label: t('in-forge:plugins.hAProxy.deniedResponses'),
    category: [t('in-forge:plugins.hAProxy.backendStats')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('backendStats', 'reDispatchedReq', t('in-forge:plugins.hAProxy.backend')),
    label: t('in-forge:plugins.hAProxy.reDispatchedRequests'),
    category: [t('in-forge:plugins.hAProxy.backendStats')],
    min: 0,
    formatter: number
  }
];
