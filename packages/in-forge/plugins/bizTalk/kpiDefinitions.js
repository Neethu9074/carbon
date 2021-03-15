/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { millis, number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-forge:plugins.bizTalk.labelMessageDeliveryDelayMS'),
    metric: 'delay',
    formatter: millis.compact
  },
  {
    label: t('in-forge:plugins.bizTalk.labelActiveSendTreads'),
    metric: 'send_threads',
    formatter: number.compact
  }
];
