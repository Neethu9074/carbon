/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { addMessage } from 'in-components/MessageFlyout/stores/messages';
import { t } from 'in-i18n';

export function showSuccessMessage() {
  addMessage({
    type: 'info',
    timeout: 4000,
    title: t('in-synthetics:dialog.feedback.successTitle'),
    content: t('in-synthetics:dialog.feedback.successMessage')
  });
}

export function showErrorMessage() {
  addMessage({
    type: 'danger',
    timeout: 4000,
    title: t('in-synthetics:dialog.feedback.failureTitle'),
    content: t('in-synthetics:dialog.feedback.failureMessage')
  });
}
