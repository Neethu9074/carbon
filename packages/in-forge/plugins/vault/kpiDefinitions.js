import { number } from 'in-services/formatters/number';

export default [
  {
    label: 'Secrets Created',
    metric: 'secret.created',
    formatter: number.compact
  },
  {
    label: 'Tokens Created',
    metric: 'token.created',
    formatters: number.compact
  }
];
