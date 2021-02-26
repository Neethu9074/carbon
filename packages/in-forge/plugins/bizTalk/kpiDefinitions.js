/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';

import { millis, number } from 'in-services/formatters/number';

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
