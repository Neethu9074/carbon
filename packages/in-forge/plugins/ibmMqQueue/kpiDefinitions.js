/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { number, seconds } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-forge:plugins.ibmMqQueue.queueDepth'),
    metric: 'queueDepth',
    formatter: number.compact
  },
  {
    label: t('in-forge:plugins.ibmMqQueue.oldestMessage'),
    metric: 'oldestMessage',
    formatters: seconds.fixedCompact
  }
];
