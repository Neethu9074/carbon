import { number, seconds, bytes } from 'in-services/formatters/number';

export default [
  {
    metrics: ['sent_message_count'],
    labels: ['Sent Message Count'],
    min: 0,
    category: ['Messages Count'],
    formatter: number
  },
  {
    metrics: ['backlog_bytes'],
    labels: ['Message size'],
    min: 0,
    category: ['Messages Size'],
    formatter: bytes.detailed
  },
  {
    metrics: ['oldest_unacked_message_age'],
    labels: ['Oldest Unacked Message Age'],
    min: 0,
    category: ['Oldest Message'],
    formatter: seconds
  }
];
