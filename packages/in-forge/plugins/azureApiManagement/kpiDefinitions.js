import { millis, percentagePlainTwoDecimalPlaces } from 'in-services/formatters/number';

export default [
  {
    label: 'Capacity',
    metric: 'metrics.Capacity',
    formatter: percentagePlainTwoDecimalPlaces
  },
  {
    label: 'Duration',
    metric: 'metrics.Duration',
    formatter: millis.detailed
  }
];
