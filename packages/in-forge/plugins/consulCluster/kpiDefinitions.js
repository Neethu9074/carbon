import { number } from 'in-services/formatters/number';

export default [
  {
    label: 'Consul Autopilot Health Status',
    metric: 'consul.autopilot.healthy',
    formatter: number
  }
];
