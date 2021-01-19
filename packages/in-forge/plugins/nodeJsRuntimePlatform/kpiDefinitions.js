/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { bytes, time } from 'in-services/formatters/number';

export default [
  {
    label: 'GC Pause',
    metric: 'gc.gcPause',
    formatter: time
  },
  {
    label: 'RSS',
    metric: 'memory.rss',
    formatter: bytes.detailed
  }
];
