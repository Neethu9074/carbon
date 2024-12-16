/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useState } from 'react';

import { createLogger } from '@instana/logger';
import { useObservable } from '@instana/hooks';

import CreateApplicationDialogPresenter from 'in-applications/creation/Dialog/CreateApplicationDialogPresenter';
import { AdvancedModeFooter } from 'in-alerting/smart-alerts/components/dialog/advanced/AdvancedModeFooter';
import { createApplicationPerspectiveForm } from 'in-applications/creation/form/createApplicationForm';
import { isQueryValid } from 'in-applications/creation/components/CreateApplicationQueryBuilder';
import AdvancedModeContainer from 'in-applications/creation/advanced/AdvancedModeContainer';
import SimpleModeContainer from 'in-applications/creation/simple/SimpleModeContainer';
import { useApplicationTracker } from 'in-applications/hooks/useApplicationTracker';
import { addApplicationConfigWithAlerting } from 'in-api/applicationConfigs';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { getUserRestrictedApplications } from 'in-api/users';
import { pendingResult } from 'in-services/fixedObjects';

const logger = createLogger('in-applications/creation/Dialog/CreateApplicationDialog');

export default function CreateApplicationDialog({ formData, timeConfig, onClose, getOnSavePath }) {
  const { goToPath } = useNavigation();
  const [form, setForm] = useState(() => createApplicationPerspectiveForm(formData));
  const [isSaving, setIsSaving] = useState(false);
  const [simpleMode, setSimpleMode] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const {
    trackApplicationCreationCloseDialogClicked,
    trackApplicationCreationModeSwitched,
    trackApplicationCreationCreateClicked
  } = useApplicationTracker();

  const userRestrictedApplicationsResult = useObservable(getUserRestrictedApplications, []) ?? pendingResult;

  const tagFilterExpression = form.get('tagFilterExpression')?.value;
  const validTagFilterExpressionResult =
    useObservable(isQueryValid, [tagFilterExpression, timeConfig]) ?? pendingResult;

  const onSaveSuccess = result => {
    goToPath(getOnSavePath(result));
    onClose();
  };

  const onCreate = () =>
    createApplication(
      form,
      setForm,
      isSaving,
      setIsSaving,
      trackApplicationCreationCreateClicked,
      onSaveSuccess,
      setErrorMessage
    );

  const withTrackClose = trackingConfig => {
    trackApplicationCreationCloseDialogClicked(trackingConfig ? { step: trackingConfig } : { mode: 'Advanced' });
    onClose();
  };

  const footer = simpleMode ? null : (
    <AdvancedModeFooter
      form={form}
      setForm={setForm}
      onClose={withTrackClose}
      onCreate={onCreate}
      isSaving={isSaving}
      additionalValidationCheck={() => validTagFilterExpressionResult?.data}
    />
  );

  return (
    <CreateApplicationDialogPresenter
      SimpleModeElement={SimpleModeContainer}
      AdvancedModeElement={AdvancedModeContainer}
      form={form}
      updateForm={setForm}
      timeConfig={timeConfig}
      onClose={onClose}
      onCreate={onCreate}
      simpleMode={simpleMode}
      isSaving={isSaving}
      setSimpleMode={setSimpleMode}
      trackModeSwitch={(simpleMode, step) => {
        trackApplicationCreationModeSwitched(
          simpleMode
            ? {
                destinationMode: 'Advanced Mode',
                step
              }
            : {
                destinationMode: 'Simple Mode'
              }
        );
      }}
      withTrackClose={withTrackClose}
      footer={footer}
      isValidTagFilterExpression={validTagFilterExpressionResult?.data}
      userRestrictedApplicationsResult={userRestrictedApplicationsResult}
      errorMessage={errorMessage}
    />
  );
}

function createApplication(form, setForm, isSaving, setIsSaving, track, onSuccess, setErrorMessage) {
  setIsSaving(true);
  setErrorMessage(null);

  if (!form.hierarchyValid) {
    setForm(form.setTouched(true, { recurse: true }));
    setIsSaving(false);
    return;
  }
  const entityToUpdate = form.toJS();
  const result$ = addApplicationConfigWithAlerting(entityToUpdate);

  result$.once(
    result => {
      track(entityToUpdate);
      onSuccess(result);
    },
    error => {
      logger.error(`failed to create AP: ${error.message}`, error);
      setIsSaving(false);
      setErrorMessage(error.message);
    }
  );
}
