/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { number, bytes } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metric: 'number_of_messages_published',
    label: t('in-forge:plugins.awsSns.dashboard.numberOfMessagesPublished'),
    category: [t('in-forge:plugins.awsSns.dashboard.messages')],
    min: 0,
    formatter: number
  },
  {
    metric: 'number_of_notifications_failed',
    label: t('in-forge:plugins.awsSns.dashboard.numberOfNotificationsFailed'),
    category: [t('in-forge:plugins.awsSns.dashboard.messages')],
    min: 0,
    formatter: number
  },
  {
    metric: 'number_of_notifications_delivered',
    label: t('in-forge:plugins.awsSns.dashboard.numberOfNotificationsDelivered'),
    category: [t('in-forge:plugins.awsSns.dashboard.messages')],
    min: 0,
    formatter: number
  },
  {
    metric: 'publish_size',
    label: t('in-forge:plugins.awsSns.dashboard.publishSize'),
    category: [t('in-forge:plugins.awsSns.dashboard.messages')],
    min: 0,
    formatter: bytes
  },
  {
    metric: 'number_of_notifications_failed_to_redrive_to_dlq',
    label: t('in-forge:plugins.awsSns.dashboard.numberOfNotificationsFailedToRedriveToDlq'),
    category: [t('in-forge:plugins.awsSns.dashboard.messages')],
    min: 0,
    formatter: number
  },
  {
    metric: 'number_of_notifications_redriven_to_dlq',
    label: t('in-forge:plugins.awsSns.dashboard.numberOfNotificationsRedrivenToDlq'),
    category: [t('in-forge:plugins.awsSns.dashboard.messages')],
    min: 0,
    formatter: number
  },
  {
    metric: 'number_of_notifications_filtered_out',
    label: t('in-forge:plugins.awsSns.dashboard.numberOfNotificationsFilteredOut'),
    category: [t('in-forge:plugins.awsSns.dashboard.messages')],
    formatter: number
  }
];
