/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { SetStateAction, useState } from 'react';

import { SvgIcon, Typography, Button, Card, Link } from '@instana/components';
import { DeleteLogsResult } from '@instana/types/typeDefinitions';
import { DateFormatterOutput } from '@instana/format-date';
import { themes } from '@instana/design-tokens';

import {
  logManagementDeleteLogsClickedTracker,
  logManagementDeleteLogsErrorTracker,
  logManagementDeleteLogsSubmittedTracker,
  logManagementDeleteLogsSuccessTracker
} from 'in-settings/tracker';
// eslint-disable-next-line no-restricted-imports
import { analyzeDocs } from 'in-analyze/components/AnalyzeHeader/constants';
import { ModalNotification } from 'in-settings/tabs/GlobalSettings/pages/logManagement/DeleteLogs/ModalNotification';
import useDeleteLogsForm from 'in-settings/tabs/GlobalSettings/pages/logManagement/DeleteLogs/useDeleteLogsForm';
import { DeletionTable } from 'in-settings/tabs/GlobalSettings/pages/logManagement/DeleteLogs/DeletionTable';
import { NotificationState } from 'in-settings/tabs/GlobalSettings/pages/logManagement/DeleteLogs/types';
import { addMessage } from 'in-components/MessageFlyout/stores/messages';
import { getHeader as getCsrfHeader } from 'in-services/security/csrf';
import ValidationBlock from 'in-components/form/ValidationBlock';
import { parseDateTime } from 'in-services/formatters/date';
import { emptyObject } from 'in-services/fixedObjects';
import DateInput from 'in-components/form/DateInput';
import Dialog from 'in-components/Dialog/Dialog';
import TimeInput from 'in-components/TimeInput';
import Input from 'in-components/form/Input';
import Label from 'in-components/form/Label';
import { user } from 'in-stores/user';
import http from 'in-services/http';
import { t } from 'in-i18n';

import locals from './DeleteLogs.mless';

const localisationStrings = {
  deletionReason: t('in-settings:tabs.deleteLogs.deletionReason'),
  typeValidation: t('in-settings:tabs.deleteLogs.typeToContinue', { logs: t('in-settings:tabs.deleteLogs.logs') }),
  typePlaceholder: t('in-settings:tabs.deleteLogs.logs'),
  info: t('in-settings:tabs.deleteLogs.info'),
  confirmationDescription: t('in-settings:tabs.deleteLogs.confirmationDescription'),
  logs: t('in-settings:tabs.deleteLogs.logs'),
  deletionInfo: t('in-settings:tabs.deleteLogs.deletionInfo'),
  cancel: t('in-settings:tabs.cancel'),
  deleteLogs: t('in-settings:tabs.deleteLogs.deleteLogs'),
  deletionUntilDate: t('in-settings:tabs.deleteLogs.deletionUntilDate'),
  deletionUntilTime: t('in-settings:tabs.deleteLogs.deletionUntilTime'),
  toastSuccessTitle: t('in-settings:tabs.deleteLogs.toastSuccessTitle'),
  toastSuccessMessage: t('in-settings:tabs.deleteLogs.toastSuccessMessage'),
  toastErrorTitle: t('in-settings:tabs.deleteLogs.toastErrorTitle'),
  toastErrorMessage: t('in-settings:tabs.deleteLogs.toastErrorMessage'),
  toastNoLogsMessage: t('in-settings:tabs.deleteLogs.toastNoLogsMessage'),
  warning: t('in-settings:tabs.deleteLogs.warning'),
  learnMore: t('in-settings:tabs.deleteLogs.learnMore')
};

export default function DeleteLogs() {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const openConfirmationDialog = () => {
    logManagementDeleteLogsClickedTracker(emptyObject);
    setShowConfirmation(true);
  };

  return (
    <>
      <Card
        size="s"
        title={localisationStrings.deleteLogs}
        className={locals.deleteLogsWrapper}
        rightHeaderContent={
          <Button
            className={locals.deleteLogsButton}
            onClick={openConfirmationDialog}
            kind="danger"
            icon="lib_actions_delete"
          >
            {localisationStrings.deleteLogs}
          </Button>
        }
      >
        <section className={locals.page}>
          <section className={locals.titleSection}>
            <div>
              <Typography variant={'body-regular'}>
                {localisationStrings.info}
                <Link external href={`${analyzeDocs.logs}#deleting-logs`}>
                  {localisationStrings.learnMore}
                </Link>
              </Typography>
            </div>
          </section>
          <main>
            <DeletionTable isDeleting={isDeleting} />
          </main>
        </section>
      </Card>
      {showConfirmation && (
        <DeleteLogsDialog
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

interface DeleteLogsDialogProps {
  setShowConfirmation: React.Dispatch<React.SetStateAction<boolean>>;
  setIsDeleting: React.Dispatch<SetStateAction<boolean>>;
  isDeleting: boolean;
  setRetryCount: React.Dispatch<React.SetStateAction<number>>;
  retryCount: number;
}

function DeleteLogsDialog({
  setShowConfirmation,
  setIsDeleting,
  isDeleting,
  setRetryCount,
  retryCount
}: DeleteLogsDialogProps) {
  const [notification, setNotification] = useState<NotificationState>({ show: false });
  const {
    reasonInputValue,
    dateInputValue,
    timeInputValue,
    validationInputValue,
    setTimeInputValue,
    setValidationInputValue,
    setDateInputValue,
    setReasonInputValue,
    validationValidationMessage,
    reasonValidationMessage,
    dateTimeValidationMessage,
    canSubmit,
    resetForm,
    touchForm
  } = useDeleteLogsForm();

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

    const entity: DeleteLogsRequest = {
      reason: reasonInputValue,
      triggeredByUser: user?.email!,
      upToTime: parseDateTime(String(`${dateInputValue} ${timeInputValue}`)).getTime()
    };
    const deleteLogs$ = deleteLogs(entity);
    entity.retryCount = retryCount;
    entity.upToTimeDateFormat = `${dateInputValue} ${timeInputValue}`;
    setIsDeleting(true);
    logManagementDeleteLogsSubmittedTracker(entity);
    setNotification({ show: false });
    resetForm();

    deleteLogs$.once(data => {
      entity.rowsToDelete = data.body.rowsToDelete;
      entity.status = data.statusText;
      setNotification({ show: true, variant: 'success' });
      setIsDeleting(false);
      logManagementDeleteLogsSuccessTracker(entity);
      addMessage(
        {
          type: 'info',
          icon: 'lib_help_error_info_outline',
          content: (
            <section data-testid="logDeletionSuccesToast" className={locals.toast}>
              <Typography variant="heading-200">{localisationStrings.toastSuccessTitle}</Typography>
              <Typography variant="body-regular">{localisationStrings.toastSuccessMessage}</Typography>
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
      const message = isNoLogsWarning ? localisationStrings.toastNoLogsMessage : localisationStrings.toastErrorMessage;
      const heading = isNoLogsWarning ? localisationStrings.warning : localisationStrings.toastErrorTitle;

      logManagementDeleteLogsErrorTracker(entity);
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

  const ConfirmationButtons = (
    <>
      <Button data-testid="deleteLogsCancelButton" kind="secondary" onClick={() => closeConfirmationDialog()}>
        {localisationStrings.cancel}
      </Button>
      <Button data-testid="deleteLogsConfirmButton" onClick={handleSubmit} kind="danger">
        {localisationStrings.deleteLogs}
      </Button>
    </>
  );

  const LoadingButton = (
    <Button data-testid="deleteLogsLoadingButton" disabled kind="danger" className={locals.loadingButton}>
      <SvgIcon color={themes.default.ids.color.option.blue['500']} spinning type="lib_actions_loading" />
      {localisationStrings.deleteLogs}
    </Button>
  );

  return (
    <Dialog className={locals.dialog} title={localisationStrings.deleteLogs} onClose={closeConfirmationDialog}>
      <section className={locals.confirmationDialogContent}>
        <Typography variant="body-regular">{localisationStrings.confirmationDescription}</Typography>
        <section className={locals.deleteUntilSection}>
          <Label htmlFor="deletionUntilDate">
            {localisationStrings.deletionUntilDate}
            <DateInput
              hasError={!!dateTimeValidationMessage}
              disabled={isDeleting}
              value={dateInputValue}
              onChange={e => setDateInputValue(e as string)}
            />
            {dateTimeValidationMessage && (
              <ValidationBlock className={locals.validationMessage}>{dateTimeValidationMessage}</ValidationBlock>
            )}
          </Label>
          <Label htmlFor="deletionUntilTime">
            {localisationStrings.deletionUntilTime}
            <TimeInput
              disabled={isDeleting}
              hasError={!!dateTimeValidationMessage}
              value={timeInputValue as string}
              onChange={e => setTimeInputValue(e)}
              fullWidth
            />
          </Label>
        </section>
        <Label htmlFor="reason">
          {localisationStrings.deletionReason}
          <Input
            hasError={!!reasonValidationMessage}
            value={reasonInputValue}
            onChange={e => setReasonInputValue(e.target.value)}
            disabled={isDeleting}
            name="reason"
          />
          {reasonValidationMessage && (
            <ValidationBlock className={locals.validationMessage}>{reasonValidationMessage}</ValidationBlock>
          )}
        </Label>
        <Label htmlFor="typingValidation">
          {localisationStrings.typeValidation}
          <Input
            autoComplete="off"
            hasError={!!validationValidationMessage}
            disabled={isDeleting}
            value={validationInputValue}
            onChange={e => setValidationInputValue(e.target.value)}
            placeholder={localisationStrings.typePlaceholder}
            name="typingValidation"
          />
          {validationValidationMessage && (
            <ValidationBlock className={locals.validationMessage}>{validationValidationMessage}</ValidationBlock>
          )}
        </Label>
        {isDeleting && <Typography variant={'body-small'}>{localisationStrings.deletionInfo}</Typography>}
        {notification.show && <ModalNotification variant={notification.variant} />}
      </section>
      <section className={locals.buttons}>{isDeleting ? LoadingButton : ConfirmationButtons}</section>
    </Dialog>
  );
}

interface DeleteLogsRequest {
  triggeredByUser: string;
  reason: string;
  upToTime: number;
  upToTimeDateFormat?: DateFormatterOutput;
  rowsToDelete?: number;
  status?: string;
  retryCount?: number;
  errorMessage?: string;
}

export function deleteLogs(params: DeleteLogsRequest) {
  return http<DeleteLogsResult>({
    method: 'DELETE',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: `/api/logging/logs`,
    queryParams: { ...params }
  });
}
