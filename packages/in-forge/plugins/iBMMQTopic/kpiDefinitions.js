import { number } from 'in-services/formatters/number';

export default [
  {
    label: 'Messages Count',
    metric: 'messagesCount',
    formatter: number.compact
  },
  {
    label: 'Publish Count',
    metric: 'publishCount',
    formatters: number.compact
  }
];
