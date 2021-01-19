/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { hitRateTwoDecimalPlaces, micros } from 'in-services/formatters/number';

export default [
  {
    label: 'DB Time/Second',
    metric: 'stats.dbTime',
    formatter: micros.detailed
  },
  {
    label: 'DB CPU Time/DB Ratio',
    metric: 'stats.cpuTimeDbTimeRatio',
    formatter: hitRateTwoDecimalPlaces
  }
];
