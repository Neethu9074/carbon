/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { ms, number } from 'in-services/formatters/number';

export default [
  {
    label: 'Inbound Calls per Second',
    metric: 'inbound_count',
    formatter: number.compact
  },
  {
    label: 'Inbound Calls Avg. Latency',
    metric: 'inbound_duration.mean',
    formatter: ms.compact
  }
];
