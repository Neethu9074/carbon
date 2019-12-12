import { greaterThanZeroFormatter } from 'in-forge/plugins/rabbitMq/Dashboard/Content';

export default [
  {
    label: 'Messages Ready',
    metric: 'overview.messages_ready',
    formatter: greaterThanZeroFormatter
  },
  {
    label: 'Consumers',
    metric: 'overview.consumers',
    formatter: greaterThanZeroFormatter
  }
];
