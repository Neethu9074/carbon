/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { SetStateAction, useState, useEffect } from 'react';

import {
  HorizontalIndicator,
  Link,
  LoadingSkeleton,
  Typography,
  Button,
  Message,
  CarbonModal as Dialog,
  CarbonForm as Form,
  CarbonFormGroup as FormGroup,
  CarbonStack as Stack,
  CarbonTextInput as TextInput,
  CarbonSelect as Select,
  CarbonSelectItem as SelectItem
} from '@instana/components';
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
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import SubViewHeaderComponent from 'in-settings/components/SubViewHeader';
import { getHeader as getCsrfHeader } from 'in-services/security/csrf';
import KpiGridRow from 'in-components/KpiGridRow/KpiGridRow';
import KpiCard from 'in-components/KpiCard/KpiCard';
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

export default function RetentionPeriod() {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isChangingRetention, setIsChangingRetention] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [retentionValue, setRetentionValue] = useState<number | undefined | string>('');
  const progress: Progress = {
    loading: isLoading
  };

  const logActionHref = useObservable(getEntityIdView(securityAndAccessActionLogRetention, ''), []);

  useEffect(() => {
    let timer: NodeJS.Timeout;

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
              <Link external href={analyzeDocs.logsRetention}>
                {localisationStrings.learnMore}
              </Link>
            </Typography>
          </div>
          <Button
            data-testid="change-retention-period-button"
            className={locals.changeRetentionButton}
            onClick={() => setShowConfirmation(true)}
            kind="primary"
          >
            {localisationStrings.changeRetentionPeriod}
          </Button>
        </section>
        <div>
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
        </div>
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
    }
  };

  const closeConfirmationDialog = () => {
    setShowConfirmation(false);
    setIsChangingRetention(false);
  };

  return (
    <Dialog
      open
      className={locals.modalContainer}
      modalHeading={localisationStrings.modalTitle}
      onRequestSubmit={handleSubmit}
      onRequestClose={closeConfirmationDialog}
      primaryButtonText={localisationStrings.changeRetentionPeriod}
      secondaryButtonText={localisationStrings.cancel}
      primaryButtonDisabled={!canSubmit}
    >
      <Form>
        <FormGroup legendText="Form">
          <Stack gap={6}>
            <Typography variant="body-regular">{localisationStrings.retentionDialogDescription}</Typography>
            <Message type="warning" title={localisationStrings.retentionDialogUserInfo} dismissible />
            <Select
              labelText={localisationStrings.logRetentionPeriod}
              id={localisationStrings.logRetentionPeriod}
              value={retentionPeriodInputValue}
              onChange={e => setRetentionPeriodInputValue(e.target.value)}
            >
              {daysDropdownValues.map(val => (
                <SelectItem key={val} value={val} text={`${val} ${localisationStrings.days}`} />
              ))}
            </Select>
            <TextInput
              id={localisationStrings.changeReason}
              autoComplete="off"
              disabled={isChangingRetention}
              value={reasonInputValue}
              invalid={!!reasonValidationMessage}
              invalidText={reasonValidationMessage}
              onChange={e => setReasonInputValue(e.target.value)}
              name="reason"
              labelText={localisationStrings.changeReason}
            />
            <TextInput
              id={localisationStrings.typeToConfirm}
              autoComplete="off"
              disabled={isChangingRetention}
              value={validationInputValue}
              invalid={!!validationValidationMessage}
              invalidText={validationValidationMessage}
              onChange={e => setValidationInputValue(e.target.value)}
              placeholder="CHANGE RETENTION"
              name="typingValidation"
              labelText={localisationStrings.typeToConfirm}
            />
            {notification.show && (
              <ModalNotification
                onClick={() => setNotification({ show: false })}
                variant={notification.variant}
                valueDays={retentionValue}
              />
            )}
          </Stack>
        </FormGroup>
      </Form>
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
