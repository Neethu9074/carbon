/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { number } from 'in-services/formatters/number';

export default [
  {
    metrics: ['metrics.gcCount', 'metrics.exceptionThrownCount', 'metrics.contentionCount'],
    labels: ['GC Count', 'Exceptions Thrown', 'Contention Count'],
    min: 0,
    category: ['Counters'],
    formatter: number
  },
  {
    metrics: ['metrics.heapSizeGen0', 'metrics.heapSizeGen1', 'metrics.heapSizeGen2', 'metrics.heapSizeGen3'],
    labels: ['Generation 0', 'Generation 1', 'Generation 2', 'Generation 3'],
    min: 0,
    category: ['Memory'],
    formatter: number
  }
];
