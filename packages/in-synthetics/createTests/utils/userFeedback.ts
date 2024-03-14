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

export function showErrorMessage(type?: ActionType, context?: string, error?: string): void {
  let message = '';
  switch (type) {
    case 'create':
      message = t('in-synthetics:dialog.feedback.failureMessageCreate', { errorMessage: error });
      break;
    case 'update':
      message = t('in-synthetics:dialog.feedback.failureMessageUpdate', { errorMessage: error });
      break;
    case 'delete':
      message =
        context === 'locations'
          ? t('in-synthetics:dialog.locationFeedback.failureMesssageDelete')
          : t('in-synthetics:dialog.feedback.failureMesssageDelete', { errorMessage: error });
      break;
    default:
      message = '';
      break;
  }
  addMessage({
    type: 'danger',
    timeout: 10000,
    title: t('in-synthetics:dialog.feedback.failureTitle'),
    content: message
  });
}

export const showCreateErrorMessage = (error: string) => showErrorMessage('create', undefined, error);

export const showUpdateErrorMessage = (error: string) => showErrorMessage('update', undefined, error);

export const showDeleteErrorMessage = (error: string, context?: string) => showErrorMessage('delete', context, error);

export const showCreateSuccessMessage = () => showSuccessMessage('create');

export const showUpdateSuccessMessage = () => showSuccessMessage('update');

export const showDeleteSuccessMessage = (context?: string) => showSuccessMessage('delete', context);
