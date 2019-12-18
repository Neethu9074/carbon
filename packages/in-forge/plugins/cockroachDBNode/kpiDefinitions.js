import { timeByNanoTwoDecimalPlaces, zeroDecimalPlaces } from 'in-services/formatters/number';

export default [
  {
    label: 'SQL Latency (99th)',
    metric: 'sql.exec.latency-p99',
    formatter: timeByNanoTwoDecimalPlaces
  },
  {
    label: 'SQL Queries',
    metric: 'sql.query.count',
    formatter: zeroDecimalPlaces
  }
];
