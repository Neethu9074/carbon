/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { bytesTwoDecimalPlaces, zeroDecimalPlaces } from 'in-services/formatters/number';
import { t } from 'in-i18n';

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
