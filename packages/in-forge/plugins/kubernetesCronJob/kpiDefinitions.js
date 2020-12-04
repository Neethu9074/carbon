import { number } from 'in-services/formatters/number';

export default [
  {
    label: 'Active Jobs',
    metric: 'active_jobs',
    formatter: number.compact
  },
  {
    label: 'Last Scheduled Ago',
    metric: 'last_scheduled_ago',
    formatter: number.compact
  }
];
