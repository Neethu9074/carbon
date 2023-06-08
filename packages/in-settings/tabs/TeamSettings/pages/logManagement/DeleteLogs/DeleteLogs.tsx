/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useState } from 'react';

import { Button, SvgIcon, Typography } from '@instana/components';

import { ModalNotification } from 'in-settings/tabs/TeamSettings/pages/logManagement/DeleteLogs/ModalNotification';
import { DeletionTable } from 'in-settings/tabs/TeamSettings/pages/logManagement/DeleteLogs/DeletionTable';
import { NotificationState } from 'in-settings/tabs/TeamSettings/pages/logManagement/DeleteLogs/types';
import SettingsDetailPage from 'in-settings/components/SettingsDetailPage';
import SubViewHeader from 'in-settings/components/SubViewHeader';
import Dialog from 'in-components/Dialog/Dialog';
import Input from 'in-components/form/Input';
import Label from 'in-components/form/Label';
import Title from 'in-components/Title';
import theme from 'in-themes';
import { t } from 'in-i18n';

import locals from './DeleteLogs.mless';

export default function DeleteLogs() {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [validationInputValue, setValidationInputValue] = useState('');
  const [reasonInputValue, setReasonInputvalue] = useState('');
  const [notification, setNotification] = useState<NotificationState>({ show: false });
  const closeConfirmationDialog = () => setShowConfirmation(false);
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
    setNotification({ show: false });
    setReasonInputvalue('');
    setValidationInputValue('');
    setIsDeleting(true);
    //mock request
    setTimeout(() => {
      setNotification({ show: true, variant: 'success' });
      setIsDeleting(false);
    }, 5000);
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
    <Button kind="danger" className={locals.loadingButton}>
      <SvgIcon color={theme.lib.colors.lightBlue800} spinning type="lib_actions_loading" />
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
            onChange={e => setReasonInputvalue(e.target.value)}
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
          <DeletionTable />
        </main>
      </SettingsDetailPage>
      {showConfirmation && ConfirmationDialog}
    </>
  );
}
