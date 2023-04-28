/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metrics: [
      'uptime',
      'connectionCount',
      'sessionCount',
      'durableCount',
      'readOperations',
      'writeOperations',
      'pendingMessageCount',
      'pendingMessageSize',
      'messagesMemory',
      'inMessages',
      'inMessagesCount',
      'outMessages',
      'outMessagesCount'
    ],
    labels: [
      t('in-forge:plugins.tibcoEMS.labelUpTime'),
      t('in-forge:plugins.tibcoEMS.labelConnectionsCount'),
      t('in-forge:plugins.tibcoEMS.labelSessionsCount'),
      t('in-forge:plugins.tibcoEMS.labelDurablesCount'),
      t('in-forge:plugins.tibcoEMS.labelReadOperationsRate'),
      t('in-forge:plugins.tibcoEMS.labelWriteOperationsRate'),
      t('in-forge:plugins.tibcoEMS.labelPendingMessagesCount'),
      t('in-forge:plugins.tibcoEMS.labelPendingMessagesSize'),
      t('in-forge:plugins.tibcoEMS.titleMessagesMemory'),
      t('in-forge:plugins.tibcoEMS.labelInMessagesRate'),
      t('in-forge:plugins.tibcoEMS.labelInMessagesCount'),
      t('in-forge:plugins.tibcoEMS.labelOutMessagesCount'),
      t('in-forge:plugins.tibcoEMS.labelOutMessagesRate')
    ],
    min: 0,
    formatter: number
  }
];
