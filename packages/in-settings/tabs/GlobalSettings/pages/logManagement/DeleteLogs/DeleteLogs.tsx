/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

// eslint-disable-next-line no-restricted-imports
import { ProgressIndicator, ProgressStep } from '@carbon/react';
import React, { SetStateAction, useEffect, useState } from 'react';

import {
  CarbonForm,
  CarbonFormGroup,
  CarbonModal,
  CarbonStack,
  CarbonTextInput,
  DateInput as CarbonDateInput,
  ValidationBlock
} from '@instana/components';
import { Card, Link, Typography } from '@instana/components';
import { Tearsheet } from '@instana/ibm-products';

// eslint-disable-next-line no-restricted-imports
import {
  SETTINGS_LOG_MANAGEMENT_DELETE_LOGS_CLICKED,
  SETTINGS_LOG_MANAGEMENT_DELETE_LOGS_ERROR,
  SETTINGS_LOG_MANAGEMENT_DELETE_LOGS_SUBMITTED,
  SETTINGS_LOG_MANAGEMENT_DELETE_LOGS_SUCCESS
} from 'in-services/tracking/tracking';
import { deleteLogsLocalisationStrings } from 'in-settings/tabs/GlobalSettings/pages/logManagement/DeleteLogs/localisationStrings';
// eslint-disable-next-line no-restricted-imports
import { ConfirmSelectionPage } from './Modal/TabPages/ConfirmSelectionPage';
// eslint-disable-next-line no-restricted-imports
import { analyzeDocs } from 'in-analyze/components/AnalyzeHeader/constants';
// eslint-disable-next-line no-restricted-imports
import { addSecondsIfValidFormat, DeleteLogsRequest } from './utils';
// eslint-disable-next-line no-restricted-imports
import { returnNumberLogsToDeleteMock } from './Modal/mockBackEnd';
// eslint-disable-next-line no-restricted-imports
import { SelectLogsPage } from './Modal/TabPages/SelectLogsPage';
// eslint-disable-next-line no-restricted-imports
import { ModalNotification } from './Modal/ModalNotification';
import { DeletionTable } from 'in-settings/tabs/GlobalSettings/pages/logManagement/DeleteLogs/DeletionTable';
// eslint-disable-next-line no-restricted-imports
import useDeleteLogsForm from './Modal/useDeleteLogsForm';
// eslint-disable-next-line no-restricted-imports
import { NotificationState } from './types';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import { addMessage } from 'in-components/MessageFlyout/stores/messages';
import TimePicker from 'in-components/form/TimePicker/TimePicker';
import SubViewHeader from 'in-settings/components/SubViewHeader';
import { deleteLogsV3Enabled } from 'in-services/featureFlags';
import { parseDateTime } from 'in-services/formatters/date';
import { deleteLogs } from 'in-logging/api/deleteLogs';
import Title from 'in-components/Title/Title';
import Label from 'in-components/form/Label';
import { activeLocale } from 'in-i18n';
import { user } from 'in-stores/user';

import locals from './DeleteLogs.mless';

export const useMock = true;
const forceError = false;

export default function DeleteLogs() {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [notification, setNotification] = useState<NotificationState>({ show: false });
  const [retryCount, setRetryCount] = useState(0);

  const { canSubmit, canGoNextStep, setInputValues, inputValues, validationMessages, resetForm, touchForm } =
    useDeleteLogsForm();

  useEffect(() => {
    setLogsToDeleteValue(returnNumberLogsToDeleteMock(inputValues.startDate, inputValues.endDate));
  }, [inputValues.startDate, inputValues.endDate]);

  const { trackCta } = useSegmentTracking();
  const openConfirmationDialog = () => {
    trackCta(SETTINGS_LOG_MANAGEMENT_DELETE_LOGS_CLICKED);
    setShowConfirmation(true);
  };

  const [logsToDeleteValue, setLogsToDeleteValue] = useState<number | undefined | string>(
    useMock ? returnNumberLogsToDeleteMock(inputValues.startDate, inputValues.endDate) : undefined
  );

  const closeConfirmationDialog = () => {
    setShowConfirmation(false);
    setNotification({ show: false });
    resetForm();
  };

  const isDeleteDisabled = !canSubmit || isDeleting;

  const handleSubmit = () => {
    if (!useMock) {
      if (isDeleteDisabled) {
        touchForm();
        return;
      }

      const newTimeInputValue = addSecondsIfValidFormat(inputValues.endTime as string);
      const entity: DeleteLogsRequest = {
        reason: inputValues.reason,
        triggeredByUser: user?.email!,
        upToTime: parseDateTime(String(`${inputValues.endDate} ${newTimeInputValue}`)).getTime()
      };

      const deleteLogs$ = deleteLogs(entity);
      entity.retryCount = retryCount;
      entity.upToTimeDateFormat = `${inputValues.endDate} ${newTimeInputValue}`;
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
    } else {
      //DELETE LOGS MOCK
      if (forceError) {
        setNotification({ show: true, variant: 'error' });
        addMessage(
          {
            type: 'danger',
            icon: 'lib_help_error_warning_outline',
            content: (
              <section data-testid="logDeletionErrorToast" className={locals.toast}>
                <Typography variant="heading-200">{deleteLogsLocalisationStrings.toastErrorTitle}</Typography>
                <Typography variant="body-regular">{deleteLogsLocalisationStrings.toastErrorMessage}</Typography>
              </section>
            ),
            timeout: 5000
          },
          'logsDeleted'
        );
      } else {
        setNotification({ show: true, variant: 'success' });
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
      }
    }
  };

  const renderTabPanels = () => {
    switch (currentStep) {
      case 0:
        return (
          <SelectLogsPage
            numberLogsValue={logsToDeleteValue}
            setInputValues={setInputValues}
            inputValues={inputValues}
            canGoNextStep={canGoNextStep}
            validationMessages={validationMessages}
          />
        );
      case 1:
        return (
          <ConfirmSelectionPage
            numberLogsValue={logsToDeleteValue}
            setInputValues={setInputValues}
            inputValues={inputValues}
            validationMessages={validationMessages}
            isDeleting={isDeleting}
            notification={notification}
          />
        );
      default:
        return null;
    }
  };

  const stepArray = [deleteLogsLocalisationStrings.selectLogs, deleteLogsLocalisationStrings.confirmSelection];
  const labelButtons = [
    deleteLogsLocalisationStrings.deleteButton,
    deleteLogsLocalisationStrings.nextButton,
    deleteLogsLocalisationStrings.backButton
  ];

  const isDeleteButton = currentStep === stepArray.length - 1;

  const actionButtons = [
    {
      kind: isDeleteButton ? 'danger' : 'primary',
      label: isDeleteButton ? labelButtons[0] : labelButtons[1],
      iconDescription: isDeleteButton ? labelButtons[0] : labelButtons[1],
      disabled: isDeleteButton ? !canSubmit : !canGoNextStep,
      onClick: () => (isDeleteButton ? handleSubmit() : setCurrentStep(currentStep + 1))
    } as any,
    {
      kind: 'secondary',
      label: labelButtons[2],
      iconDescription: labelButtons[2],
      onClick: () => {
        if (currentStep > 0) {
          setCurrentStep(currentStep - 1);
        }
      },
      disabled: currentStep === 0
    } as any,
    {
      kind: 'ghost',
      label: 'Cancel',
      onClick: () => {
        closeConfirmationDialog();
        setCurrentStep(0);
      }
    }
  ];

  const testNext = (index: number) => {
    return index < currentStep;
  };

  const influencerContent = () => {
    const mapSteps = () => {
      const steps = stepArray.map((step, index) => (
        <ProgressStep
          key={`step-${step}`}
          current={currentStep === index}
          complete={testNext(index)}
          index={index}
          disabled={index > currentStep}
          label={step}
        />
      ));

      return (
        <ProgressIndicator
          style={{ padding: '1.5rem' }}
          currentIndex={currentStep}
          onChange={idx => setCurrentStep(idx)}
          vertical
          spaceEqually
        >
          {steps}
        </ProgressIndicator>
      );
    };

    return mapSteps();
  };
  return (
    <>
      <Title title={deleteLogsLocalisationStrings.deleteLogs} />
      <section className={locals.titleSection}>
        <SubViewHeader>{deleteLogsLocalisationStrings.deleteLogs}</SubViewHeader>
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
        <div>
          <DeletionTable openConfirmationDialog={openConfirmationDialog} isDeleting={isDeleting} />
        </div>
      </Card>

      {showConfirmation &&
        (deleteLogsV3Enabled ? (
          /* @ts-expect-error */
          <Tearsheet
            className={locals.tearsheet}
            open
            influencer={influencerContent()}
            title={deleteLogsLocalisationStrings.deleteLogs}
            label={'Powered by Instana'}
            description={deleteLogsLocalisationStrings.modalDescription}
            actions={actionButtons}
          >
            {renderTabPanels()}
          </Tearsheet>
        ) : (
          <DeleteLogsModal
            setShowConfirmation={setShowConfirmation}
            setIsDeleting={setIsDeleting}
            isDeleting={isDeleting}
            setRetryCount={setRetryCount}
            retryCount={retryCount}
          />
        ))}
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
  const { canSubmit, setInputValues, inputValues, validationMessages, resetForm, touchForm } = useDeleteLogsForm();
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
    const newTimeInputValue = addSecondsIfValidFormat(inputValues.endTime as string);
    const entity: DeleteLogsRequest = {
      reason: inputValues.reason,
      triggeredByUser: user?.email!,
      upToTime: parseDateTime(String(`${inputValues.endDate} ${newTimeInputValue}`)).getTime()
    };

    const deleteLogs$ = deleteLogs(entity);
    entity.retryCount = retryCount;
    entity.upToTimeDateFormat = `${inputValues.endDate} ${newTimeInputValue}`;
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
                      id="deletionUntilDate"
                      hasError={!!validationMessages.endDate}
                      disabled={isDeleting}
                      value={new Date(inputValues.endDate as string)}
                      onChange={e => setInputValues.endDate(e as string[])}
                      locale={activeLocale}
                    />
                  </section>
                  {validationMessages.endDate && (
                    <ValidationBlock className={locals.validationMessage}>{validationMessages.endDate}</ValidationBlock>
                  )}
                </Label>
                <TimePicker
                  id={deleteLogsLocalisationStrings.deletionUntilTime}
                  labelText={deleteLogsLocalisationStrings.deletionUntilTime}
                  disabled={isDeleting}
                  size="sm"
                  value={inputValues.endTime as string}
                  invalid={!!validationMessages.endTime}
                  invalidText={validationMessages.endTime}
                  onChange={e => setInputValues.endTime(e)}
                />
              </section>
              <CarbonTextInput
                id={deleteLogsLocalisationStrings.deletionReason}
                invalid={!!validationMessages.reason}
                invalidText={validationMessages.reason}
                value={inputValues.reason}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputValues.reason(e.target.value)}
                disabled={isDeleting}
                name="reason"
                labelText={deleteLogsLocalisationStrings.deletionReason}
              />

              <CarbonTextInput
                id={deleteLogsLocalisationStrings.typeValidation}
                autoComplete="off"
                invalid={!!validationMessages.validation}
                invalidText={validationMessages.validation}
                disabled={isDeleting}
                value={inputValues.validation}
                onChange={(e: any) => setInputValues.validation(e.target.value)}
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
