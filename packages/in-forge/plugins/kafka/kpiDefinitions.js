/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { msZeroDecimalPlaces } from 'in-services/formatters/number';

export default [
  {
    label: 'Produce Latency',
    metric: 'broker.totalTimeProduce',
    formatter: msZeroDecimalPlaces
  },
  {
    label: 'Fetch Consumer Latency',
    metric: 'broker.totalTimeFetchConsumer',
    formatter: msZeroDecimalPlaces
  }
];
