import { millis, number } from 'in-services/formatters/number';

export default [
  {
    metric: 'duration',
    label: 'Duration',
    category: ['Ping'],
    min: 0,
    getMax(snapshot) {
      return snapshot.getIn(['data', 'duration']);
    },
    formatter: millis.fixedCompact
  },
  {
    metric: 'status',
    label: 'Status',
    category: ['Ping'],
    min: 0,
    max: 1,
    formatter: number
  }
];
