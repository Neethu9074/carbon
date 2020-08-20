import { number } from 'in-services/formatters/number';

export default [
  {
    label: 'Messages Sent/Received',
    metric: 'messagesSent',
    formatter: number.compact
  },
  {
    label: 'Messages Available',
    metric: 'messagesAvailable',
    formatters: number.compact
  }
];
