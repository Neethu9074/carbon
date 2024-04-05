/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { msZeroDecimalPlaces } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-forge:plugins.kafka.totalProduceTime'),
    metric: 'broker.totalTimeProduce',
    formatter: msZeroDecimalPlaces
  },
  {
    label: t('in-forge:plugins.kafka.totalFetchConsumerTime'),
    metric: 'broker.totalTimeFetchConsumer',
    formatter: msZeroDecimalPlaces
  }
];
