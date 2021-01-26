/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { t } from 'in-i18n';

import { newTimeMetric, newNumberMetric, newSizeMetric, withRawDataField } from 'in-analyze/metricDefinitionHelpers';
import { percentage, number } from 'in-services/formatters/number';
import Renderer from 'in-components/Chart/renderer/Renderer';
import { affectedUsers } from 'in-websites/formatters';

export const timestampMetricName = t('in-mobile-apps:analyzeView.metrics.timestampMetricName');
export const groupNameMetricName = t('in-mobile-apps:analyzeView.metrics.groupNameMetricName');
export const groupCountMetricName = t('in-mobile-apps:analyzeView.metrics.groupCountMetricName');

export function buildOrderByCriteria(metric, aggregation) {
  return `${metric}_${aggregation}_Agg`;
}

export const defaultMetrics = {
  sessionStart: [{ metric: 'uniqueUsers', aggregation: 'DISTINCT_COUNT' }],
  viewChange: [{ metric: 'uniqueUsers', aggregation: 'DISTINCT_COUNT' }],
  httpRequest: [
    { metric: 'beaconDuration', aggregation: 'MEAN' },
    { metric: 'beaconErrorRate', aggregation: 'MEAN' }
  ],
  custom: [{ metric: 'uniqueUsers', aggregation: 'DISTINCT_COUNT' }]
};

const resourceSizeMetrics = [
  withRawDataField(
    newSizeMetric({
      metric: 'encodedBodySize',
      label: t('in-mobile-apps:analyzeView.resourceSizeMetrics.encodedBodySizeLabel'),
      category: t('in-mobile-apps:analyzeView.resourceSizeMetrics.encodedBodySizeCategory')
    }),
    {
      tag: 'mobileBeacon.http.encodedBodySize'
    }
  ),
  withRawDataField(
    newSizeMetric({
      metric: 'decodedBodySize',
      label: t('in-mobile-apps:analyzeView.resourceSizeMetrics.decodedBodySizeLabel'),
      category: t('in-mobile-apps:analyzeView.resourceSizeMetrics.decodedBodySizeCategory')
    }),
    {
      tag: 'mobileBeacon.http.decodedBodySize'
    }
  ),
  withRawDataField(
    newSizeMetric({
      metric: 'transferSize',
      label: t('in-mobile-apps:analyzeView.resourceSizeMetrics.transferSizeLabel'),
      category: t('in-mobile-apps:analyzeView.resourceSizeMetrics.transferSizeCategory')
    }),
    {
      tag: 'mobileBeacon.http.transferSize'
    }
  )
];

const uniqueUsers = {
  metric: 'uniqueUsers',
  label: 'Unique Users',
  formatter: affectedUsers,
  supportedAggregations: ['DISTINCT_COUNT'],
  preferredRenderer: Renderer.stackedBar,
  min: 0
};

const errorRate = {
  metric: 'beaconErrorRate',
  label: t('in-mobile-apps:analyzeView.errorRate.label'),
  formatter: percentage,
  supportedAggregations: ['MEAN'],
  preferredRenderer: Renderer.stackedBar,
  min: 0,
  rawDataField: 'errorCount',
  rawDataLabel: t('in-mobile-apps:analyzeView.errorRate.rawDataLabel'),
  rawDataFormatter: number.compact,
  tag: 'mobileBeacon.error.count'
};

export const availableMetrics = {
  sessionStart: [
    newNumberMetric({
      metric: 'beaconCount',
      label: t('in-mobile-apps:analyzeView.availableMetrics.sessionStartBeaconCountLabel')
    }),
    uniqueUsers
  ],
  viewChange: [
    newNumberMetric({
      metric: 'beaconCount',
      label: t('in-mobile-apps:analyzeView.availableMetrics.viewChangeBeaconCountLabel')
    }),
    uniqueUsers
  ],
  httpRequest: [
    newNumberMetric({
      metric: 'beaconCount',
      label: t('in-mobile-apps:analyzeView.availableMetrics.httpRequestBeaconCountLabel')
    }),
    newNumberMetric({
      metric: 'beaconErrorCount',
      label: t('in-mobile-apps:analyzeView.availableMetrics.httpRequestBeaconErrorCountLabel')
    }),
    withRawDataField(
      newTimeMetric({
        metric: 'beaconDuration',
        label: t('in-mobile-apps:analyzeView.availableMetrics.httpRequestBeaconDurationLabel')
      }),
      {
        rawDataField: 'duration',
        tag: 'mobileBeacon.duration'
      }
    ),
    errorRate,
    uniqueUsers,
    ...resourceSizeMetrics,
    withRawDataField(
      newNumberMetric({
        metric: 'http1xx',
        label: t('in-mobile-apps:analyzeView.availableMetrics.httpRequestHttp1xxLabel'),
        category: 'HTTP'
      }),
      {
        rawDataField: 'httpCallStatus',
        rawDataLabel: t('in-mobile-apps:analyzeView.availableMetrics.httpRequestHttp1xxRawDataLabel'),
        tag: 'mobileBeacon.http.status'
      }
    ),
    withRawDataField(
      newNumberMetric({
        metric: 'http2xx',
        label: t('in-mobile-apps:analyzeView.availableMetrics.httpRequestHttp2xxLabel'),
        category: 'HTTP'
      }),
      {
        rawDataField: 'httpCallStatus',
        rawDataLabel: t('in-mobile-apps:analyzeView.availableMetrics.httpRequestHttp2xxRawDataLabel'),
        tag: 'mobileBeacon.http.status'
      }
    ),
    withRawDataField(
      newNumberMetric({
        metric: 'http3xx',
        label: t('in-mobile-apps:analyzeView.availableMetrics.httpRequestHttp3xxLabel'),
        category: 'HTTP'
      }),
      {
        rawDataField: 'httpCallStatus',
        rawDataLabel: t('in-mobile-apps:analyzeView.availableMetrics.httpRequestHttp3xxRawDataLabel'),
        tag: 'mobileBeacon.http.status'
      }
    ),
    withRawDataField(
      newNumberMetric({
        metric: 'http4xx',
        label: t('in-mobile-apps:analyzeView.availableMetrics.httpRequestHttp4xxLabel'),
        category: 'HTTP'
      }),
      {
        rawDataField: 'httpCallStatus',
        rawDataLabel: t('in-mobile-apps:analyzeView.availableMetrics.httpRequestHttp4xxRawDataLabel'),
        tag: 'mobileBeacon.http.status'
      }
    ),
    withRawDataField(
      newNumberMetric({
        metric: 'http5xx',
        label: t('in-mobile-apps:analyzeView.availableMetrics.httpRequestHttp5xxLabel'),
        category: 'HTTP'
      }),
      {
        rawDataField: 'httpCallStatus',
        rawDataLabel: t('in-mobile-apps:analyzeView.availableMetrics.httpRequestHttp5xxRawDataLabel'),
        tag: 'mobileBeacon.http.status'
      }
    ),

    withRawDataField(
      newNumberMetric({
        metric: 'httpGet',
        label: t('in-mobile-apps:analyzeView.availableMetrics.httpRequestHttpGetLabel'),
        category: 'HTTP'
      }),
      {
        rawDataField: 'httpCallMethod',
        rawDataLabel: t('in-mobile-apps:analyzeView.availableMetrics.httpRequestHttpGetRawDataLabel'),
        tag: 'mobileBeacon.http.method'
      }
    ),
    withRawDataField(
      newNumberMetric({
        metric: 'httpPost',
        label: t('in-mobile-apps:analyzeView.availableMetrics.httpRequestHttpPostLabel'),
        category: 'HTTP'
      }),
      {
        rawDataField: 'httpCallMethod',
        rawDataLabel: t('in-mobile-apps:analyzeView.availableMetrics.httpRequestHttpPostRawDataLabel'),
        tag: 'mobileBeacon.http.method'
      }
    ),
    withRawDataField(
      newNumberMetric({
        metric: 'httpPut',
        label: t('in-mobile-apps:analyzeView.availableMetrics.httpRequestHttpPutLabel'),
        category: 'HTTP'
      }),
      {
        rawDataField: 'httpCallMethod',
        rawDataLabel: t('in-mobile-apps:analyzeView.availableMetrics.httpRequestHttpPutRawDataLabel'),
        tag: 'mobileBeacon.http.method'
      }
    ),
    withRawDataField(
      newNumberMetric({
        metric: 'httpDelete',
        label: t('in-mobile-apps:analyzeView.availableMetrics.httpRequestHttpDeleteLabel'),
        category: 'HTTP'
      }),
      {
        rawDataField: 'httpCallMethod',
        rawDataLabel: t('in-mobile-apps:analyzeView.availableMetrics.httpRequestHttpDeleteRawDataLabel'),
        tag: 'mobileBeacon.http.method'
      }
    )
  ],
  custom: [
    newNumberMetric({
      metric: 'beaconCount',
      label: t('in-mobile-apps:analyzeView.availableMetrics.customBeaconCountLabel')
    }),
    withRawDataField(
      newTimeMetric({
        metric: 'beaconDuration',
        label: t('in-mobile-apps:analyzeView.availableMetrics.customBeaconDurationLabel')
      }),
      {
        rawDataField: 'duration',
        tag: 'mobileBeacon.duration'
      }
    ),
    uniqueUsers
  ]
};
