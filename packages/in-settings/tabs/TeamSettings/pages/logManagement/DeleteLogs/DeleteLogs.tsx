/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { SetStateAction, useState } from 'react';

import { DeleteLogsHistoryResult } from '@instana/types/typeDefinitions';
import { SvgIcon, Typography } from '@instana/components';
import { themes } from '@instana/design-tokens';
import { Button } from '@instana/legacy';

import { ModalNotification } from 'in-settings/tabs/TeamSettings/pages/logManagement/DeleteLogs/ModalNotification';
import useDeleteLogsForm from 'in-settings/tabs/TeamSettings/pages/logManagement/DeleteLogs/useDeleteLogsForm';
import { DeletionTable } from 'in-settings/tabs/TeamSettings/pages/logManagement/DeleteLogs/DeletionTable';
import { NotificationState } from 'in-settings/tabs/TeamSettings/pages/logManagement/DeleteLogs/types';
import SettingsDetailPage from 'in-settings/components/SettingsDetailPage';
import { addMessage } from 'in-components/MessageFlyout/stores/messages';
import { getHeader as getCsrfHeader } from 'in-services/security/csrf';
import SubViewHeader from 'in-settings/components/SubViewHeader';
import ValidationBlock from 'in-components/form/ValidationBlock';
import { parseDateTime } from 'in-services/formatters/date';
import DateInput from 'in-components/form/DateInput';
import Dialog from 'in-components/Dialog/Dialog';
import TimeInput from 'in-components/TimeInput';
import Input from 'in-components/form/Input';
import Label from 'in-components/form/Label';
import Title from 'in-components/Title';
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
  toastErrorMessage: t('in-settings:tabs.deleteLogs.toastErrorMessage')
};

export default function DeleteLogs() {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const openConfirmationDialog = () => setShowConfirmation(true);

  return (
    <>
      <SettingsDetailPage className={locals.page}>
        <Title title={localisationStrings.deleteLogs} />
        <section className={locals.titleSection}>
          <SubViewHeader>{localisationStrings.deleteLogs}</SubViewHeader>
          <Button onClick={openConfirmationDialog} kind="danger">
            {localisationStrings.deleteLogs}
          </Button>
        </section>
        <main>
          <Typography variant={'body-small'}>{localisationStrings.info}</Typography>
          <DeletionTable isDeleting={isDeleting} />
        </main>
      </SettingsDetailPage>
      {showConfirmation && (
        <DeleteLogsDialog
          setShowConfirmation={setShowConfirmation}
          setIsDeleting={setIsDeleting}
          isDeleting={isDeleting}
        />
      )}
    </>
  );
}

interface DeleteLogsDialogProps {
  setShowConfirmation: React.Dispatch<React.SetStateAction<boolean>>;
  setIsDeleting: React.Dispatch<SetStateAction<boolean>>;
  isDeleting: boolean;
}

function DeleteLogsDialog({ setShowConfirmation, setIsDeleting, isDeleting }: DeleteLogsDialogProps) {
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
    resetForm
  } = useDeleteLogsForm();

  const isDeleteDisabled = !canSubmit || isDeleting;

  const closeConfirmationDialog = () => {
    setShowConfirmation(false);
    setNotification({ show: false });
  };

  const handleSubmit = () => {
    const deleteLogs$ = deleteLogs({
      reason: reasonInputValue,
      triggeredByUser: user?.email!,
      upToTime: parseDateTime(String(`${dateInputValue} ${timeInputValue}`)).getTime()
    });

    setIsDeleting(true);
    setNotification({ show: false });
    resetForm();

    deleteLogs$.once(() => {
      setNotification({ show: true, variant: 'success' });
      setIsDeleting(false);
      addMessage(
        {
          type: 'info',
          icon: 'lib_help_error_info_outline',
          content: (
            <section className={locals.toast}>
              <Typography variant="heading-200">{localisationStrings.toastSuccessTitle}</Typography>
              <Typography variant="body-regular">{localisationStrings.toastSuccessMessage}</Typography>
            </section>
          ),
          timeout: 5000
        },
        'logsDeleted'
      );
    });

    deleteLogs$.errors().once(() => {
      setNotification({ show: true, variant: 'failure' });
      setIsDeleting(false);
      addMessage(
        {
          type: 'danger',
          icon: 'lib_help_error_info_outline',
          content: (
            <section className={locals.toast}>
              <Typography variant="heading-200">{localisationStrings.toastErrorTitle}</Typography>
              <Typography variant="body-regular">{localisationStrings.toastErrorMessage}</Typography>
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
      <Button kind="secondary" onClick={() => closeConfirmationDialog()}>
        {localisationStrings.cancel}
      </Button>
      <Button onClick={handleSubmit} disabled={isDeleteDisabled} kind="danger">
        {localisationStrings.deleteLogs}
      </Button>
    </>
  );

  const LoadingButton = (
    <Button disabled kind="danger" className={locals.loadingButton}>
      <SvgIcon color={themes.default.ids.color.option.blue['500']} spinning type="lib_actions_loading" />
      {localisationStrings.deleteLogs}
    </Button>
  );

  return (
    <Dialog title={localisationStrings.deleteLogs} onClose={closeConfirmationDialog}>
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
              hasError={!!dateTimeValidationMessage}
              value={timeInputValue as string}
              onChange={e => setTimeInputValue(e)}
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
        {notification.show && (
          <ModalNotification onClick={() => setNotification({ show: false })} variant={notification.variant} />
        )}
      </section>
      <section className={locals.buttons}>{isDeleting ? LoadingButton : ConfirmationButtons}</section>
    </Dialog>
  );
}

interface DeleteLogsRequest {
  triggeredByUser: string;
  reason: string;
  upToTime: number;
}
export function deleteLogs(params: DeleteLogsRequest) {
  return http<DeleteLogsHistoryResult>({
    method: 'DELETE',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: `/api/logging/logs`,
    queryParams: { ...params }
  });
}
