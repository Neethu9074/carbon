/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { number, bytes } from 'in-services/formatters/number';

export default [
  {
    label: 'Messages Count',
    metric: 'sent_message_count',
    formatter: number.compact
  },
  {
    label: 'Messages Size',
    metric: 'backlog_bytes',
    formatters: bytes.detailed
  }
];
