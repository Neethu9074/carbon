/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { getDynamicMetricMatch } from 'in-sdk/metrics/metricDefinitions';
import { number, millis } from 'in-services/formatters/number';

export default [
  {
    metrics: [
      getDynamicMetricMatch('applications', 'processedEvents', 'Application'),
      getDynamicMetricMatch('applications', 'executionErrors', 'Application'),
      getDynamicMetricMatch('applications', 'fatalErrors', 'Application')
    ],
    labels: ['Processed Events', 'Execution Errors', 'Fatal Errors'],
    category: ['Applications'],
    min: 0,
    formatter: number
  },
  {
    metrics: [
      getDynamicMetricMatch('flows', 'processedEvents', 'Flow'),
      getDynamicMetricMatch('flows', 'executionErrors', 'Flow'),
      getDynamicMetricMatch('flows', 'fatalErrors', 'Flow')
    ],
    labels: ['Processed Events', 'Execution Errors', 'Fatal Errors'],
    category: ['Flows'],
    min: 0,
    formatter: number
  },
  {
    metrics: [getDynamicMetricMatch('applications', 'avgProcessingTime', 'Application')],
    labels: ['Average Processing Time'],
    category: ['Applications'],
    min: 0,
    formatter: millis.fixedCompact
  },
  {
    metrics: [getDynamicMetricMatch('flows', 'avgProcessingTime', 'Flow')],
    labels: ['Average Processing Time'],
    category: ['Flows'],
    min: 0,
    formatter: millis.fixedCompact
  }
];
