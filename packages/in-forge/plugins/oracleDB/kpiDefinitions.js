import { hitRateTwoDecimalPlaces, muSecondsToMillisTwoDecimalPlaces } from 'in-services/formatters/number';

export default [
  {
    label: 'DB Time/Second',
    metric: 'stats.dbTime',
    formatter: muSecondsToMillisTwoDecimalPlaces
  },
  {
    label: 'DB CPU Time/DB Ratio',
    metric: 'stats.cpuTimeDbTimeRatio',
    formatter: hitRateTwoDecimalPlaces
  }
];
