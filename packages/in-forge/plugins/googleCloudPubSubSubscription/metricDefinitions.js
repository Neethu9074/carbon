import { number, seconds, bytes, micros } from 'in-services/formatters/number';

export default [
  {
    metrics: [
      'ack_message_count',
      'num_undelivered_messages',
      'dead_letter_message_count',
      'num_outstanding_messages',
      'sent_message_count'
    ],
    labels: [
      'Messages Acked Count',
      'Unacked Messages Count',
      'Dead Letter Messages Count',
      'Outstanding Messages Count',
      'Sent Messages Count'
    ],
    min: 0,
    category: ['Messages'],
    formatter: number
  },
  {
    metrics: ['pull_message_operation_count', 'pull_ack_message_operation_count'],
    labels: ['Message Operations Pull Count', 'Message Operations Ack Count'],
    min: 0,
    category: ['Message Operations'],
    formatter: number
  },
  {
    metrics: ['pull_request_count', 'pull_ack_request_count', 'push_request_count'],
    labels: ['Requests Pull Count', 'Requests Ack Count', 'Requests Push Count'],
    min: 0,
    category: ['Requests'],
    formatter: number
  },
  {
    metrics: ['push_request_latencies'],
    labels: ['Push Request Latency'],
    min: 0,
    category: ['Request Latency'],
    formatter: micros.detailed
  },
  {
    metrics: ['config_updates_count'],
    labels: ['Config Updates Count'],
    min: 0,
    category: ['Config Updates'],
    formatter: number
  },
  {
    metrics: ['byte_cost'],
    labels: ['Operations Cost'],
    min: 0,
    category: ['Operations Cost'],
    formatter: bytes.detailed
  },
  {
    metrics: ['backlog_bytes'],
    labels: ['Messages Size'],
    min: 0,
    category: ['Messages Size'],
    formatter: bytes.detailed
  },
  {
    metrics: ['oldest_retained_acked_message_age', 'oldest_unacked_message_age'],
    labels: ['Oldest Acked Message Age', 'Oldest Unacked Message Age'],
    min: 0,
    category: ['Oldest Message'],
    formatter: seconds
  }
];
