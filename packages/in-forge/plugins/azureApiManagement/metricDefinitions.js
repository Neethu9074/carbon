/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { number, percentagePlain, bytesZeroDecimalPlaces, millis } from 'in-services/formatters/number';

export default [
  {
    metrics: ['metrics.Capacity'],
    labels: ['Capacity'],
    category: ['Capacity'],
    min: 0,
    formatter: percentagePlain.detailed
  },
  {
    metrics: [
      'metrics.TotalRequests',
      'metrics.SuccessfulRequests',
      'metrics.UnauthorizedRequests',
      'metrics.FailedRequests',
      'metrics.OtherRequests'
    ],
    labels: [
      'Total Gateway Requests',
      'Successful Gateway Requests',
      'Unauthorized Gateway Requests',
      'Failed Gateway Requests',
      'Other Gateway Requests'
    ],
    category: ['Gateway Requests'],
    min: 0,
    formatter: number
  },
  {
    metrics: ['metrics.Duration'],
    labels: ['Duration'],
    category: ['Latency'],
    min: 0,
    formatter: millis
  },
  {
    metrics: [
      'EventHubTotalEvents',
      'EventHubSuccessfulEvents',
      'EventHubTotalFailedEvents',
      'EventHubRejectedEvents',
      'EventHubThrottledEvents',
      'EventHubTimedoutEvents',
      'EventHubDroppedEvents'
    ],
    labels: [
      'Total EventHub Events',
      'Successful EventHub Events',
      'Failed EventHub Events',
      'Rejected EventHub Events',
      'Throttled EventHub Events',
      'Timed Out EventHub Events',
      'Dropped EventHub Events'
    ],
    category: ['Event Hub Events'],
    min: 0,
    formatter: number
  },
  {
    metrics: ['EventHubTotalBytesSent'],
    labels: ['Size of EventHub Events'],
    category: ['Size of Event Hub Events'],
    min: 0,
    formatter: bytesZeroDecimalPlaces
  }
];
