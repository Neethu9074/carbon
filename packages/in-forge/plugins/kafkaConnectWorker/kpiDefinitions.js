import { number, percentage } from 'in-services/formatters/number';

export default [
  {
    label: 'Connector Count',
    metric: 'connectorCount',
    formatter: number
  },
  {
    label: 'Connector Startup Failure',
    metric: 'connectorStartupFailurePercentage',
    formatter: percentage
  },
  {
    label: 'Task Startup Failure',
    metric: 'taskStartupFailurePercentage',
    formatter: percentage
  }
];
