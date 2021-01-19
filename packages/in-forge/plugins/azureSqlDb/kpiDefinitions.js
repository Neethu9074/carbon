/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { percentagePlainTwoDecimalPlaces } from 'in-services/formatters/number';

export default [
  {
    label: 'CPU Percentage',
    metric: 'metrics.cpu_percent',
    formatter: percentagePlainTwoDecimalPlaces
  },
  {
    label: 'DTU Percentage',
    metric: 'metrics.dtu_consumption_percent',
    formatter: percentagePlainTwoDecimalPlaces
  }
];
