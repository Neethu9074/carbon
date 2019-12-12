import { number } from 'in-services/formatters/number';

export default [
  {
    label: 'CPU Credit Balance',
    metric: 'cpu_credit_balance',
    formatter: number
  },
  {
    label: 'Current Connections Count',
    metric: 'current_connections_count',
    formatter: number
  }
];
