/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { bytesZeroDecimalPlaces, timeByNanoTwoDecimalPlaces } from 'in-services/formatters/number';

export default [
  {
    label: 'SQL Latency (99th)',
    metric: 'sql.exec.latency-p99',
    formatter: timeByNanoTwoDecimalPlaces
  },
  {
    label: 'Disk Read (Bytes)',
    metric: 'sys.host.disk.read.bytes',
    formatter: bytesZeroDecimalPlaces
  }
];
