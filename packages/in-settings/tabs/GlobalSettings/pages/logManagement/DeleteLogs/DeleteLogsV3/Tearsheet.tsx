/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

// eslint-disable-next-line no-restricted-imports
import { ProgressIndicator, ProgressStep } from '@carbon/react';
import React, { useState } from 'react';

import { Tearsheet } from '@instana/ibm-products';
import { Typography } from '@instana/components';
import { InlineLoading } from '@instana/carbon';

import { ConfirmSelectionPage } from 'in-settings/tabs/GlobalSettings/pages/logManagement/DeleteLogs/DeleteLogsV3/TabPages/ConfirmSelectionPage';
import {
  DeleteLogsV3Request,
  timeConfigFromTimeRange
} from 'in-settings/tabs/GlobalSettings/pages/logManagement/DeleteLogs/utils';
import { SelectLogsPage } from 'in-settings/tabs/GlobalSettings/pages/logManagement/DeleteLogs/DeleteLogsV3/TabPages/SelectLogsPage';
import { deleteLogsLocalisationStrings } from 'in-settings/tabs/GlobalSettings/pages/logManagement/DeleteLogs/localisationStrings';
import useDeleteLogsForm from 'in-settings/tabs/GlobalSettings/pages/logManagement/DeleteLogs/DeleteLogsV3/useDeleteLogsV3Form';
import { NotificationState } from 'in-settings/tabs/GlobalSettings/pages/logManagement/DeleteLogs/types';
import { toBackendQueryModel } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import { addMessage } from 'in-components/MessageFlyout/stores/messages';
import { deleteLogsV3 } from 'in-logging/api/deleteLogs';
import { user } from 'in-stores/user';

import locals from 'in-settings/tabs/GlobalSettings/pages/logManagement/DeleteLogs/DeleteLogs.mless';

interface DeleteLogsTearsheetProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export default function DeleteLogsTearsheet({ isOpen, setIsOpen }: DeleteLogsTearsheetProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [notification, setNotification] = useState<NotificationState>({ show: false, variant: 'success' });
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);

  const { canSubmit, canGoNextStep, setInputValues, inputValues, validationMessages, resetForm, touchForm } =
    useDeleteLogsForm();

  const closeConfirmationDialog = () => {
    setIsOpen(false);
    setNotification({ show: false, variant: 'success' });
    resetForm();
  };

  const isDeleteDisabled = !canSubmit || isDeleting;

  const handleSubmit = () => {
    if (isDeleteDisabled) {
      touchForm();
      return;
    }

    const params: DeleteLogsV3Request = {
      triggeredByUser: user?.email!,
      reason: inputValues.reason,
      timeConfig: timeConfigFromTimeRange(inputValues)!,
      tagFilterExpression: toBackendQueryModel(inputValues.tagFilterExpression)
    };

    const deleteLogs$ = deleteLogsV3(params);
    setIsDeleting(true);
    setNotification({ show: false, variant: 'success' });

    deleteLogs$.once(() => {
      setHasSubmitted(true);
      setNotification({ show: true, variant: 'success' });
      setIsDeleting(false);
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
    });

    deleteLogs$.errors().once(error => {
      const isNoLogsWarning = error.message.includes('No log data');
      const type = isNoLogsWarning ? 'warning' : 'danger';
      const icon = isNoLogsWarning ? 'lib_help_error_warning_outline' : 'lib_help_error_info_outline';
      const message = isNoLogsWarning
        ? deleteLogsLocalisationStrings.toastNoLogsMessage
        : deleteLogsLocalisationStrings.toastErrorMessage;
      const heading = isNoLogsWarning
        ? deleteLogsLocalisationStrings.warning
        : deleteLogsLocalisationStrings.toastErrorTitle;

      setNotification({ show: true, variant: 'error' });
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

  const renderTabPanels = () => {
    switch (currentStep) {
      case 0:
        return (
          <SelectLogsPage
            setInputValues={setInputValues}
            inputValues={inputValues}
            canGoNextStep={canGoNextStep}
            validationMessages={validationMessages}
          />
        );
      case 1:
        return (
          <ConfirmSelectionPage
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
      label: isDeleteButton ? (
        <>
          {labelButtons[0]} {isDeleting && <InlineLoading />}
        </>
      ) : (
        labelButtons[1]
      ),
      iconDescription: isDeleteButton ? labelButtons[0] : labelButtons[1],
      disabled: isDeleteButton ? !canSubmit || isDeleting || hasSubmitted : !canGoNextStep,
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
      disabled: currentStep === 0 || isDeleting
    } as any,
    {
      kind: 'ghost',
      label: 'Cancel',
      disabled: isDeleting,
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
          key="indicator"
          style={{ padding: '1.5rem' }}
          currentIndex={currentStep}
          onChange={idx => setCurrentStep(idx)}
          vertical
          spaceEqually
        >
          {/**This exists because the influencer is stealing focus from inputs**/}
          <div
            onKeyDown={e => {
              e.stopPropagation();
            }}
          >
            {steps}
          </div>
        </ProgressIndicator>
      );
    };

    return mapSteps();
  };
  return (
    // @ts-expect-error Tearsheet prop interface is incorrect, children are a valid prop
    <Tearsheet
      className={locals.tearsheet}
      onClose={() => setIsOpen(false)}
      open={isOpen}
      influencer={influencerContent()}
      title={deleteLogsLocalisationStrings.deleteLogs}
      label={'Powered by Instana'}
      description={deleteLogsLocalisationStrings.modalDescription}
      actions={actionButtons}
    >
      {renderTabPanels()}
    </Tearsheet>
  );
}
