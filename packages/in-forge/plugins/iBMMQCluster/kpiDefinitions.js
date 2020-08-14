import { number } from 'in-services/formatters/number';

export default [
  {
    label: 'Messages In',
    metric: 'messagesIn',
    formatter: number.compact
  },
  {
    label: 'Messages Out',
    metric: 'messagesOut',
    formatters: number.compact
  }
];
