/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { bytes, number } from 'in-services/formatters/number';

export default [
  {
    label: 'Connections',
    metric: 'connections',
    formatter: number.compact
  },
  {
    label: 'Database Size',
    metric: 'totalDbSize',
    formatter: bytes.detailed
  }
];
