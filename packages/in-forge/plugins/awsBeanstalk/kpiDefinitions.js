/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { number } from 'in-services/formatters/number';

export default [
  {
    label: 'OK Instances',
    metric: 'environment_instances_ok',
    formatter: number.compact
  },
  {
    label: 'Degraded Instances',
    metric: 'environment_instances_degraded',
    formatter: number.compact
  }
];
