/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { percentage } from 'in-services/formatters/number';

export default [
  {
    label: 'CPU Usage',
    metric: 'cpu.usage.maximum.percent',
    formatter: percentage.detailed
  },
  {
    label: 'CPU Readiness',
    metric: 'cpu.readiness.average.percent',
    formatter: percentage.detailed
  }
];
