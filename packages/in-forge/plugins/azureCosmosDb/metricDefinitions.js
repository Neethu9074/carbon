/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { number, percentage, bytesZeroDecimalPlaces } from 'in-services/formatters/number';

export default [
  {
    metrics: ['metrics.instance.tr', 'metrics.instance.mr', 'metrics.instance.dc'],
    labels: ['Total Requests', 'Metadata Requests', 'Document count'],
    category: ['Instance KPI'],
    min: 0,
    formatter: number
  },
  {
    metrics: ['metrics.instance.sa'],
    labels: ['Service Availability'],
    category: ['Instance KPI'],
    min: 0,
    formatter: percentage
  },
  {
    metrics: ['metrics.instance.rl', 'metrics.instance.wl'],
    labels: ['Read Latency', 'Write Latency'],
    category: ['Instance KPI'],
    min: 0,
    formatter: bytesZeroDecimalPlaces
  }
];
