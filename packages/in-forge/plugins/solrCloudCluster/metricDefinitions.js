/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { percentage, number } from 'in-services/formatters/number';

export default [
  {
    metric: 'avg_requests',
    label: 'Average Requests',
    min: 0,
    formatter: number
  },
  {
    metric: 'avg_time_request',
    label: 'Average Request Time',
    min: 0,
    formatter: number
  },
  {
    metric: 'hitratio',
    label: 'Hit-rate',
    min: 0,
    formatter: percentage
  },
  {
    metrics: ['lookups', 'inserts', 'errors', 'timeouts', 'evictions'],
    labels: ['Lookups', 'Inserts', 'Errors', 'Timeouts', 'Evictions'],
    min: 0,
    formatter: number
  },
  {
    metrics: ['docs_added', 'docs_pending'],
    labels: ['Documents Added', 'Documents Pending'],
    min: 0,
    formatter: number
  }
];
