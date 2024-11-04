/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { SetStateAction, useState, useEffect } from 'react';

import { HorizontalIndicator, Input, Link, LoadingSkeleton, Typography, Button, Message } from '@instana/components';
import { useObservable } from '@instana/hooks';
import { Progress } from '@instana/types';

import {
  errorFeedback,
  succesFeedback
} from 'in-settings/tabs/GlobalSettings/pages/logManagement/RententionPeriod/MockHelpers';
import useRetentionPeriodForm from 'in-settings/tabs/GlobalSettings/pages/logManagement/RententionPeriod/useRetentionPeriodForm';
// eslint-disable-next-line no-restricted-imports
import { analyzeDocs } from 'in-analyze/components/AnalyzeHeader/constants';
// eslint-disable-next-line no-restricted-imports
import { ModalNotification, NotificationState } from './ModalNotification';
import { SETTINGS_LOG_MANAGEMENT_RETENTION_PERIOD_SUBMITTED } from 'in-services/tracking/eventNames';
import { getEntityIdView, securityAndAccessActionLogRetention } from 'in-settings/navigation/paths';
import ValidationBlock from 'in-components/form/ValidationBlock/ValidationBlock';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import SubViewHeaderComponent from 'in-settings/components/SubViewHeader';
import { getHeader as getCsrfHeader } from 'in-services/security/csrf';
import KpiGridRow from 'in-components/KpiGridRow/KpiGridRow';
import Select from 'in-components/form/Select/Select';
import KpiCard from 'in-components/KpiCard/KpiCard';
import Label from 'in-components/form/Label/Label';
import Dialog from 'in-components/Dialog/Dialog';
import Title from 'in-components/Title/Title';
import http from 'in-services/http/http';
import { role } from 'in-stores/user';
import { t } from 'in-i18n';

import locals from './RetentionPeriod.mless';

const localisationStrings = {
  retentionPeriod: t('in-settings:tabs.retentionPeriod.retentionPeriod'),
  aboutRetentionPeriod: t('in-settings:tabs.retentionPeriod.aboutRetentionPeriod'),
  currentRetentionPeriod: t('in-settings:tabs.retentionPeriod.currentRetentionPeriod'),
  retentionDialogDescription: t('in-settings:tabs.retentionPeriod.retentionDialogDescription'),
  retentionDialogUserInfo: t('in-settings:tabs.retentionPeriod.retentionDialogUserInfo'),
  changeRetentionPeriod: t('in-settings:tabs.retentionPeriod.changeRetentionPeriod'),
  logRetentionPeriod: t('in-settings:tabs.retentionPeriod.logRetentionPeriod'),
  changeReason: t('in-settings:tabs.retentionPeriod.changeReason'),
  days: t('in-settings:tabs.retentionPeriod.days'),
  learnMore: t('in-settings:tabs.retentionPeriod.learnMore'),
  cancel: t('in-settings:tabs.cancel'),
  historyChanges: t('in-settings:tabs.retentionPeriod.historyChanges'),
  actionLog: t('in-settings:tabs.retentionPeriod.actionLog'),
  historyChanges2: t('in-settings:tabs.retentionPeriod.historyChanges2'),
  modalTitle: t('in-settings:tabs.retentionPeriod.modalTitle'),
  typeToConfirm: t('in-settings:tabs.retentionPeriod.typeToConfirm'),
  changeError: t('in-settings:tabs.retentionPeriod.changeError'),
  changeSuccess: t('in-settings:tabs.retentionPeriod.changeSuccess'),
  toastTitleSuccesful: t('in-settings:tabs.retentionPeriod.toastTitleSuccesful'),
  toastTitleFailed: t('in-settings:tabs.retentionPeriod.toastTitleFailed'),
  toastMessageFailed: t('in-settings:tabs.retentionPeriod.toastMessageFailed'),
  contactSupport: t('in-settings:tabs.retentionPeriod.contactSupport'),
  toastTitleFailedInGet: t('in-settings:tabs.retentionPeriod.toastTitleFailedInGet'),
  toastMessageFailedInGet: t('in-settings:tabs.retentionPeriod.toastMessageFailedInGet')
};

const useMock = false; // Activate mock response

export default function RetentionPeriod() {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isChangingRetention, setIsChangingRetention] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [retentionValue, setRetentionValue] = useState<number | undefined | string>(
    useMock ? mockData().retention : 'Loading...'
  );
  const progress: Progress = {
    loading: isLoading
  };

  const logActionHref = useObservable(getEntityIdView(securityAndAccessActionLogRetention, ''), []);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (!useMock) {
      const getRetentionPeriod$ = retentionLogsGET();

      getRetentionPeriod$.once(response => {
        setRetentionValue(response.body.retentionDays);
        setIsLoading(false);
      });
      getRetentionPeriod$.errors().once(_ => {
        errorFeedback(
          setIsChangingRetention,
          locals,
          localisationStrings.toastTitleFailedInGet,
          localisationStrings.toastMessageFailedInGet,
          localisationStrings.contactSupport
        );
      });
    } else {
      timer = setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, []);

  return (
    <>
      <section className={locals.detailPageSection}>
        <Title title={localisationStrings.retentionPeriod} />
        <section className={locals.titleSection}>
          <div>
            <SubViewHeaderComponent>{localisationStrings.retentionPeriod}</SubViewHeaderComponent>
            <Typography variant="body-regular">
              {localisationStrings.aboutRetentionPeriod}
              <Link external href={analyzeDocs.logs}>
                {localisationStrings.learnMore}
              </Link>
            </Typography>
          </div>
          <Button className={locals.changeRetentionButton} onClick={() => setShowConfirmation(true)} kind="primary">
            {localisationStrings.changeRetentionPeriod}
          </Button>
        </section>
        <main>
          {!isLoading ? (
            <KpiGridRow sizes={[3]}>
              <KpiCard title={localisationStrings.currentRetentionPeriod}>
                <div className={locals.body}>
                  <p className={locals.retentionContent}>
                    <span data-testid="retentionValue" className={locals.number}>
                      {retentionValue}
                    </span>
                    {localisationStrings.days}
                  </p>
                </div>
              </KpiCard>
            </KpiGridRow>
          ) : (
            <>
              <HorizontalIndicator className={locals.loadingIndicator} progress={progress} />
              <LoadingSkeleton className={locals.skeleton} />
            </>
          )}
          {role?.canViewAuditLog && (
            <section className={locals.typo}>
              <Typography data-testid="" variant={'body-regular'}>
                {localisationStrings.historyChanges + ' '}
              </Typography>
              <Link href={logActionHref || ''}>{localisationStrings.actionLog + ' '}</Link>
              <Typography variant={'body-regular'}>{localisationStrings.historyChanges2}</Typography>
            </section>
          )}
        </main>
      </section>
      {showConfirmation && (
        <RetentionPeriodDialog
          setShowConfirmation={setShowConfirmation}
          setIsChangingRetention={setIsChangingRetention}
          isChangingRetention={isChangingRetention}
          setRetentionValue={setRetentionValue}
          retentionValue={retentionValue}
        />
      )}
    </>
  );
}

interface RetentionPeriodDialogProps {
  setShowConfirmation: React.Dispatch<React.SetStateAction<boolean>>;
  setIsChangingRetention: React.Dispatch<SetStateAction<boolean>>;
  isChangingRetention: boolean;
  setRetentionValue: React.Dispatch<React.SetStateAction<number | undefined | string>>;
  retentionValue: number | undefined | string;
}

function RetentionPeriodDialog({
  setShowConfirmation,
  setIsChangingRetention,
  isChangingRetention,
  setRetentionValue,
  retentionValue
}: RetentionPeriodDialogProps) {
  const [notification, setNotification] = useState<NotificationState>({ show: false });
  const { trackCta } = useSegmentTracking();
  const handlePostRequest = async (payload: RetentionLogsRequest) => {
    await new Promise(resolve => setTimeout(resolve, 1000));

    //We can modify this to make any test case
    if (!payload.reasonForChange || ![30, 60, 90].includes(payload.retentionDays)) {
      return 400;
    }

    return 200;
  };

  const daysDropdownValues = [30, 60, 90];

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

  const handleSubmit = async () => {
    setSubmitted(true);
    const queryParams: RetentionLogsRequest = {
      reasonForChange: reasonInputValue,
      retentionDays: +retentionPeriodInputValue
    };

    if (canSubmit) {
      trackCta(SETTINGS_LOG_MANAGEMENT_RETENTION_PERIOD_SUBMITTED, queryParams);
      setSubmitted(false);
      setRetentionValue(+retentionPeriodInputValue);
      resetForm();

      if (!useMock) {
        const postRetentionLogs$ = retentionLogsPOST(queryParams);

        postRetentionLogs$.once(_ =>
          succesFeedback(setIsChangingRetention, locals, localisationStrings.toastTitleSuccesful, setNotification)
        );

        postRetentionLogs$
          .errors()
          .once(_ =>
            errorFeedback(
              setIsChangingRetention,
              locals,
              localisationStrings.toastTitleFailed,
              localisationStrings.toastMessageFailed,
              localisationStrings.contactSupport,
              setNotification
            )
          );
      } else {
        // MOCK POST
        const postRetentionStatusNumber = await handlePostRequest(queryParams);

        if (postRetentionStatusNumber === 200) {
          succesFeedback(setIsChangingRetention, locals, localisationStrings.toastTitleSuccesful, setNotification);
        } else {
          errorFeedback(
            setIsChangingRetention,
            locals,
            localisationStrings.toastTitleFailed,
            localisationStrings.toastMessageFailed,
            localisationStrings.contactSupport,
            setNotification
          );
        }
      }
    }
  };

  const ConfirmationButtons = (
    <>
      <Button
        data-testid="changeRetentionCancelButton"
        className={locals.changeRetentionButton}
        kind="secondary"
        onClick={() => closeConfirmationDialog()}
      >
        {localisationStrings.cancel}
      </Button>
      <Button
        data-testid="changeRetentionConfirmButton"
        className={locals.changeRetentionButton}
        onClick={handleSubmit}
        kind="primary"
      >
        {localisationStrings.changeRetentionPeriod}
      </Button>
    </>
  );

  const closeConfirmationDialog = () => {
    setShowConfirmation(false);
    setIsChangingRetention(false);
  };

  return (
    <Dialog className={locals.modalTitle} title={localisationStrings.modalTitle} onClose={closeConfirmationDialog}>
      <section className={locals.confirmationDialogContent} data-testid="logRetentionDialog">
        <Typography variant="body-regular">{localisationStrings.retentionDialogDescription}</Typography>
        <Message type="warning" title={localisationStrings.retentionDialogUserInfo} dismissible />
        <Label htmlFor="LogRetentionPeriod">
          {localisationStrings.logRetentionPeriod}
          <Select value={retentionPeriodInputValue} onChange={e => setRetentionPeriodInputValue(e.target.value)}>
            {daysDropdownValues.map(val => (
              <option key={val} value={val}>{`${val} ${localisationStrings.days}`}</option>
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
          {reasonValidationMessage && (
            <ValidationBlock className={locals.validationMessage}>{reasonValidationMessage}</ValidationBlock>
          )}
        </Label>
        <Label htmlFor="typingValidation">
          {localisationStrings.typeToConfirm}
          <Input
            autoComplete="off"
            disabled={isChangingRetention}
            value={validationInputValue}
            hasError={!!validationValidationMessage}
            onChange={e => setValidationInputValue(e.target.value)}
            name="typingValidation"
          />
          {validationValidationMessage && (
            <ValidationBlock className={locals.validationMessage}>{validationValidationMessage}</ValidationBlock>
          )}
        </Label>
        {notification.show && (
          <ModalNotification
            onClick={() => setNotification({ show: false })}
            variant={notification.variant}
            valueDays={retentionValue}
          />
        )}
      </section>
      <section className={locals.buttons}>{ConfirmationButtons}</section>
    </Dialog>
  );
}

interface RetentionLogsRequest {
  retentionDays: number;
  reasonForChange: string;
}

interface RetentionLogsResponse {
  retentionDays: number;
}

export function retentionLogsPOST(params: RetentionLogsRequest) {
  return http<void>({
    method: 'POST',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: `/api/logging/retention/v1`,
    data: { ...params }
  });
}

export function retentionLogsGET() {
  return http<RetentionLogsResponse>({
    method: 'GET',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: `/api/logging/retention/v1`
  });
}

function mockData() {
  return {
    retention: 5
  };
}
