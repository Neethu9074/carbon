import { number } from 'in-services/formatters/number';

export default [
  {
    metric: 'consul.autopilot.healthy',
    label: 'Consul autopilot Healthy Status',
    formatter: number
  }
];
