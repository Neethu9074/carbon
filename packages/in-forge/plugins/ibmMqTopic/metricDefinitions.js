import { number, seconds } from 'in-services/formatters/number';

export default [
  {
    metrics: ['messagesCount'],
    labels: ['Count'],
    min: 0,
    category: ['Messages'],
    formatter: number
  },
  {
    metrics: ['publishCount'],
    labels: ['Count'],
    min: 0,
    category: ['Publishers'],
    formatter: number
  },
  {
    metrics: ['lastResetTime'],
    labels: ['Last Reset Time'],
    min: 0,
    category: ['Reset'],
    formatter: seconds
  },
  {
    metrics: ['subscriptionCount'],
    labels: ['Count'],
    min: 0,
    category: ['Subscriptions'],
    formatter: number
  }
];
