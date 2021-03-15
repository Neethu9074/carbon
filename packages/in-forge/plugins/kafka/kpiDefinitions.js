/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { msZeroDecimalPlaces } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-forge:plugins.kafka.produceLatency'),
    metric: 'broker.totalTimeProduce',
    formatter: msZeroDecimalPlaces
  },
  {
    label: t('in-forge:plugins.kafka.fetchConsumerLatency'),
    metric: 'broker.totalTimeFetchConsumer',
    formatter: msZeroDecimalPlaces
  }
];
