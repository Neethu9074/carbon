/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metrics: [
      'inMessages',
      'inMessagesCount',
      'outMessages',
      'outMessagesCount',
      'pendingMessagesCount',
      'pendingMessagesSize',
      'pendingMessagesLimit',
      'subscriberCount'
    ],
    labels: [
      t('in-forge:plugins.tibcoEMS.labelInMessagesRate'),
      t('in-forge:plugins.tibcoEMS.labelInMessagesCount'),
      t('in-forge:plugins.tibcoEMS.labelOutMessagesRate'),
      t('in-forge:plugins.tibcoEMS.labelOutMessagesCount'),
      t('in-forge:plugins.tibcoEMS.labelPendingMessagesCount'),
      t('in-forge:plugins.tibcoEMS.labelPendingMessagesSize'),
      t('in-forge:plugins.tibcoEMS.labelPendingMessagesLimit'),
      t('in-forge:plugins.tibcoEMS.labelSubscribersCount')
    ],
    min: 0,
    formatter: number
  }
];
