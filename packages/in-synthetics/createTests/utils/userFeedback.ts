/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { addMessage } from 'in-components/MessageFlyout/stores/messages';
import { t } from 'in-i18n';

type ActionType = 'create' | 'delete' | 'update' | 'deactivate' | 'activate' | 'cicd-rerun' | 'cicd-create';

const getDeletionFailureMessage = (context?: string, error?: string) => {
  if (context === 'locations')
    return t('in-synthetics:dialog.locationFeedback.failureMesssage', { errorMessage: error });
  else if (context === 'credentials')
    return t('in-synthetics:dialog.credentialFeedback.failureMesssage', { errorMessage: error });
  else return t('in-synthetics:dialog.feedback.failureMesssageDelete', { errorMessage: error });
};

const getDeletionSuccessMessage = (context?: string) => {
  if (context === 'locations') return t('in-synthetics:dialog.locationFeedback.successMessageDelete');
  else if (context === 'credentials') return t('in-synthetics:dialog.credentialFeedback.successMessageDelete');
  else return t('in-synthetics:dialog.feedback.successMessageDelete');
};

// Contexts available will be "test" deletion dialog and "location" deletion dialog

export function showSuccessMessage(type?: ActionType, context?: string): void {
  let message;
  switch (type) {
    case 'create':
      message =
        context === 'credential'
          ? t('in-synthetics:dialog.createCredential.feedback.successMessage')
          : t('in-synthetics:dialog.feedback.successMessageCreate');
      break;
    case 'update':
      message =
        context === 'credential'
          ? t('in-synthetics:dialog.createCredential.feedback.updateSuccessMessage')
          : t('in-synthetics:dialog.feedback.successMessageUpdate');
      break;
    case 'delete':
      message = getDeletionSuccessMessage(context);
      break;
    case 'deactivate':
      message = t('in-synthetics:dialog.locationFeedback.successMessageDeactivate');
      break;
    case 'activate':
      message = t('in-synthetics:dialog.locationFeedback.successMessageActivate');
      break;
    case 'cicd-rerun':
      message = t('in-synthetics:dialog.feedback.successMessageCICDRerun');
      break;
    case 'cicd-create':
      message = t('in-synthetics:dialog.feedback.successMessageCICDCreate');
      break;
    default:
      message = '';
      break;
  }
  addMessage({
    type: 'info',
    timeout: type === 'cicd-create' ? 10000 : 4000,
    title: t('in-synthetics:dialog.feedback.successTitle'),
    content: message
  });
}

export function showErrorMessage(type?: ActionType, context?: string, error?: string): void {
  let message;
  switch (type) {
    case 'create':
      message =
        context === 'credential'
          ? t('in-synthetics:dialog.createCredential.feedback.failureMessageCreate', { errorMessage: error })
          : t('in-synthetics:dialog.feedback.failureMessageCreate', { errorMessage: error });
      break;
    case 'update':
      message =
        context === 'credential'
          ? t('in-synthetics:dialog.createCredential.feedback.failureMessageUpdate', { errorMessage: error })
          : t('in-synthetics:dialog.feedback.failureMessageUpdate', { errorMessage: error });
      break;
    case 'delete':
      message = getDeletionFailureMessage(context, error);
      break;
    case 'deactivate':
      message = t('in-synthetics:dialog.locationFeedback.failureMesssage', { errorMessage: error });
      break;
    case 'activate':
      message = t('in-synthetics:dialog.locationFeedback.failureMesssage', { errorMessage: error });
      break;
    case 'cicd-rerun':
      message = t('in-synthetics:dialog.feedback.failureMesssageCICDRerun', { errorMessage: error });
      break;
    case 'cicd-create':
      message = t('in-synthetics:dialog.feedback.failureMesssageCICDCreate', { errorMessage: error });
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

export const showCreateErrorMessage = (error: string, context?: string) => showErrorMessage('create', context, error);

export const showUpdateErrorMessage = (error: string, context?: string) => showErrorMessage('update', context, error);

export const showDeleteErrorMessage = (error: string, context?: string) => showErrorMessage('delete', context, error);

export const showCreateSuccessMessage = (context?: string) => showSuccessMessage('create', context);

export const showUpdateSuccessMessage = (context?: string) => showSuccessMessage('update', context);

export const showDeleteSuccessMessage = (context?: string) => showSuccessMessage('delete', context);

export const showLocationDeactivateSuccessMessage = () => showSuccessMessage('deactivate');

export const showLocationDeactivateErrorMessage = (error: string) => showErrorMessage('deactivate', undefined, error);

export const showLocationActivateSuccessMessage = () => showSuccessMessage('activate');

export const showLocationActivateErrorMessage = (error: string) => showErrorMessage('activate', undefined, error);

export const showCICDRerunSuccessMessage = () => showSuccessMessage('cicd-rerun');

export const showCICDRerunErrorMessage = (error: string) => showErrorMessage('cicd-rerun', undefined, error);

export const showCICDCreateSuccessMessage = () => showSuccessMessage('cicd-create');

export const showCICDCreateErrorMessage = (error: string) => showErrorMessage('cicd-create', undefined, error);
