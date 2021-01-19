/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { number } from 'in-services/formatters/number';

export default [
  {
    metrics: ['container_count', 'cpuRequests', 'cpuLimits', 'memoryRequests', 'memoryLimits', 'restartCount'],
    labels: ['Containers', 'CPU Requests', 'CPU Limits', 'Memory Requests', 'Memory Limits', 'Restarts'],
    min: 0,
    formatter: number
  }
];
