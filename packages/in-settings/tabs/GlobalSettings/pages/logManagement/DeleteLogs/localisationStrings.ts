/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { t } from 'in-i18n';

export const deleteLogsLocalisationStrings = {
  deletionReason: t('in-settings:tabs.deleteLogs.deletionReason'),
  typeValidation: t('in-settings:tabs.deleteLogs.typeToContinue', { logs: t('in-settings:tabs.deleteLogs.logs') }),
  logsToDelete: t('in-settings:tabs.deleteLogs.logsToDelete'),
  deletionDetails: t('in-settings:tabs.deleteLogs.deletionDetails'),
  confirmDeletion: t('in-settings:tabs.deleteLogs.confirmDeletion'),
  modalDescription: t('in-settings:tabs.deleteLogs.modalDescription'),
  selectLogs: t('in-settings:tabs.deleteLogs.selectLogs'),
  confirmSelection: t('in-settings:tabs.deleteLogs.confirmSelection'),
  deleteButton: t('in-settings:tabs.deleteLogs.deleteButton'),
  nextButton: t('in-settings:tabs.deleteLogs.nextButton'),
  backButton: t('in-settings:tabs.deleteLogs.backButton'),
  selectLogsPageTitle: t('in-settings:tabs.deleteLogs.selectLogsPageTitle'),
  selectLogsPageDescription: t('in-settings:tabs.deleteLogs.selectLogsPageDescription'),
  confirmSelectionPageTitle: t('in-settings:tabs.deleteLogs.confirmSelectionPageTitle'),
  confirmSelectionPageDescription: t('in-settings:tabs.deleteLogs.confirmSeletionPageDescription'),
  typePlaceholder: t('in-settings:tabs.deleteLogs.logs'),
  info: t('in-settings:tabs.deleteLogs.info'),
  info2: t('in-settings:tabs.deleteLogs.info2'),
  confirmationDescription: t('in-settings:tabs.deleteLogs.confirmationDescription'),
  logs: t('in-settings:tabs.deleteLogs.logs'),
  deletionInfo: t('in-settings:tabs.deleteLogs.deletionInfo'),
  cancel: t('in-settings:tabs.cancel'),
  deleteLogs: t('in-settings:tabs.deleteLogs.deleteLogs'),
  deletionFromDate: t('in-settings:tabs.deleteLogs.deletionFromDate'),
  deletionFromTime: t('in-settings:tabs.deleteLogs.deletionFromTime'),
  deletionUntilDate: t('in-settings:tabs.deleteLogs.deletionUntilDate'),
  deletionUntilTime: t('in-settings:tabs.deleteLogs.deletionUntilTime'),
  toastSuccessTitle: t('in-settings:tabs.deleteLogs.toastSuccessTitle'),
  toastSuccessMessage: t('in-settings:tabs.deleteLogs.toastSuccessMessage'),
  toastErrorTitle: t('in-settings:tabs.deleteLogs.toastErrorTitle'),
  toastErrorMessage: t('in-settings:tabs.deleteLogs.toastErrorMessage'),
  toastNoLogsMessage: t('in-settings:tabs.deleteLogs.toastNoLogsMessage'),
  warning: t('in-settings:tabs.deleteLogs.warning'),
  learnMore: t('in-settings:tabs.deleteLogs.learnMore'),
  deletionAlreadyRunning: t('in-settings:tabs.deleteLogs.deletionAlreadyRunning'),
  deleting: t('in-settings:tabs.deleteLogs.deletionAlreadyRunning'),
  requesting: t('in-settings:tabs.deleteLogs.requesting'),
  deletionStarted: t('in-settings:tabs.deleteLogs.deletionStarted')
};

export const deletionTableLocalisationStrings = {
  deleteLogs: t('in-settings:tabs.deleteLogs.deleteLogs'),
  deletionDate: t('in-settings:tabs.deleteLogs.deletionDate'),
  reason: t('in-settings:tabs.deleteLogs.reason'),
  numberOfLogs: t('in-settings:tabs.deleteLogs.numberOfLogs'),
  triggered: t('in-settings:tabs.deleteLogs.triggered'),
  status: t('in-settings:tabs.deleteLogs.status'),
  noData: t('in-settings:tabs.deleteLogs.noData'),
  noDataInfo: t('in-settings:tabs.deleteLogs.noDataInfo'),
  summary: t('in-settings:tabs.deleteLogs.summary'),
  wrong: t('in-settings:tabs.deleteLogs.wrong'),
  errorInfo: t('in-settings:tabs.deleteLogs.errorInfo'),
  success: t('in-settings:tabs.deleteLogs.success'),
  failed: t('in-settings:tabs.deleteLogs.failed'),
  inProgress: t('in-settings:tabs.deleteLogs.inProgress')
};

export const modalLocalisationStrings = {
  typeValidation: t('in-settings:tabs.deleteLogs.typeToContinue', {
    logs: t('in-settings:tabs.deleteLogs.logs')
  }),
  untilDate: t('in-settings:tabs.deleteLogs.untilDateValidationMessage'),
  untilTime: t('in-settings:tabs.deleteLogs.untilTimeValidationMessage'),
  reasonRequired: t('in-settings:tabs.deleteLogs.reasonValidationMessage'),
  correctTimeFormat: t('in-settings:tabs.deleteLogs.correctTimeFormat'),
  invalidTimeRange: t('in-settings:tabs.deleteLogs.invalidTimeRange'),
  invalidTimeRangeSameMoment: t('in-settings:tabs.deleteLogs.invalidTimeRangeSameMoment'),
  invalidTimeRangeFuture: t('in-settings:tabs.deleteLogs.invalidTimeRangeFuture'),
  filterLimitReached: t('in-settings:tabs.deleteLogs.filterLimitReached')
};
