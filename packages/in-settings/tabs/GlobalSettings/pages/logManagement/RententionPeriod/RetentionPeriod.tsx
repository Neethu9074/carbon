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

import {
  retentionLogsGET,
  retentionLogsPOST,
  RetentionLogsRequest
} from 'in-settings/tabs/GlobalSettings/pages/logManagement/RententionPeriod/httpCalls';
import {
  ModalNotification,
  NotificationState
} from 'in-settings/tabs/GlobalSettings/pages/logManagement/RententionPeriod/ModalNotification';
import {
  errorFeedback,
  succesFeedback
} from 'in-settings/tabs/GlobalSettings/pages/logManagement/RententionPeriod/MockHelpers';
import useRetentionPeriodForm from 'in-settings/tabs/GlobalSettings/pages/logManagement/RententionPeriod/useRetentionPeriodForm';
import { localisationStrings } from 'in-settings/tabs/GlobalSettings/pages/logManagement/RententionPeriod/localisationStrings';
import { getRetentionStatus } from 'in-settings/tabs/GlobalSettings/pages/logManagement/RententionPeriod/utils';
import { SETTINGS_LOG_MANAGEMENT_RETENTION_PERIOD_SUBMITTED } from 'in-services/tracking/eventNames';
import { securityAndAccessActionLogRetention } from 'in-settings/navigation/paths';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import { analyzeDocs } from 'in-analyze/components/AnalyzeHeader/constants';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import KpiGridRow from 'in-components/KpiGridRow/KpiGridRow';
import KpiCard from 'in-components/KpiCard/KpiCard';
import { role } from 'in-stores/user';

import locals from './RetentionPeriod.mless';

export default function RetentionPeriod() {
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [isChangingRetention, setIsChangingRetention] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [retentionValue, setRetentionValue] = useState<number | string | undefined>('');

  const { createHrefToPath } = useNavigation();

  useEffect(() => {
    const fetchRetentionPeriod$ = retentionLogsGET();

    fetchRetentionPeriod$.once(response => {
      setRetentionValue(response.body.retentionDays);
      setIsLoading(false);
    });

    fetchRetentionPeriod$.errors().once(() => {
      errorFeedback(
        setIsChangingRetention,
        locals,
        localisationStrings.toastTitleFailedInGet,
        localisationStrings.toastMessageFailedInGet,
        localisationStrings.contactSupport
      );
    });
  }, []);

  const renderRetentionKPI = () => (
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
  );

  const renderLoadingState = () => (
    <>
      <HorizontalIndicator className={locals.loadingIndicator} progress={{ loading: true }} />
      <LoadingSkeleton className={locals.skeleton} />
    </>
  );

  const renderHistorySection = () =>
    role?.canViewAuditLog && (
      <section className={locals.typo}>
        <Typography variant="body-regular">{localisationStrings.historyChanges} </Typography>
        <Link href={createHrefToPath(securityAndAccessActionLogRetention)}>{localisationStrings.actionLog} </Link>
        <Typography variant="body-regular">{localisationStrings.historyChanges2}</Typography>
      </section>
    );

  return (
    <>
      <section className={locals.detailPageSection}>
        <section className={locals.titleSection}>
          <Typography variant="body-regular">
            {localisationStrings.aboutRetentionPeriod}
            <Link externalWithIcon href={analyzeDocs.logsRetention}>
              {localisationStrings.learnMore}
            </Link>
          </Typography>
          <Button
            data-testid="change-retention-period-button"
            className={locals.changeRetentionButton}
            onClick={() => setShowConfirmationDialog(true)}
            kind="primary"
          >
            {localisationStrings.changeRetentionPeriod}
          </Button>
        </section>

        <div>{isLoading ? renderLoadingState() : renderRetentionKPI()}</div>

        {renderHistorySection()}
      </section>

      {showConfirmationDialog && (
        <RetentionPeriodDialog
          setShowConfirmation={setShowConfirmationDialog}
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
  const [hasRetentionChangeSucceeded, setHasRetentionChangeSucceeded] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (hasRetentionChangeSucceeded) {
      timeout = setTimeout(() => {
        setHasRetentionChangeSucceeded(false);
      }, 3000);
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [hasRetentionChangeSucceeded]);

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

  const handleSuccess = () => {
    succesFeedback(setIsChangingRetention, locals, localisationStrings.toastTitleSuccesful, setNotification);
    setRetentionValue(+retentionPeriodInputValue);
    setHasRetentionChangeSucceeded(true);
    resetForm();
  };

  const handleError = () => {
    errorFeedback(
      setIsChangingRetention,
      locals,
      localisationStrings.toastTitleFailed,
      localisationStrings.toastMessageFailed,
      localisationStrings.contactSupport,
      setNotification
    );
  };

  const handleSubmit = async () => {
    setSubmitted(true);

    if (!canSubmit) return;

    const queryParams: RetentionLogsRequest = {
      reasonForChange: reasonInputValue,
      retentionDays: +retentionPeriodInputValue
    };

    trackCta(SETTINGS_LOG_MANAGEMENT_RETENTION_PERIOD_SUBMITTED, queryParams);
    setSubmitted(false);
    setIsChangingRetention(true);

    const postRetentionLogs$ = retentionLogsPOST(queryParams);

    postRetentionLogs$.once(handleSuccess);
    postRetentionLogs$.errors().once(handleError);
  };

  const closeConfirmationDialog = () => {
    setShowConfirmation(false);
    setIsChangingRetention(false);
  };

  const { loadingStatus, loadingDescription } = getRetentionStatus({
    isChangingRetention,
    hasRetentionChangeSucceeded
  });

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
      loadingStatus={loadingStatus}
      loadingDescription={loadingDescription}
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
