/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { SetStateAction, useState } from 'react';

import {
  Button,
  CarbonForm,
  CarbonFormGroup,
  CarbonModal,
  CarbonStack,
  CarbonTextInput,
  Card,
  DateInput as CarbonDateInput,
  Link,
  Typography,
  ValidationBlock
} from '@instana/components';

import {
  SETTINGS_LOG_MANAGEMENT_DELETE_LOGS_CLICKED,
  SETTINGS_LOG_MANAGEMENT_DELETE_LOGS_SUBMITTED,
  SETTINGS_LOG_MANAGEMENT_DELETE_LOGS_SUCCESS,
  SETTINGS_LOG_MANAGEMENT_DELETE_LOGS_ERROR
} from 'in-services/tracking/tracking';
import {
  addSecondsIfValidFormat,
  deleteLogs,
  DeleteLogsRequest
} from 'in-settings/tabs/GlobalSettings/pages/logManagement/DeleteLogs/utils';
import { deleteLogsLocalisationStrings } from 'in-settings/tabs/GlobalSettings/pages/logManagement/DeleteLogs/localisationStrings';
// eslint-disable-next-line no-restricted-imports
import { analyzeDocs } from 'in-analyze/components/AnalyzeHeader/constants';
import { ModalNotification } from 'in-settings/tabs/GlobalSettings/pages/logManagement/DeleteLogs/ModalNotification';
import useDeleteLogsForm from 'in-settings/tabs/GlobalSettings/pages/logManagement/DeleteLogs/useDeleteLogsForm';
import { DeletionTable } from 'in-settings/tabs/GlobalSettings/pages/logManagement/DeleteLogs/DeletionTable';
import { NotificationState } from 'in-settings/tabs/GlobalSettings/pages/logManagement/DeleteLogs/types';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import { addMessage } from 'in-components/MessageFlyout/stores/messages';
import TimePicker from 'in-components/form/TimePicker/TimePicker';
import SubViewHeader from 'in-settings/components/SubViewHeader';
import { carbonTableEnabled } from 'in-services/featureFlags';
import { parseDateTime } from 'in-services/formatters/date';
import Title from 'in-components/Title/Title';
import Label from 'in-components/form/Label';
import { user } from 'in-stores/user';

import locals from './DeleteLogs.mless';

export default function DeleteLogs() {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const { trackCta } = useSegmentTracking();
  const openConfirmationDialog = () => {
    trackCta(SETTINGS_LOG_MANAGEMENT_DELETE_LOGS_CLICKED);
    setShowConfirmation(true);
  };

  const DeleteButton = (
    <Button
      className={locals.deleteLogsButton}
      onClick={openConfirmationDialog}
      kind="danger"
      icon="lib_actions_delete"
    >
      {deleteLogsLocalisationStrings.deleteLogs}
    </Button>
  );

  return (
    <>
      <Title title={deleteLogsLocalisationStrings.deleteLogs} />
      <section className={locals.titleSection}>
        <SubViewHeader>{deleteLogsLocalisationStrings.deleteLogs}</SubViewHeader>
        {!carbonTableEnabled && DeleteButton}
      </section>
      <section className={locals.descriptionSection}>
        <Typography variant={'body-regular'}>
          {deleteLogsLocalisationStrings.info}
          <br />
          {deleteLogsLocalisationStrings.info2}
          <Link external href={`${analyzeDocs.logs}#deleting-logs`} className={locals.underline}>
            {deleteLogsLocalisationStrings.learnMore}
          </Link>
        </Typography>
      </section>
      <Card className={locals.noPadding}>
        <main>
          <DeletionTable openConfirmationDialog={openConfirmationDialog} isDeleting={isDeleting} />
        </main>
      </Card>
      {showConfirmation && (
        <DeleteLogsModal
          setShowConfirmation={setShowConfirmation}
          setIsDeleting={setIsDeleting}
          isDeleting={isDeleting}
          setRetryCount={setRetryCount}
          retryCount={retryCount}
        />
      )}
    </>
  );
}

interface DeleteLogsModalProps {
  setShowConfirmation: React.Dispatch<React.SetStateAction<boolean>>;
  setIsDeleting: React.Dispatch<SetStateAction<boolean>>;
  isDeleting: boolean;
  setRetryCount: React.Dispatch<React.SetStateAction<number>>;
  retryCount: number;
}

function DeleteLogsModal({
  setShowConfirmation,
  setIsDeleting,
  isDeleting,
  setRetryCount,
  retryCount
}: DeleteLogsModalProps) {
  const [notification, setNotification] = useState<NotificationState>({ show: false });
  const {
    reasonInputValue,
    dateInputValue,
    timeInputValue,
    validationInputValue,
    setValidationInputValue,
    setDateInputValue,
    setReasonInputValue,
    validationValidationMessage,
    reasonValidationMessage,
    dateValidationMessage,
    timeValidationMessage,
    canSubmit,
    setTimeInputValue,
    resetForm,
    touchForm
  } = useDeleteLogsForm();
  const { trackCta } = useSegmentTracking();

  const isDeleteDisabled = !canSubmit || isDeleting;

  const closeConfirmationDialog = () => {
    setShowConfirmation(false);
    setNotification({ show: false });
  };

  const handleSubmit = () => {
    if (isDeleteDisabled) {
      touchForm();
      return;
    }
    const newTimeInputValue = addSecondsIfValidFormat(timeInputValue as string);
    const entity: DeleteLogsRequest = {
      reason: reasonInputValue,
      triggeredByUser: user?.email!,
      upToTime: parseDateTime(String(`${dateInputValue} ${newTimeInputValue}`)).getTime()
    };

    const deleteLogs$ = deleteLogs(entity);
    entity.retryCount = retryCount;
    entity.upToTimeDateFormat = `${dateInputValue} ${newTimeInputValue}`;
    setIsDeleting(true);
    trackCta(SETTINGS_LOG_MANAGEMENT_DELETE_LOGS_SUBMITTED, entity);
    setNotification({ show: false });
    resetForm();

    deleteLogs$.once(data => {
      entity.rowsToDelete = data.body.rowsToDelete;
      entity.status = data.statusText;
      setNotification({ show: true, variant: 'success' });
      setIsDeleting(false);
      trackCta(SETTINGS_LOG_MANAGEMENT_DELETE_LOGS_SUCCESS, entity);
      addMessage(
        {
          type: 'info',
          icon: 'lib_help_error_info_outline',
          content: (
            <section data-testid="logDeletionSuccesToast" className={locals.toast}>
              <Typography variant="heading-200">{deleteLogsLocalisationStrings.toastSuccessTitle}</Typography>
              <Typography variant="body-regular">{deleteLogsLocalisationStrings.toastSuccessMessage}</Typography>
            </section>
          ),
          timeout: 5000
        },
        'logsDeleted'
      );
      setRetryCount(0);
    });

    deleteLogs$.errors().once(error => {
      entity.errorMessage = error.message;

      const isNoLogsWarning = error.message.includes('No log data');
      const type = isNoLogsWarning ? 'warning' : 'danger';
      const icon = isNoLogsWarning ? 'lib_help_error_warning_outline' : 'lib_help_error_info_outline';
      const message = isNoLogsWarning
        ? deleteLogsLocalisationStrings.toastNoLogsMessage
        : deleteLogsLocalisationStrings.toastErrorMessage;
      const heading = isNoLogsWarning
        ? deleteLogsLocalisationStrings.warning
        : deleteLogsLocalisationStrings.toastErrorTitle;

      trackCta(SETTINGS_LOG_MANAGEMENT_DELETE_LOGS_ERROR, entity);
      setRetryCount(retryCount => retryCount + 1);
      setNotification({ show: true, variant: isNoLogsWarning ? 'warning' : 'error' });
      setIsDeleting(false);

      addMessage(
        {
          type,
          icon,
          content: (
            <section data-testid="logDeletionErrorToast" className={locals.toast}>
              <Typography variant="heading-200">{heading}</Typography>
              <Typography variant="body-regular">{message}</Typography>
            </section>
          ),
          timeout: 5000
        },
        'logsDeleted'
      );
    });
  };

  return (
    <>
      <CarbonModal
        open
        danger
        primaryButtonText={deleteLogsLocalisationStrings.deleteLogs}
        secondaryButtonText={deleteLogsLocalisationStrings.cancel}
        modalHeading={deleteLogsLocalisationStrings.confirmDeletion}
        modalLabel={deleteLogsLocalisationStrings.deleteLogs}
        primaryButtonDisabled={!canSubmit}
        onRequestSubmit={handleSubmit}
        title={deleteLogsLocalisationStrings.deleteLogs}
        onSecondarySubmit={closeConfirmationDialog}
        onRequestClose={closeConfirmationDialog}
        className={locals.dialog}
      >
        {deleteLogsLocalisationStrings.modalDescription}
        <CarbonForm>
          <CarbonFormGroup legendText="">
            <CarbonStack gap={6}>
              <section className={locals.timeSection}>
                <Label htmlFor="deletionUntilDate">
                  <span>{deleteLogsLocalisationStrings.deletionUntilDate}</span>
                  <section className={locals.marginLabel}>
                    <CarbonDateInput
                      hasError={!!dateValidationMessage}
                      disabled={isDeleting}
                      value={new Date(dateInputValue as string)}
                      onChange={e => setDateInputValue(e as string[])}
                    />
                  </section>
                  {dateValidationMessage && (
                    <ValidationBlock className={locals.validationMessage}>{dateValidationMessage}</ValidationBlock>
                  )}
                </Label>
                <TimePicker
                  id={deleteLogsLocalisationStrings.deletionUntilTime}
                  labelText={deleteLogsLocalisationStrings.deletionUntilTime}
                  disabled={isDeleting}
                  size="sm"
                  value={timeInputValue as string}
                  invalid={!!timeValidationMessage}
                  invalidText={timeValidationMessage}
                  onChange={e => setTimeInputValue(e)}
                />
              </section>
              <CarbonTextInput
                id={deleteLogsLocalisationStrings.deletionReason}
                invalid={!!reasonValidationMessage}
                invalidText={reasonValidationMessage}
                value={reasonInputValue}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setReasonInputValue(e.target.value)}
                disabled={isDeleting}
                name="reason"
                labelText={deleteLogsLocalisationStrings.deletionReason}
              />

              <CarbonTextInput
                id={deleteLogsLocalisationStrings.typeValidation}
                autoComplete="off"
                invalid={!!validationValidationMessage}
                invalidText={validationValidationMessage}
                disabled={isDeleting}
                value={validationInputValue}
                onChange={(e: any) => setValidationInputValue(e.target.value)}
                placeholder={deleteLogsLocalisationStrings.typePlaceholder}
                name="typingValidation"
                labelText={deleteLogsLocalisationStrings.typeValidation}
              />

              {isDeleting && (
                <Typography variant={'body-small'}>{deleteLogsLocalisationStrings.deletionInfo}</Typography>
              )}
              {notification.show && <ModalNotification variant={notification.variant} />}
            </CarbonStack>
          </CarbonFormGroup>
        </CarbonForm>
      </CarbonModal>
    </>
  );
}
