/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { addMessage } from 'in-components/MessageFlyout/stores/messages';
import { t } from 'in-i18n';

type ActionType = 'create' | 'delete' | 'update';

export function showSuccessMessage(type?: ActionType): void {
  let message = '';
  switch (type) {
    case 'create':
      message = t('in-synthetics:dialog.feedback.successMessageCreate');
      break;
    case 'delete':
      message = t('in-synthetics:dialog.feedback.successMessageDelete');
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

export function showErrorMessage(type?: ActionType): void {
  let message = '';
  switch (type) {
    case 'create':
      message = t('in-synthetics:dialog.feedback.failureMessageCreate');
      break;
    case 'update':
      message = t('in-synthetics:dialog.feedback.failureMessageUpdate');
      break;
    case 'delete':
      message = t('in-synthetics:dialog.feedback.failuteMesssageDelete');
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

export const showDeleteErrorMessage = () => showErrorMessage('delete');

export const showCreateSuccessMessage = () => showSuccessMessage('create');

export const showDeleteSuccessMessage = () => showSuccessMessage('delete');
