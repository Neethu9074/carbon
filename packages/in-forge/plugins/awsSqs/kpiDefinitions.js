/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';

import { number, seconds } from 'in-services/formatters/number';

export default [
  {
    label: t('in-forge:plugins.awsSqs.oldestMessagesAge'),
    metric: 'age_of_oldest_msg',
    formatter: seconds.fixedCompact
  },
  {
    label: t('in-forge:plugins.awsSqs.messagesDelayed'),
    metric: 'num_of_msg_delayed',
    formatter: number.compact
  }
];
