import { number } from 'in-services/formatters/number';

export default [
  {
    label: 'All Active Jobs',
    metric: 'activeJobs',
    formatter: number.compact
  },
  {
    label: 'All Active Stages',
    metric: 'activeStages',
    formatter: number.compact
  }
];
