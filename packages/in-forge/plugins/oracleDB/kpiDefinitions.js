import { hitRateTwoDecimalPlaces, micros } from 'in-services/formatters/number';

export default [
  {
    label: 'DB Time/Second',
    metric: 'stats.dbTime',
    formatter: micros
  },
  {
    label: 'DB CPU Time/DB Ratio',
    metric: 'stats.cpuTimeDbTimeRatio',
    formatter: hitRateTwoDecimalPlaces
  }
];
