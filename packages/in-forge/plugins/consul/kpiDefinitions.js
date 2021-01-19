/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { number } from 'in-services/formatters/number';

export default [
  {
    label: 'Consul Autopilot Health Status',
    metric: 'consul.autopilot.healthy',
    formatter: number.compact
  }
];
