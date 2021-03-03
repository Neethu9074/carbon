/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';

import { bytesTwoDecimalPlaces, zeroDecimalPlaces } from 'in-services/formatters/number';

export default [
  {
    label: t('in-forge:plugins.kafkaCluster.allBrokersMessagesIn'),
    metric: 'broker.messagesIn',
    formatter: zeroDecimalPlaces
  },
  {
    label: t('in-forge:plugins.kafkaCluster.rejectedTraffic'),
    metric: 'broker.bytesRejected',
    formatter: bytesTwoDecimalPlaces
  }
];
