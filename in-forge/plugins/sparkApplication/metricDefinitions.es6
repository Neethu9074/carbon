import { number, ms } from 'in-services/formatters/number';

export default [
  {
    metrics: ['finishedJobs'],
    labels: ['Finished Jobs'],
    formatter: number,
    min: 0
  },
  {
    metrics: ['schedulingDelay', 'totalDelay'],
    labels: ['Scheduling Delay', 'Total Delay'],
    formatter: ms,
    min: 0
  },
  {
    metrics: ['waitingStages'],
    labels: ['Waiting Stages'],
    formatter: number,
    min: 0
  }
];
