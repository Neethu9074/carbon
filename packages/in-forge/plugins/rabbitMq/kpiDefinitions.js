/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { greaterThanZeroFormatter } from 'in-forge/plugins/rabbitMq/formatters';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-forge:plugins.rabbitMq.messagesReadyKpiLabel'),
    metric: 'overview.messages_ready',
    formatter: greaterThanZeroFormatter
  },
  {
    label: t('in-forge:plugins.rabbitMq.consumers'),
    metric: 'overview.consumers',
    formatter: greaterThanZeroFormatter
  }
];
