import { number, seconds, bytes } from 'in-services/formatters/number';

export default [
  {
    metrics: ['message_sizes'],
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
  },
  {
    metrics: ['byte_cost'],
    labels: ['Operations Cost'],
    min: 0,
    category: ['Operations Cost'],
    formatter: bytes.detailed
  },
  {
    metrics: ['send_request_count'],
    labels: ['Publish Requests Count'],
    min: 0,
    category: ['Publish Requests'],
    formatter: number
  },
  {
    metrics: ['send_message_operation_count'],
    labels: ['Publish Operations Count'],
    min: 0,
    category: ['Publish Operations'],
    formatter: number
  }
];
