/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { useEffect, useState } from 'react';

import {
  CarbonForm,
  CarbonFormGroup,
  CarbonModal,
  CarbonStack,
  CarbonTextInput,
  DateInput as CarbonDateInput,
  Typography,
  ValidationBlock
} from '@instana/components';

import {
  SETTINGS_LOG_MANAGEMENT_DELETE_LOGS_ERROR,
  SETTINGS_LOG_MANAGEMENT_DELETE_LOGS_SUBMITTED,
  SETTINGS_LOG_MANAGEMENT_DELETE_LOGS_SUCCESS
} from 'in-services/tracking/eventNames';
import {
  addSecondsIfValidFormat,
  DeleteLogsRequest,
  getDeletionStatus
} from 'in-settings/tabs/GlobalSettings/pages/logManagement/DeleteLogs/utils';
import { deleteLogsLocalisationStrings as t } from 'in-settings/tabs/GlobalSettings/pages/logManagement/DeleteLogs/localisationStrings';
import { ModalNotification } from 'in-settings/tabs/GlobalSettings/pages/logManagement/DeleteLogs/DeleteLogsModal/ModalNotification';
import useDeleteLogsForm from 'in-settings/tabs/GlobalSettings/pages/logManagement/DeleteLogs/DeleteLogsModal/useDeleteLogsForm';
import { showToast } from 'in-settings/tabs/GlobalSettings/pages/logManagement/DeleteLogs/DeleteLogsModal/utils';
import { NotificationState } from 'in-settings/tabs/GlobalSettings/pages/logManagement/DeleteLogs/types';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import { formatDate, parseDateTime } from 'in-services/formatters/date';
import { deleteLogs } from 'in-logging/api/deleteLogs';
import TimePicker from 'in-components/form/TimePicker';
import { activeLocale } from 'in-i18n';
import { user } from 'in-stores/user';

import locals from 'in-settings/tabs/GlobalSettings/pages/logManagement/DeleteLogs/DeleteLogs.mless';

interface DeleteLogsModalProps {
  isDeleting: boolean;
  setIsDeleting: (v: boolean) => void;
  retryCount: number;
  setRetryCount: (fn: (prev: number) => number) => void;
  closeModal: () => void;
  deletionInProgress: boolean;
}

export function DeleteLogsModal({
  isDeleting,
  setIsDeleting,
  retryCount,
  setRetryCount,
  closeModal,
  deletionInProgress
}: DeleteLogsModalProps) {
  const [notification, setNotification] = useState<NotificationState>({ show: false });
  const { canSubmit, setInputValues, inputValues, validationMessages, resetForm, touchForm } = useDeleteLogsForm();
  const { trackCta } = useSegmentTracking();

  const [hasStarted, setHasStarted] = useState(false);
  const [showFinished, setShowFinished] = useState(false);

  useEffect(() => {
    if (isDeleting) {
      setHasStarted(true);
      setShowFinished(false);
      return;
    }

    if (!isDeleting && hasStarted) {
      setShowFinished(true);
      const timeout = setTimeout(() => {
        setShowFinished(false);
      }, 2000);

      return () => clearTimeout(timeout);
    }

    return;
  }, [isDeleting, hasStarted]);

  const handleSubmit = () => {
    if (!canSubmit || isDeleting) {
      touchForm();
      return;
    }

    const upToTime = parseDateTime(`${inputValues.endDate} ${addSecondsIfValidFormat(inputValues.endTime)}`).getTime();
    const params: DeleteLogsRequest = {
      reason: inputValues.reason,
      triggeredByUser: user?.email!,
      upToTime,
      retryCount,
      upToTimeDateFormat: `${inputValues.endDate} ${inputValues.endTime}`
    };

    setIsDeleting(true);
    setNotification({ show: false });
    resetForm();
    trackCta(SETTINGS_LOG_MANAGEMENT_DELETE_LOGS_SUBMITTED, params);

    const deleteLogs$ = deleteLogs(params);

    deleteLogs$.once(data => {
      params.rowsToDelete = data.body.rowsToDelete;
      params.status = data.statusText;
      trackCta(SETTINGS_LOG_MANAGEMENT_DELETE_LOGS_SUCCESS, params);
      showToast('success', t.toastSuccessTitle, t.toastSuccessMessage, 'logsDeleted');
      setNotification({ show: true, variant: 'success' });
      setIsDeleting(false);
      setRetryCount(() => 0);
    });

    deleteLogs$.errors().once(error => {
      params.errorMessage = error.message;

      const isNoLogs = error.message.includes('No log data');
      const toastType = isNoLogs ? 'warning' : 'danger';
      const variant = isNoLogs ? 'warning' : 'error';
      const icon = isNoLogs ? 'lib_help_error_warning_outline' : 'lib_help_error_info_outline';
      const title = isNoLogs ? t.warning : t.toastErrorTitle;
      const message = isNoLogs ? t.toastNoLogsMessage : t.toastErrorMessage;

      trackCta(SETTINGS_LOG_MANAGEMENT_DELETE_LOGS_ERROR, params);
      setRetryCount(count => count + 1);
      setNotification({ show: true, variant });
      setIsDeleting(false);
      showToast(toastType, title, message, 'logsDeleted', icon);
    });
  };

  const { loadingStatus, loadingDescription } = getDeletionStatus({
    isDeleting,
    deletionInProgress,
    showFinished
  });

  return (
    <CarbonModal
      open
      danger
      loadingStatus={loadingStatus}
      loadingDescription={loadingDescription}
      preventCloseOnClickOutside
      className={locals.dialog}
      role="dialog"
      primaryButtonText={t.deleteLogs}
      primaryButtonDisabled={!canSubmit}
      secondaryButtonText={t.cancel}
      modalHeading={t.confirmDeletion}
      modalLabel={t.deleteLogs}
      onRequestSubmit={handleSubmit}
      onSecondarySubmit={closeModal}
      onRequestClose={closeModal}
      title={t.deleteLogs}
    >
      {t.modalDescription}
      <CarbonForm>
        <CarbonFormGroup legendText="" aria-label="Delete logs modal form">
          <CarbonStack gap={6}>
            <section className={locals.timeSection}>
              <div className={locals.untilDateInput}>
                <CarbonDateInput
                  id="deletionUntilDate"
                  hasError={!!validationMessages.endDate}
                  disabled={isDeleting}
                  value={new Date(inputValues.endDate as string)}
                  onChange={e => setInputValues.endDate(formatDate((e as Date[])[0])!)}
                  locale={activeLocale}
                  aria-labelledby="deletionUntilDateLabel"
                  labelText={t.deletionUntilDate}
                />
                {!!validationMessages.endDate && (
                  <ValidationBlock className={locals.validationMessage}>{validationMessages.endDate}</ValidationBlock>
                )}
              </div>
              <TimePicker
                id={t.deletionUntilTime}
                labelText={t.deletionUntilTime}
                disabled={isDeleting}
                size="sm"
                value={inputValues.endTime}
                invalid={!!validationMessages.endTime}
                invalidText={validationMessages.endTime}
                onChange={setInputValues.endTime}
              />
            </section>

            <CarbonTextInput
              id={t.deletionReason}
              labelText={t.deletionReason}
              value={inputValues.reason}
              onChange={e => setInputValues.reason(e.target.value)}
              disabled={isDeleting}
              invalid={!!validationMessages.reason}
              invalidText={validationMessages.reason}
            />

            <CarbonTextInput
              id={t.typeValidation}
              autoComplete="off"
              placeholder={t.typePlaceholder}
              name="typingValidation"
              labelText={t.typeValidation}
              value={inputValues.validation}
              onChange={e => setInputValues.validation(e.target.value)}
              disabled={isDeleting}
              invalid={!!validationMessages.validation}
              invalidText={validationMessages.validation}
            />

            {isDeleting && <Typography variant="body-small">{t.deletionInfo}</Typography>}
            {notification.show && <ModalNotification variant={notification.variant} />}
          </CarbonStack>
        </CarbonFormGroup>
      </CarbonForm>
    </CarbonModal>
  );
}
