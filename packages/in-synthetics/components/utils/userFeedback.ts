/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { addMessage } from 'in-components/MessageFlyout/stores/messages';
import { t } from 'in-i18n';

export function showSuccessMessage(type?: number) {
  let message = '';
  switch (type) {
    case 1:
      message = t('in-synthetics:dialog.feedback.successMessageCreate');
      break;
    case 3:
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

export function showErrorMessage(type?: number) {
  let message = '';
  switch (type) {
    case 1:
      message = t('in-synthetics:dialog.feedback.failureMessageCreate');
      break;
    case 2:
      message = t('in-synthetics:dialog.feedback.failureMessageUpdate');
      break;
    case 3:
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

export const showCreateErrorMessage = () => showErrorMessage(1);

export const showUpdateErrorMessage = () => showErrorMessage(2);

export const showDeleteErrorMessage = () => showErrorMessage(3);

export const showCreateSuccessMessage = () => showSuccessMessage(1);

export const showDeleteSuccessMessage = () => showSuccessMessage(3);
