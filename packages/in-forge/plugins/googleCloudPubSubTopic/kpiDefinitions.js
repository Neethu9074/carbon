/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { bytes, seconds } from 'in-services/formatters/number';

export default [
  {
    label: 'Messages Size',
    metric: 'message_sizes',
    formatter: bytes.detailed
  },
  {
    label: 'Oldest Unacked Message Age',
    metric: 'oldest_unacked_message_age',
    formatter: seconds.detailed
  }
];
