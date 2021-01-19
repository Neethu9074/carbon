/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { number, seconds, bytes } from 'in-services/formatters/number';

export default [
  {
    metric: 'age_of_oldest_msg',
    label: 'Age of oldest messages',
    category: ['Messages'],
    min: 0,
    formatter: seconds
  },
  {
    metric: 'num_of_msg_delayed',
    label: 'Number of messages delayed',
    category: ['Messages'],
    min: 0,
    formatter: number
  },
  {
    metric: 'num_of_msg_not_visible',
    label: 'Number of messages not visible',
    category: ['Messages'],
    min: 0,
    formatter: number
  },
  {
    metric: 'num_of_msg_visible',
    label: 'Number of messages visible',
    category: ['Messages'],
    min: 0,
    formatter: number
  },
  {
    metric: 'num_of_empty_receives',
    label: 'Number of messages empty receives',
    category: ['Messages'],
    min: 0,
    formatter: number
  },
  {
    metric: 'num_of_msg_deleted',
    label: 'Number of messages empty deleted',
    category: ['Messages'],
    min: 0,
    formatter: number
  },
  {
    metric: 'num_of_msg_received',
    label: 'Number of messages receives',
    category: ['Messages'],
    formatter: number
  },
  {
    metric: 'num_of_msg_sent',
    label: 'Number of messages sent',
    category: ['Messages'],
    min: 0,
    formatter: number
  },
  {
    metric: 'sent_message_size',
    label: 'Sent messages size',
    category: ['Messages'],
    min: 0,
    formatter: bytes
  }
];
