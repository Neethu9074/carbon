/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { addMessage } from 'in-components/MessageFlyout/stores/messages';
import { t } from 'in-i18n';

type ActionType = 'create' | 'delete' | 'update';

// Contexts available will be "test" deletion dialog and "location" deletion dialog

export function showSuccessMessage(type?: ActionType, context?: string): void {
  let message = '';
  switch (type) {
    case 'create':
      message = t('in-synthetics:dialog.feedback.successMessageCreate');
      break;
    case 'update':
      message = t('in-synthetics:dialog.feedback.successMessageUpdate');
      break;
    case 'delete':
      message =
        context === 'locations'
          ? t('in-synthetics:dialog.locationFeedback.successMessageDelete')
          : t('in-synthetics:dialog.feedback.successMessageDelete');
      break;
    default:
      message = '';
      break;
  }
  addMessage({
    type: 'info',
    timeout: 4000,
    title: t('in-synthetics:dialog.feedback.successTitle'),
    content: message
  });
}

export function showErrorMessage(type?: ActionType, context?: string): void {
  let message = '';
  switch (type) {
    case 'create':
      message = t('in-synthetics:dialog.feedback.failureMessageCreate');
      break;
    case 'update':
      message = t('in-synthetics:dialog.feedback.failureMessageUpdate');
      break;
    case 'delete':
      message =
        context === 'locations'
          ? t('in-synthetics:dialog.locationFeedback.failureMesssageDelete')
          : t('in-synthetics:dialog.feedback.failuteMesssageDelete');
      break;
    default:
      message = '';
      break;
  }
  addMessage({
    type: 'danger',
    timeout: 4000,
    title: t('in-synthetics:dialog.feedback.failureTitle'),
    content: message
  });
}

export const showCreateErrorMessage = () => showErrorMessage('create');

export const showUpdateErrorMessage = () => showErrorMessage('update');

export const showDeleteErrorMessage = (context?: string) => showErrorMessage('delete', context);

export const showCreateSuccessMessage = () => showSuccessMessage('create');

export const showUpdateSuccessMessage = () => showSuccessMessage('update');

export const showDeleteSuccessMessage = (context?: string) => showSuccessMessage('delete', context);
