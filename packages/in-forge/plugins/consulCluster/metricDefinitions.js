/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { number } from 'in-services/formatters/number';

export default [
  {
    metric: 'consul.autopilot.healthy',
    label: 'Consul autopilot Health Status',
    formatter: number
  }
];
