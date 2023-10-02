/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useState } from 'react';

import { DeleteLogsHistoryResult } from '@instana/types/typeDefinitions';
import { Button, SvgIcon, Typography } from '@instana/components';
import { useObservable } from '@instana/hooks';

import { ModalNotification } from 'in-settings/tabs/TeamSettings/pages/logManagement/DeleteLogs/ModalNotification';
import { DeletionTable } from 'in-settings/tabs/TeamSettings/pages/logManagement/DeleteLogs/DeletionTable';
import { NotificationState } from 'in-settings/tabs/TeamSettings/pages/logManagement/DeleteLogs/types';
import getDeleteLogsHistory from 'in-logging/subscriptions/getDeleteLogsHistory';
import SettingsDetailPage from 'in-settings/components/SettingsDetailPage';
import { getHeader as getCsrfHeader } from 'in-services/security/csrf';
import SubViewHeader from 'in-settings/components/SubViewHeader';
import Dialog from 'in-components/Dialog/Dialog';
import Input from 'in-components/form/Input';
import Label from 'in-components/form/Label';
import Title from 'in-components/Title';
import { user } from 'in-stores/user';
import { useTheme } from 'in-themes';
import http from 'in-services/http';
import { t } from 'in-i18n';

import locals from './DeleteLogs.mless';

export default function DeleteLogs() {
  const theme = useTheme();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [validationInputValue, setValidationInputValue] = useState('');
  const [reasonInputValue, setReasonInputValue] = useState('');
  const [notification, setNotification] = useState<NotificationState>({ show: false });

  const deletionHistory = useObservable(() => getDeleteLogsHistory(null), [isDeleting]);

  const closeConfirmationDialog = () => {
    setShowConfirmation(false);
    setNotification({ show: false });
  };
  const openConfirmationDialog = () => setShowConfirmation(true);

  const localisationStrings = {
    deletionReason: t('in-settings:tabs.deleteLogs.deletionReason'),
    typeValidation: t('in-settings:tabs.deleteLogs.typeToContinue', { logs: t('in-settings:tabs.deleteLogs.logs') }),
    typePlaceholder: t('in-settings:tabs.deleteLogs.logs'),
    info: t('in-settings:tabs.deleteLogs.info'),
    confirmationDescription: t('in-settings:tabs.deleteLogs.confirmationDescription'),
    logs: t('in-settings:tabs.deleteLogs.logs'),
    deletionInfo: t('in-settings:tabs.deleteLogs.deletionInfo'),
    cancel: t('in-settings:tabs.cancel'),
    deleteLogs: t('in-settings:tabs.deleteLogs.deleteLogs')
  };

  const notConfirmed = validationInputValue !== localisationStrings.logs;
  const noReason = reasonInputValue === '';
  const isDeleteDisabled = notConfirmed || noReason;

  const handleSubmit = () => {
    const deleteLogs$ = deleteLogs({ reason: reasonInputValue, triggeredByUser: user?.email!, upToTime: Date.now() });

    setIsDeleting(true);
    setReasonInputValue('');
    setValidationInputValue('');

    deleteLogs$.once(() => {
      setNotification({ show: true, variant: 'success' });
      setIsDeleting(false);
    });

    deleteLogs$.errors().once(() => {
      setNotification({ show: true, variant: 'failure' });
      setIsDeleting(false);
    });
  };

  const ConfirmationButtons = (
    <>
      <Button kind="subtle">{localisationStrings.cancel}</Button>
      <Button onClick={handleSubmit} disabled={isDeleteDisabled} kind="danger">
        {localisationStrings.deleteLogs}
      </Button>
    </>
  );

  const LoadingButton = (
    <Button disabled kind="danger" className={locals.loadingButton}>
      <SvgIcon color={theme.ids.color.option.blue['500']} spinning type="lib_actions_loading" />
      {localisationStrings.deleteLogs}
    </Button>
  );

  const ConfirmationDialog = (
    <Dialog title={localisationStrings.deleteLogs} onClose={closeConfirmationDialog}>
      <section className={locals.confirmationDialogContent}>
        <Typography variant="body-regular">{localisationStrings.confirmationDescription}</Typography>
        <Label htmlFor="reason">
          {localisationStrings.deletionReason}
          <Input
            value={reasonInputValue}
            onChange={e => setReasonInputValue(e.target.value)}
            disabled={isDeleting}
            name="reason"
          />
        </Label>
        <Label htmlFor="typingValidation">
          {localisationStrings.typeValidation}
          <Input
            disabled={isDeleting}
            value={validationInputValue}
            onChange={e => setValidationInputValue(e.target.value)}
            placeholder={localisationStrings.typePlaceholder}
            name="typingValidation"
          />
        </Label>
        {isDeleting && <Typography variant={'body-small'}>{localisationStrings.deletionInfo}</Typography>}
        {notification.show && (
          <ModalNotification onClick={() => setNotification({ show: false })} variant={notification.variant} />
        )}
      </section>
      <section className={locals.buttons}>{isDeleting ? LoadingButton : ConfirmationButtons}</section>
    </Dialog>
  );

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
          <DeletionTable errors={deletionHistory?.errors} data={deletionHistory?.data?.deletions} />
        </main>
      </SettingsDetailPage>
      {showConfirmation && ConfirmationDialog}
    </>
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
