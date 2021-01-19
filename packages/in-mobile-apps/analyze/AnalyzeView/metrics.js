/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { newTimeMetric, newNumberMetric, newSizeMetric, withRawDataField } from 'in-analyze/metricDefinitionHelpers';
import { percentage, number } from 'in-services/formatters/number';
import Renderer from 'in-components/Chart/renderer/Renderer';
import { affectedUsers } from 'in-websites/formatters';

export const timestampMetricName = 'timestamp';
export const groupNameMetricName = 'name';
export const groupCountMetricName = 'count';

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
    newSizeMetric({ metric: 'encodedBodySize', label: 'Encoded Body Size', category: 'Resource Sizing' }),
    {
      tag: 'mobileBeacon.http.encodedBodySize'
    }
  ),
  withRawDataField(
    newSizeMetric({ metric: 'decodedBodySize', label: 'Decoded Body Size', category: 'Resource Sizing' }),
    {
      tag: 'mobileBeacon.http.decodedBodySize'
    }
  ),
  withRawDataField(newSizeMetric({ metric: 'transferSize', label: 'Transfer Size', category: 'Resource Sizing' }), {
    tag: 'mobileBeacon.http.transferSize'
  })
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
  label: 'Error Rate',
  formatter: percentage,
  supportedAggregations: ['MEAN'],
  preferredRenderer: Renderer.stackedBar,
  min: 0,
  rawDataField: 'errorCount',
  rawDataLabel: 'Error Count',
  rawDataFormatter: number.compact,
  tag: 'mobileBeacon.error.count'
};

export const availableMetrics = {
  sessionStart: [newNumberMetric({ metric: 'beaconCount', label: 'Session Starts' }), uniqueUsers],
  viewChange: [newNumberMetric({ metric: 'beaconCount', label: 'View Transitions' }), uniqueUsers],
  httpRequest: [
    newNumberMetric({ metric: 'beaconCount', label: 'Calls' }),
    newNumberMetric({ metric: 'beaconErrorCount', label: 'Erroneous Calls' }),
    withRawDataField(newTimeMetric({ metric: 'beaconDuration', label: 'Retrieval Time' }), {
      rawDataField: 'duration',
      tag: 'mobileBeacon.duration'
    }),
    errorRate,
    uniqueUsers,
    ...resourceSizeMetrics,
    withRawDataField(newNumberMetric({ metric: 'http1xx', label: 'HTTP 1XX Count', category: 'HTTP' }), {
      rawDataField: 'httpCallStatus',
      rawDataLabel: 'HTTP Status',
      tag: 'mobileBeacon.http.status'
    }),
    withRawDataField(newNumberMetric({ metric: 'http2xx', label: 'HTTP 2XX Count', category: 'HTTP' }), {
      rawDataField: 'httpCallStatus',
      rawDataLabel: 'HTTP Status',
      tag: 'mobileBeacon.http.status'
    }),
    withRawDataField(newNumberMetric({ metric: 'http3xx', label: 'HTTP 3XX Count', category: 'HTTP' }), {
      rawDataField: 'httpCallStatus',
      rawDataLabel: 'HTTP Status',
      tag: 'mobileBeacon.http.status'
    }),
    withRawDataField(newNumberMetric({ metric: 'http4xx', label: 'HTTP 4XX Count', category: 'HTTP' }), {
      rawDataField: 'httpCallStatus',
      rawDataLabel: 'HTTP Status',
      tag: 'mobileBeacon.http.status'
    }),
    withRawDataField(newNumberMetric({ metric: 'http5xx', label: 'HTTP 5XX Count', category: 'HTTP' }), {
      rawDataField: 'httpCallStatus',
      rawDataLabel: 'HTTP Status',
      tag: 'mobileBeacon.http.status'
    }),

    withRawDataField(newNumberMetric({ metric: 'httpGet', label: 'HTTP GET Count', category: 'HTTP' }), {
      rawDataField: 'httpCallMethod',
      rawDataLabel: 'HTTP Method',
      tag: 'mobileBeacon.http.method'
    }),
    withRawDataField(newNumberMetric({ metric: 'httpPost', label: 'HTTP POST Count', category: 'HTTP' }), {
      rawDataField: 'httpCallMethod',
      rawDataLabel: 'HTTP Method',
      tag: 'mobileBeacon.http.method'
    }),
    withRawDataField(newNumberMetric({ metric: 'httpPut', label: 'HTTP PUT Count', category: 'HTTP' }), {
      rawDataField: 'httpCallMethod',
      rawDataLabel: 'HTTP Method',
      tag: 'mobileBeacon.http.method'
    }),
    withRawDataField(newNumberMetric({ metric: 'httpDelete', label: 'HTTP DELETE Count', category: 'HTTP' }), {
      rawDataField: 'httpCallMethod',
      rawDataLabel: 'HTTP Method',
      tag: 'mobileBeacon.http.method'
    })
  ],
  custom: [
    newNumberMetric({ metric: 'beaconCount', label: 'Occurrences' }),
    withRawDataField(newTimeMetric({ metric: 'beaconDuration', label: 'Duration' }), {
      rawDataField: 'duration',
      tag: 'mobileBeacon.duration'
    }),
    uniqueUsers
  ]
};
