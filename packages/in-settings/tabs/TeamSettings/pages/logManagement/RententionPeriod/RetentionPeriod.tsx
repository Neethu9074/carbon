/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { SetStateAction, useState } from 'react';

import { Button, Card, Input, Link, Typography } from '@instana/components';
import { useObservable } from '@instana/hooks';

import useRetentionPeriodForm from 'in-settings/tabs/TeamSettings/pages/logManagement/RententionPeriod/useRetentionPeriodForm';
// eslint-disable-next-line no-restricted-imports
import { ModalNotification, NotificationState } from './ModalNotification';
import { getEntityIdView, teamSettingsActionLog } from 'in-settings/navigation/paths';
import ValidationBlock from 'in-components/form/ValidationBlock/ValidationBlock';
import SettingsDetailPage from 'in-settings/components/SettingsDetailPage';
import SubViewHeaderComponent from 'in-settings/components/SubViewHeader';
import { addMessage } from 'in-components/MessageFlyout/stores/messages';
import { getHeader as getCsrfHeader } from 'in-services/security/csrf';
import Select from 'in-components/form/Select/Select';
import Label from 'in-components/form/Label/Label';
import Dialog from 'in-components/Dialog/Dialog';
import Title from 'in-components/Title/Title';
import http from 'in-services/http/http';
import { t } from 'in-i18n';

import locals from './RetentionPeriod.mless';

const localisationStrings = {
  retentionPeriod: t('in-settings:tabs.retentionPeriod.retentionPeriod'),
  currentRetentionPeriod: t('in-settings:tabs.retentionPeriod.currentRetentionPeriod'),
  retentionDialogDescription: t('in-settings:tabs.retentionPeriod.retentionDialogDescription'),
  changeRetentionPeriod: t('in-settings:tabs.retentionPeriod.changeRetentionPeriod'),
  logRetentionPeriod: t('in-settings:tabs.retentionPeriod.logRetentionPeriod'),
  changeReason: t('in-settings:tabs.retentionPeriod.changeReason'),
  days: t('in-settings:tabs.retentionPeriod.days'),
  cancel: t('in-settings:tabs.cancel'),
  historyChanges: t('in-settings:tabs.retentionPeriod.historyChanges'),
  logAction: t('in-settings:tabs.retentionPeriod.logAction'),
  historyChanges2: t('in-settings:tabs.retentionPeriod.historyChanges2'),
  typeToConfirm: t('in-settings:tabs.retentionPeriod.typeToConfirm'),
  changeError: t('in-settings:tabs.retentionPeriod.changeError'),
  changeSuccess: t('in-settings:tabs.retentionPeriod.changeSuccess'),
  toastTitleSuccesful: t('in-settings:tabs.retentionPeriod.toastTitleSuccesful'),
  toastMessageSuccesful: t('in-settings:tabs.retentionPeriod.toastMessageSuccesful'),
  toastTitleFailed: t('in-settings:tabs.retentionPeriod.toastTitleFailed'),
  toastMessageFailed: t('in-settings:tabs.retentionPeriod.toastMessageFailed')
};

export default function RententionPeriod() {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isChangingRetention, setIsChangingRetention] = useState(false);
  const [retentionValue, setRetentionValue] = useState<number | undefined>(() => {
    const getRetentionPeriod$ = retentionLogsGET();
    let initialValue: number | undefined;

    getRetentionPeriod$.once(data => {
      // console.log('Value Endpoint', data);
      initialValue = data.body.retention;
      setRetentionValue(data.body.retention);
    });

    return initialValue ?? 5;
  });

  const logActionHref = useObservable(getEntityIdView(teamSettingsActionLog, ''), []);

  return (
    <>
      <SettingsDetailPage>
        <Title title={localisationStrings.retentionPeriod} />
        <section className={locals.titleSection}>
          <SubViewHeaderComponent>{localisationStrings.retentionPeriod}</SubViewHeaderComponent>
          <Button onClick={() => setShowConfirmation(true)} kind="danger">
            Change retention period
          </Button>
        </section>
        <main>
          <Card className={locals.card}>
            <div className={locals.title}>
              <span>{localisationStrings.currentRetentionPeriod}</span>
            </div>
            <div className={locals.body}>
              <p>
                <span className={locals.number}>{retentionValue}</span> {localisationStrings.days}
              </p>
            </div>
          </Card>
          <section className={locals.typo}>
            <Typography variant={'body-regular'}>{localisationStrings.historyChanges + ' '}</Typography>
            <Link href={logActionHref || ''}>{localisationStrings.logAction + ' '}</Link>
            <Typography variant={'body-regular'}>{localisationStrings.historyChanges2}</Typography>
          </section>
        </main>
      </SettingsDetailPage>
      {showConfirmation && (
        <RetentionPeriodDialog
          setShowConfirmation={setShowConfirmation}
          setIsChangingRetention={setIsChangingRetention}
          isChangingRetention={isChangingRetention}
          setRentionValue={setRetentionValue}
        />
      )}
    </>
  );
}

interface RetentionPeriodDialogProps {
  setShowConfirmation: React.Dispatch<React.SetStateAction<boolean>>;
  setIsChangingRetention: React.Dispatch<SetStateAction<boolean>>;
  isChangingRetention: boolean;
  setRentionValue: React.Dispatch<React.SetStateAction<number | undefined>>;
}

function RetentionPeriodDialog({
  setShowConfirmation,
  setIsChangingRetention,
  isChangingRetention,
  setRentionValue
}: RetentionPeriodDialogProps) {
  // const [daysDropdownValue, setDaysDropdownValue] = useState('0')
  const [notification, setNotification] = useState<NotificationState>({ show: false });

  const daysDropdownValues = ['7', '20', '30', '60', '90'];

  const {
    reasonInputValue,
    validationInputValue,
    retentionPeriodInputValue,
    setValidationInputValue,
    setRetentionPeriodInputValue,
    setReasonInputValue,
    setSubmitted,
    validationValidationMessage,
    reasonValidationMessage,
    canSubmit,
    resetForm
  } = useRetentionPeriodForm();

  const handleSubmit = () => {
    setSubmitted(true);

    const queryParams: RetentionLogsRequest = {
      reason: reasonInputValue,
      retention: parseInt(retentionPeriodInputValue)
    };
    const postRetentionLogs$ = retentionLogsPOST(queryParams);

    postRetentionLogs$.once(_ => {
      //200
      setNotification({ show: true, variant: 'success' });
      setIsChangingRetention(false);
      addMessage(
        {
          type: 'info',
          icon: 'lib_help_error_info_outline',
          content: (
            <section className={locals.toast}>
              <Typography variant="heading-200">{localisationStrings.toastTitleSuccesful}</Typography>
              <Typography variant="body-regular">{localisationStrings.toastMessageSuccesful}</Typography>
            </section>
          ),
          timeout: 5000
        },
        'logsRetentionChanged'
      );
    });

    postRetentionLogs$.errors().once(_ => {
      //400
      setNotification({ show: true, variant: 'failure' });
      setIsChangingRetention(false);
      addMessage(
        {
          type: 'danger',
          icon: 'lib_help_error_info_outline',
          content: (
            <section className={locals.toast}>
              <Typography variant="heading-200">{localisationStrings.toastTitleFailed}</Typography>
              <Typography variant="body-regular">{localisationStrings.toastMessageFailed}</Typography>
            </section>
          ),
          timeout: 5000
        },
        'logsRetentionChanged'
      );
    });
    if (canSubmit) {
      setRentionValue(validationInputValue);
      resetForm();
    }
  };

  const ConfirmationButtons = (
    <>
      <Button kind="secondary" onClick={() => closeConfirmationDialog()}>
        {localisationStrings.cancel}
      </Button>
      <Button onClick={handleSubmit} kind="danger">
        {localisationStrings.changeRetentionPeriod}
      </Button>
    </>
  );

  const closeConfirmationDialog = () => {
    setShowConfirmation(false);
    setIsChangingRetention(false);
  };

  return (
    <Dialog title="Change log retention period" onClose={closeConfirmationDialog}>
      <section className={locals.confirmationDialogContent}>
        <Typography variant="body-regular">{localisationStrings.retentionDialogDescription}</Typography>
        <Label htmlFor="LogRetentionPeriod">
          {localisationStrings.logRetentionPeriod}
          <Select value={retentionPeriodInputValue} onChange={e => setRetentionPeriodInputValue(e.target.value)}>
            {daysDropdownValues.map(val => (
              <option value={val}>{`${val} days`}</option>
            ))}
          </Select>
        </Label>
        <Label htmlFor="reason">
          {localisationStrings.changeReason}
          <Input
            disabled={isChangingRetention}
            value={reasonInputValue}
            hasError={!!reasonValidationMessage}
            onChange={e => setReasonInputValue(e.target.value)}
            name="reason"
          />
          {reasonValidationMessage && <ValidationBlock>{reasonValidationMessage}</ValidationBlock>}
        </Label>
        <Label htmlFor="typingValidation">
          {localisationStrings.typeToConfirm}
          <Input
            disabled={isChangingRetention}
            value={validationInputValue}
            hasError={!!validationValidationMessage}
            onChange={e => setValidationInputValue(e.target.value)}
            name="typingValidation"
          />
          {validationValidationMessage && <ValidationBlock>{validationValidationMessage}</ValidationBlock>}
        </Label>
        <ModalNotification onClick={() => setNotification({ show: false })} variant={notification.variant} />
      </section>
      <section className={locals.buttons}>{ConfirmationButtons}</section>
    </Dialog>
  );
}

interface RetentionLogsRequest {
  retention: number;
  reason: string;
}

export function retentionLogsPOST(params: RetentionLogsRequest) {
  return http<any>({
    //I'd love to type the response, we have it completly? I'd like to see it in live.
    method: 'POST',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: `/api/logging/retention/v1`,
    queryParams: { ...params }
  });
}

export function retentionLogsGET() {
  return http<any>({
    //I'd love to type the response, we have it completly? I'd like to see it in live.
    method: 'GET',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: `/api/logging/retention/v1`
  });
}
